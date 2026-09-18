// The compilation sits beside the category links in the homepage navigation.
const VIDEO_ID = '0RoVcXc_KGc';
export function renderCompilationVideo() {
  return `<div class="navi-compilation">
    <div class="navi-compilation-frame">
      <button class="guide-video-poster" type="button" data-video-id="${VIDEO_ID}" aria-label="14の備え 総集編を再生">
        <img src="/assets/video-thumbnails/compilation.jpg" width="1672" height="941" loading="lazy" alt="14の備え 総まとめ。命と暮らしを守る。備えニキ">
        <span class="guide-video-play" aria-hidden="true">▶</span>
      </button>
    </div>
    <a href="https://www.youtube.com/watch?v=${VIDEO_ID}" target="_blank" rel="noopener noreferrer">総集編をYouTubeで見る ↗</a>
    <script src="/assets/guide-video.js" defer></script>
  </div>`;
}
