const categories = ['Instagramでの商品・サービス紹介','本ページでの商品紹介','動画制作のご相談','その他'];
export default async function handler(req, res) {
  const send = (code, data) => { res.statusCode = code; res.setHeader('Content-Type','application/json; charset=utf-8'); res.setHeader('Cache-Control','no-store'); res.end(JSON.stringify(data)); };
  if (req.method !== 'POST') { res.setHeader('Allow','POST'); return send(405,{error:'POSTで送信してください。'}); }
  const origin = req.headers.origin;
  if (origin) { try { if (new URL(origin).host !== req.headers.host) return send(403,{error:'このページから送信してください。'}); } catch { return send(403,{error:'送信元を確認できません。'}); } }
  if (!req.headers['content-type']?.startsWith('application/json')) return send(415,{error:'送信形式が正しくありません。'});
  let body;
  try {
    if (req.body !== undefined) { body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; if (Buffer.byteLength(JSON.stringify(body)) > 24000) throw new Error(); }
    else { let raw = ''; for await (const chunk of req) { raw += chunk; if (Buffer.byteLength(raw) > 24000) throw new Error(); } body = JSON.parse(raw); }
  } catch { return send(400,{error:'入力内容が長すぎるか、送信形式が正しくありません。'}); }
  if (!body || typeof body !== 'object') return send(400,{error:'入力内容をご確認ください。'});
  if (body.website) return send(400,{error:'送信できませんでした。'});
  const fields = {};
  for (const [key,max] of Object.entries({name:100,company:150,email:254,message:5000,category:100})) {
    if (body[key] !== undefined && typeof body[key] !== 'string') return send(400,{error:'入力内容をご確認ください。'});
    fields[key] = (body[key] || '').trim();
    if (fields[key].length > max) return send(400,{error:'入力文字数をご確認ください。'});
  }
  const {name,company,email,message,category} = fields;
  if (!name || !message || !categories.includes(category) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /[\r\n]/.test(name+company+email)) return send(400,{error:'必須項目とメールアドレスをご確認ください。'});
  const {RESEND_API_KEY,CONTACT_TO_EMAIL,CONTACT_FROM_EMAIL} = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) return send(503,{error:'現在、メール受付を準備中です。お急ぎの方はInstagramのDMからご相談ください。'});
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method:'POST', headers:{Authorization:`Bearer ${RESEND_API_KEY}`,'Content-Type':'application/json'},
      body:JSON.stringify({from:CONTACT_FROM_EMAIL,to:[CONTACT_TO_EMAIL],reply_to:email,subject:`【備えニキHP】${category}`,text:`ご相談の種類：${category}\nお名前：${name}\n会社名：${company || '未記入'}\n返信先：${email}\n\n${message}`}),signal:AbortSignal.timeout(12000)
    });
    if (!response.ok) return send(502,{error:'送信できませんでした。時間をおいてお試しください。'});
    return send(200,{ok:true});
  } catch { return send(502,{error:'送信結果を確認できませんでした。時間をおいてご確認ください。'}); }
}
