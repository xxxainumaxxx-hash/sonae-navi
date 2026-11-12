m() { curl -sS -o "$1.mp3" -w "$1 %{http_code}\n" -X POST https://api.elevenlabs.io/v1/music -H 'Content-Type: application/json' -d "{\"prompt\":\"$2 Instrumental only, no vocals. Background music under a narrator, not too busy, steady volume.\",\"music_length_ms\":$3}"; }
m sr0 "Cute curious documentary opener: celesta, glockenspiel and soft pizzicato strings, a gentle playful rhythm, building curiosity." 36000 &
m sr1 "Nostalgic rural Japan in the mountains: soft piano and acoustic guitar, a little lonely but warm, quiet hope." 115000; wait
m sr2 "Small business struggle turning hopeful: light piano, clarinet and soft strings, gentle bouncing rhythm, a bright turn halfway, 100 bpm." 115000 &
m sr3 "Sweet and cute gift-giving melody: music box, ukulele and glockenspiel, cheerful and heartwarming, 108 bpm." 105000; wait
m sr4 "Spreading around the world: light pop beat with piano, pizzicato and soft synth, happy and uplifting, 112 bpm." 95000 &
m sr5 "Warm reflective finale: piano and strings with a music box touch, gentle build, tender and hopeful ending." 40000; wait
m sr6 "Cheerful warm outro for a YouTube end screen: music box, light piano, soft percussion, happy and relaxed, ends with a clean final chord." 24000; wait
