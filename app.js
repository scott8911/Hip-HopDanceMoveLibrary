'use strict';

// Add new moves here: id, name, level, category, description, videoUrl
const moves = [
  { id: 'two_steps', name: '2 Steps', level: 'Beginner', category: 'Groove', description: 'A foundational two-step pattern for hip-hop and b-boy grooves.', videoUrl: 'https://res.cloudinary.com/dpde5dep1/video/upload/v1771593052/dance_move2_2steps_ql3w7g.mp4' },
  { id: 'down_bounce', name: 'Down Bounce', level: 'Beginner', category: 'Groove', description: 'Classic down bounce move with the beat.', videoUrl: 'https://res.cloudinary.com/dpde5dep1/video/upload/v1771568605/move1_nxbkhw.mp4' },
  { id: 'three_step', name: '3 Step', level: 'Intermediate', category: 'Groove', description: 'Three-step groove pattern.', videoUrl: 'https://res.cloudinary.com/dpde5dep1/video/upload/v1771902635/3_steps-1_mr50z2.mp4' },
  { id: 'party_duke', name: 'Party Duke', level: 'Beginner', category: 'Groove', description: 'Party Duke move.', videoUrl: 'https://res.cloudinary.com/dpde5dep1/video/upload/v1771902679/party_duke-1_sfkatf.mp4' },
  { id: 'hit_dem_folks', name: 'Hit Dem Folks', level: 'Beginner', category: 'Groove', description: 'Hit dem folks move.', videoUrl: 'https://res.cloudinary.com/dpde5dep1/video/upload/v1771902714/hit_dem_folks-1_xvg6jh.mp4' },
  { id: 'around_the_world', name: 'Around the World', level: 'Beginner', category: 'Groove', description: 'Around the world move.', videoUrl: 'https://res.cloudinary.com/dpde5dep1/video/upload/v1771902719/around_the_world-1_kea9dc.mp4' },
  { id: 'box_step', name: 'Box Step', level: 'Beginner', category: 'Groove', description: 'Box step move.', videoUrl: 'https://res.cloudinary.com/dpde5dep1/video/upload/v1771902718/box_step-1_gji5nv.mp4' },
  { id: 'slide', name: 'Slide', level: 'Beginner', category: 'Groove', description: 'Slide move.', videoUrl: 'https://res.cloudinary.com/dpde5dep1/video/upload/v1771902794/slide-1_wrwqnf.mp4' },
  { id: 'roller_skate', name: 'Roller Skate', level: 'Beginner', category: 'Groove', description: 'Roller skate move.', videoUrl: 'https://res.cloudinary.com/dpde5dep1/video/upload/v1771902794/roller_skate-1_nexk1k.mp4' },
  { id: 'ronde_de_jambe', name: 'Ronde de Jambe', level: 'Intermediate', category: 'Groove', description: 'Ronde de jambe move.', videoUrl: 'https://res.cloudinary.com/dpde5dep1/video/upload/v1771902794/ronde_de_jambe-1_fvz6tx.mp4' },
  { id: 'skating', name: 'Skating', level: 'Beginner', category: 'Groove', description: 'Skating move.', videoUrl: 'https://res.cloudinary.com/dpde5dep1/video/upload/v1771902809/skating-1_nsmqqn.mp4' },
  { id: 'woah', name: 'Woah', level: 'Beginner', category: 'Groove', description: 'Woah move.', videoUrl: 'https://res.cloudinary.com/dpde5dep1/video/upload/v1771902924/woah-1_p8e46r.mp4' },
  { id: 'stanky_leg', name: 'Stanky Leg', level: 'Beginner', category: 'Groove', description: 'Stanky leg move.', videoUrl: 'https://res.cloudinary.com/dpde5dep1/video/upload/v1771902960/stanky_leg-1_xtdbhw.mp4' }
];

let selectedMoveId = null;
let listElements = [];
let currentPlaybackRate = 1;

/** Returns a lower-resolution URL for small previews (Cloudinary only). Full URL used for main player. */
function getPreviewVideoUrl(videoUrl) {
  if (!videoUrl || typeof videoUrl !== 'string') return videoUrl;
  const upload = '/video/upload/';
  const i = videoUrl.indexOf(upload);
  if (i === -1) return videoUrl;
  const prefix = videoUrl.slice(0, i + upload.length);
  const suffix = videoUrl.slice(i + upload.length);
  return prefix + 'w_320,c_fill,q_50/' + suffix;
}

function getEl(id) {
  return document.getElementById(id);
}

function showScreen(screenId) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach((el) => {
    el.hidden = el.id !== screenId;
  });
  const navHome = getEl('nav-home');
  const navLessons = getEl('nav-lessons');
  if (navHome) navHome.setAttribute('aria-current', screenId === 'landing' ? 'page' : null);
  if (navLessons) navLessons.setAttribute('aria-current', screenId === 'screen-browse' ? 'page' : null);
  if (screenId === 'screen-browse') {
    requestAnimationFrame(() => setupPreviewScrollObserver());
  } else {
    pausePreviewVideos();
  }
  if (screenId !== 'screen-move-detail') {
    const fullVideo = getEl('move-video');
    if (fullVideo) fullVideo.pause();
  }
}

function startPreviewPlays() {
  listElements.forEach(({ move: m, previewVideo }) => {
    if (m.videoUrl && previewVideo) previewVideo.play().catch(() => {});
  });
}

function pausePreviewVideos() {
  listElements.forEach(({ previewVideo }) => {
    if (previewVideo) previewVideo.pause();
  });
}

let previewScrollObserver = null;

function setupPreviewScrollObserver() {
  if (previewScrollObserver) previewScrollObserver.disconnect();
  const listEl = document.querySelector('.move-list-inner');
  if (!listEl || !listElements.length) return;
  previewScrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const li = entry.target;
        const item = listElements.find((x) => x.el === li);
        if (!item || !item.previewVideo) return;
        if (entry.isIntersecting) {
          if (item.move.videoUrl) item.previewVideo.play().catch(() => {});
        } else {
          item.previewVideo.pause();
        }
      });
    },
    { root: listEl, rootMargin: '20px', threshold: 0.25 }
  );
  listElements.forEach(({ el }) => previewScrollObserver.observe(el));
}

const FEATURED_MOVES_COUNT = 4;

function renderFeaturedCards() {
  const container = getEl('featured-cards');
  if (!container) return;
  container.innerHTML = '';
  const featuredMoves = moves.slice(0, FEATURED_MOVES_COUNT);
  featuredMoves.forEach((move) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'featured-card';
    card.setAttribute('data-move-id', move.id);

    const imageWrap = document.createElement('div');
    imageWrap.className = 'featured-card-image';
    const video = document.createElement('video');
    video.className = 'featured-card-video';
    video.muted = true;
    video.setAttribute('muted', '');
    video.setAttribute('loop', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('preload', 'metadata');
    if (move.videoUrl) {
      const src = document.createElement('source');
      src.src = getPreviewVideoUrl(move.videoUrl);
      src.type = move.videoUrl.toLowerCase().endsWith('.webm') ? 'video/webm' : 'video/mp4';
      video.appendChild(src);
    }
    imageWrap.appendChild(video);

    const nameEl = document.createElement('span');
    nameEl.className = 'featured-card-name';
    nameEl.textContent = move.name;

    const tagsEl = document.createElement('div');
    tagsEl.className = 'featured-card-tags';
    tagsEl.innerHTML = `
      <span class="featured-tag featured-tag-level">${escapeHtml(move.level)}</span>
      <span class="featured-tag featured-tag-category">${escapeHtml(move.category)}</span>
    `;

    card.appendChild(imageWrap);
    card.appendChild(nameEl);
    card.appendChild(tagsEl);
    container.appendChild(card);

    card.addEventListener('click', () => openMovePage(move.id));

    setupFeaturedVideoInView(card, video, move.videoUrl);
  });
}

function setupFeaturedVideoInView(card, video, videoUrl) {
  if (!videoUrl) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      });
    },
    { rootMargin: '40px', threshold: 0.2 }
  );
  observer.observe(card);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderMoveList() {
  const ul = document.querySelector('.move-list-inner');
  if (!ul) return;
  ul.innerHTML = '';
  listElements = moves.map((move) => {
    const li = document.createElement('li');
    li.setAttribute('role', 'option');
    li.setAttribute('tabindex', '0');
    li.setAttribute('data-move-id', move.id);
    li.className = 'move-list-item';

    const nameCell = document.createElement('div');
    nameCell.className = 'move-list-name-cell';
    nameCell.innerHTML = `<span class="move-list-name">${escapeHtml(move.name)}</span><span class="move-list-meta">${escapeHtml(move.level)}</span>`;

    const previewWrap = document.createElement('div');
    previewWrap.className = 'move-list-preview-wrap';
    const video = document.createElement('video');
    video.className = 'move-list-preview';
    video.muted = true;
    video.setAttribute('muted', '');
    video.setAttribute('loop', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('preload', 'metadata');
    if (move.videoUrl) {
      const src = document.createElement('source');
      src.src = getPreviewVideoUrl(move.videoUrl);
      src.type = move.videoUrl.toLowerCase().endsWith('.webm') ? 'video/webm' : 'video/mp4';
      video.appendChild(src);
    }
    previewWrap.appendChild(video);

    li.appendChild(nameCell);
    li.appendChild(previewWrap);
    ul.appendChild(li);
    return { move, el: li, previewVideo: video };
  });

  setupPreviewScrollObserver();
}

function selectMove(moveId) {
  const move = moves.find((m) => m.id === moveId);
  if (!move) return;
  selectedMoveId = moveId;

  const detailName = getEl('detail-name');
  const detailLevel = getEl('detail-level');
  const detailCategory = getEl('detail-category');
  const detailDescription = getEl('detail-description');
  const video = getEl('move-video');
  const videoSource = getEl('move-video-source');
  const videoFallback = getEl('video-fallback');
  const loopCheckbox = getEl('video-loop');

  if (detailName) detailName.textContent = move.name;
  if (detailLevel) detailLevel.textContent = move.level;
  if (detailCategory) detailCategory.textContent = move.category;
  if (detailDescription) detailDescription.textContent = move.description;

  if (move.videoUrl) {
    if (video) {
      video.hidden = false;
      video.muted = false;
      if (videoSource) {
        videoSource.src = move.videoUrl;
        videoSource.type = move.videoUrl.toLowerCase().endsWith('.webm') ? 'video/webm' : 'video/mp4';
      }
      video.load();
      video.playbackRate = currentPlaybackRate;
      if (loopCheckbox) video.loop = loopCheckbox.checked;
    }
    if (videoFallback) videoFallback.hidden = true;
  } else {
    if (video) video.hidden = true;
    if (videoFallback) videoFallback.hidden = false;
  }

  listElements.forEach(({ move: m, el }) => {
    el.classList.toggle('selected', m.id === moveId);
    el.setAttribute('aria-selected', m.id === moveId ? 'true' : 'false');
  });
}

function openMovePage(moveId) {
  pausePreviewVideos();
  selectMove(moveId);
  showScreen('screen-move-detail');
  const video = getEl('move-video');
  const loopCheckbox = getEl('video-loop');
  if (video && loopCheckbox) {
    video.loop = loopCheckbox.checked;
    video.play().catch(() => {});
  }
}

function initBrowse() {
  renderMoveList();

  const video = getEl('move-video');
  const playbackRateSelect = getEl('playback-rate');
  if (video && playbackRateSelect) {
    playbackRateSelect.addEventListener('change', () => {
      const rate = parseFloat(playbackRateSelect.value);
      if (!Number.isNaN(rate)) {
        currentPlaybackRate = rate;
        video.playbackRate = currentPlaybackRate;
      }
    });
  }

  const loopCheckbox = getEl('video-loop');
  if (loopCheckbox && video) {
    loopCheckbox.addEventListener('change', () => {
      video.loop = loopCheckbox.checked;
    });
  }

  listElements.forEach(({ move, el, previewVideo }) => {
    el.addEventListener('click', () => openMovePage(move.id));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openMovePage(move.id);
      }
    });
    el.addEventListener('mouseenter', () => {
      if (previewVideo && move.videoUrl) previewVideo.play().catch(() => {});
    });
    el.addEventListener('mouseleave', () => {
      if (previewVideo) previewVideo.pause();
    });
    el.addEventListener('focus', () => {
      if (previewVideo && move.videoUrl) previewVideo.play().catch(() => {});
    });
    el.addEventListener('blur', () => {
      if (previewVideo) previewVideo.pause();
    });
  });
}

function initNavigation() {
  showScreen('landing');

  getEl('btn-enter-library')?.addEventListener('click', () => showScreen('screen-browse'));
  getEl('back-from-browse')?.addEventListener('click', () => showScreen('landing'));
  getEl('back-from-move-detail')?.addEventListener('click', () => showScreen('screen-browse'));
  getEl('nav-home')?.addEventListener('click', () => showScreen('landing'));
  getEl('nav-lessons')?.addEventListener('click', () => showScreen('screen-browse'));

  renderFeaturedCards();
}

function init() {
  initNavigation();
  initBrowse();
}

document.addEventListener('DOMContentLoaded', init);
