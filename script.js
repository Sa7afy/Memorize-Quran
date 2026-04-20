'use strict';

/* =====================================================================
   CONSTANTS
   ===================================================================== */

// Total number of ayahs in the entire Quran
const TOTAL_AYAHS = 6236;

// SURAH_STARTS[S] gives the cumulative ayah count before surah S (1-indexed).
// globalAyahNumber for surah S, ayah A = SURAH_STARTS[S] + A
// e.g. SURAH_STARTS[1]=0 means Al-Fatiha starts at global ayah 1 (0+1).
const SURAH_STARTS = [
  0,1,8,294,494,670,790,954,1160,1236,1352,1474,1597,1650,1756,1820,1901,
  2029,2140,2250,2349,2484,2595,2674,2772,2856,3029,3198,3254,3340,3410,
  3469,3503,3534,3607,3660,3705,3788,3970,4058,4133,4218,4272,4325,4414,
  4473,4511,4545,4584,4613,4631,4675,4736,4756,4800,4846,4901,4979,5075,
  5104,5127,5150,5163,5177,5188,5199,5217,5227,5241,5271,5323,5375,5419,
  5447,5475,5495,5551,5592,5622,5672,5712,5760,5765,5772,5778,5788,5800,
  5810,5817,5825,5830,5840,5848,5855,5862,5866,5871,5876,5882,5891,5898,
  5903,5908,5912,5917,5920,5924,5927,5932,5937,5942,5946,5951,5958,5967,
  5973,5977,5988
];

const ALL_SURAHS = [
  {number:1,name:'الفاتحة'},{number:2,name:'البقرة'},{number:3,name:'آل عمران'},
  {number:4,name:'النساء'},{number:5,name:'المائدة'},{number:6,name:'الأنعام'},
  {number:7,name:'الأعراف'},{number:8,name:'الأنفال'},{number:9,name:'التوبة'},
  {number:10,name:'يونس'},{number:11,name:'هود'},{number:12,name:'يوسف'},
  {number:13,name:'الرعد'},{number:14,name:'إبراهيم'},{number:15,name:'الحجر'},
  {number:16,name:'النحل'},{number:17,name:'الإسراء'},{number:18,name:'الكهف'},
  {number:19,name:'مريم'},{number:20,name:'طه'},{number:21,name:'الأنبياء'},
  {number:22,name:'الحج'},{number:23,name:'المؤمنون'},{number:24,name:'النور'},
  {number:25,name:'الفرقان'},{number:26,name:'الشعراء'},{number:27,name:'النمل'},
  {number:28,name:'القصص'},{number:29,name:'العنكبوت'},{number:30,name:'الروم'},
  {number:31,name:'لقمان'},{number:32,name:'السجدة'},{number:33,name:'الأحزاب'},
  {number:34,name:'سبأ'},{number:35,name:'فاطر'},{number:36,name:'يس'},
  {number:37,name:'الصافات'},{number:38,name:'ص'},{number:39,name:'الزمر'},
  {number:40,name:'غافر'},{number:41,name:'فصلت'},{number:42,name:'الشورى'},
  {number:43,name:'الزخرف'},{number:44,name:'الدخان'},{number:45,name:'الجاثية'},
  {number:46,name:'الأحقاف'},{number:47,name:'محمد'},{number:48,name:'الفتح'},
  {number:49,name:'الحجرات'},{number:50,name:'ق'},{number:51,name:'الذاريات'},
  {number:52,name:'الطور'},{number:53,name:'النجم'},{number:54,name:'القمر'},
  {number:55,name:'الرحمن'},{number:56,name:'الواقعة'},{number:57,name:'الحديد'},
  {number:58,name:'المجادلة'},{number:59,name:'الحشر'},{number:60,name:'الممتحنة'},
  {number:61,name:'الصف'},{number:62,name:'الجمعة'},{number:63,name:'المنافقون'},
  {number:64,name:'التغابن'},{number:65,name:'الطلاق'},{number:66,name:'التحريم'},
  {number:67,name:'الملك'},{number:68,name:'القلم'},{number:69,name:'الحاقة'},
  {number:70,name:'المعارج'},{number:71,name:'نوح'},{number:72,name:'الجن'},
  {number:73,name:'المزمل'},{number:74,name:'المدثر'},{number:75,name:'القيامة'},
  {number:76,name:'الإنسان'},{number:77,name:'المرسلات'},{number:78,name:'النبأ'},
  {number:79,name:'النازعات'},{number:80,name:'عبس'},{number:81,name:'التكوير'},
  {number:82,name:'الانفطار'},{number:83,name:'المطففين'},{number:84,name:'الانشقاق'},
  {number:85,name:'البروج'},{number:86,name:'الطارق'},{number:87,name:'الأعلى'},
  {number:88,name:'الغاشية'},{number:89,name:'الفجر'},{number:90,name:'البلد'},
  {number:91,name:'الشمس'},{number:92,name:'الليل'},{number:93,name:'الضحى'},
  {number:94,name:'الشرح'},{number:95,name:'التين'},{number:96,name:'العلق'},
  {number:97,name:'القدر'},{number:98,name:'البينة'},{number:99,name:'الزلزلة'},
  {number:100,name:'العاديات'},{number:101,name:'القارعة'},{number:102,name:'التكاثر'},
  {number:103,name:'العصر'},{number:104,name:'الهمزة'},{number:105,name:'الفيل'},
  {number:106,name:'قريش'},{number:107,name:'الماعون'},{number:108,name:'الكوثر'},
  {number:109,name:'الكافرون'},{number:110,name:'النصر'},{number:111,name:'المسد'},
  {number:112,name:'الإخلاص'},{number:113,name:'الفلق'},{number:114,name:'الناس'}
];

/* =====================================================================
   PROGRESS & LOCALSTORAGE
   ===================================================================== */

let progress = {};

function loadProgress() {
  const defaults = {
    xp: 0, streak: 0, lastPracticeDate: null,
    dailyGoal: 10, todayReviewed: 0,
    completedSurahs: [], ayahWeights: {},
    dailyChallengeDate: null, dailyChallengeScore: null
  };
  try {
    const raw = localStorage.getItem('quranProgress');
    progress = raw ? Object.assign({}, defaults, JSON.parse(raw)) : Object.assign({}, defaults);
  } catch (e) {
    progress = Object.assign({}, defaults);
  }
}

function saveProgress() {
  localStorage.setItem('quranProgress', JSON.stringify(progress));
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

// Returns true if the streak counter increased
function updateStreak() {
  const today = todayString();
  if (progress.lastPracticeDate === today) return false;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().slice(0, 10);

  if (progress.lastPracticeDate === yStr) {
    progress.streak += 1;
  } else {
    progress.streak = 1;
  }
  progress.todayReviewed = 0;
  progress.lastPracticeDate = today;
  saveProgress();
  return true;
}

function awardXP(amount) {
  progress.xp += amount;
  progress.todayReviewed += 1;
  const streakUpdated = updateStreak();
  saveProgress();
  updateNavStats();
  updateGoalBar();
  showXPNotification('+' + amount + ' XP');
  if (streakUpdated && progress.streak > 1) {
    setTimeout(function () {
      showStreakNotification('🌙 سلسلة ' + progress.streak + ' أيام متتالية!');
    }, 1600);
  }
}

function showXPNotification(text) {
  var el = document.getElementById('xpNotification');
  el.textContent = text;
  el.classList.remove('hidden');
  clearTimeout(el._t);
  el._t = setTimeout(function () { el.classList.add('hidden'); }, 2400);
}

function showStreakNotification(text) {
  var el = document.getElementById('streakNotification');
  el.textContent = text;
  el.classList.remove('hidden');
  clearTimeout(el._t);
  el._t = setTimeout(function () { el.classList.add('hidden'); }, 3200);
}

function updateNavStats() {
  document.getElementById('navStreak').textContent = '🌙 ' + progress.streak + ' أيام';
  document.getElementById('navXP').textContent = '⭐ ' + progress.xp + ' XP';
}

function updateGoalBar() {
  var reviewed = progress.todayReviewed;
  var goal = progress.dailyGoal;
  document.getElementById('goalProgress').textContent = Math.min(reviewed, goal);
  document.getElementById('goalTarget').textContent = goal;
  var pct = Math.min(100, Math.round((reviewed / goal) * 100));
  document.getElementById('goalBarFill').style.width = pct + '%';
}

/* =====================================================================
   API — FETCH SURAH & TRANSLATION
   ===================================================================== */

var surahCache = {};
var translationCache = {};

async function fetchSurah(n) {
  if (surahCache[n]) return surahCache[n];
  showSpinner(true);
  try {
    var res = await fetch('https://api.alquran.cloud/v1/surah/' + n);
    var data = await res.json();
    if (data.status === 'OK' && data.data) {
      surahCache[n] = {
        number: data.data.number,
        name: data.data.name,
        englishName: data.data.englishName,
        numberOfAyahs: data.data.numberOfAyahs,
        ayahs: data.data.ayahs.map(function (a) {
          return { number: a.numberInSurah, text: a.text };
        })
      };
      return surahCache[n];
    }
    throw new Error('API error');
  } catch (e) {
    console.error('fetchSurah error:', e);
    alert('حدث خطأ في تحميل السورة. تأكد من الاتصال بالإنترنت وحاول مجدداً.');
    return null;
  } finally {
    showSpinner(false);
  }
}

async function fetchTranslation(n) {
  if (translationCache[n]) return translationCache[n];
  try {
    var res = await fetch('https://api.alquran.cloud/v1/surah/' + n + '/en.sahih');
    var data = await res.json();
    if (data.status === 'OK' && data.data) {
      translationCache[n] = data.data.ayahs.map(function (a) {
        return { number: a.numberInSurah, text: a.text };
      });
      return translationCache[n];
    }
  } catch (e) {
    console.error('fetchTranslation error:', e);
  }
  return null;
}

function showSpinner(show) {
  document.getElementById('globalSpinner').classList.toggle('hidden', !show);
}

/* =====================================================================
   NAVIGATION
   ===================================================================== */

var englishMode = false;
var currentPage = 'home';

function showPage(name) {
  document.querySelectorAll('[data-page]').forEach(function (el) {
    el.classList.remove('active');
  });
  var target = document.querySelector('[data-page="' + name + '"]');
  if (!target) return;
  target.classList.add('active');
  currentPage = name;
  window.scrollTo(0, 0);

  if (name === 'flashcards')      { initFlashcards(); }
  else if (name === 'fill-blank') { initFillBlank(); }
  else if (name === 'multiple-choice') { initMultipleChoice(); }
  else if (name === 'word-order') { initWordOrder(); }
  else if (name === 'listening')  { initListening(); }
  else if (name === 'sequential') { initSequential(); }
  else if (name === 'daily-challenge') { initDailyChallenge(); }
}

/* =====================================================================
   SHARED SURAH SELECTOR HELPER
   ===================================================================== */

function populateSurahDropdown(sel) {
  sel.innerHTML = '<option value="">اختر السورة</option>';
  ALL_SURAHS.forEach(function (s) {
    var opt = document.createElement('option');
    opt.value = s.number;
    opt.textContent = s.number + '. ' + s.name;
    sel.appendChild(opt);
  });
}

// Sets up dropdown + range row + full-surah button for a mode.
// config = { prefix: 'fc' }  => uses ids: fc-surah-select, fc-range-row, fc-start, fc-end, fc-full-btn
function setupSurahSelector(config) {
  var p = config.prefix;
  var sel      = document.getElementById(p + '-surah-select');
  var rangeRow = document.getElementById(p + '-range-row');
  var startInp = document.getElementById(p + '-start');
  var endInp   = document.getElementById(p + '-end');
  var fullBtn  = document.getElementById(p + '-full-btn');

  populateSurahDropdown(sel);
  rangeRow.classList.add('hidden');

  sel.addEventListener('change', async function () {
    var n = parseInt(this.value);
    if (!n) { rangeRow.classList.add('hidden'); return; }
    var surah = await fetchSurah(n);
    if (!surah) return;
    rangeRow.classList.remove('hidden');
    startInp.value = 1;
    startInp.max   = surah.numberOfAyahs;
    endInp.value   = surah.numberOfAyahs;
    endInp.max     = surah.numberOfAyahs;
    if (config.onLoad) config.onLoad(surah);
  });

  fullBtn.addEventListener('click', function () {
    var n = parseInt(sel.value);
    if (!n || !surahCache[n]) return;
    startInp.value = 1;
    endInp.value   = surahCache[n].numberOfAyahs;
  });
}

function getRange(prefix) {
  var n = parseInt(document.getElementById(prefix + '-surah-select').value);
  if (!n || !surahCache[n]) return null;
  var surah = surahCache[n];
  var start = Math.max(1, parseInt(document.getElementById(prefix + '-start').value) || 1);
  var end   = Math.min(surah.numberOfAyahs, parseInt(document.getElementById(prefix + '-end').value) || surah.numberOfAyahs);
  if (start > end) end = start;
  return { surah: surah, start: start, end: end };
}

/* =====================================================================
   UTILITY
   ===================================================================== */

// Strip Arabic diacritics for lenient comparison
function stripDiacritics(s) {
  return (s || '').replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0640]/g, '').trim();
}

function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

function pickRandom(arr, n) {
  return shuffle(arr).slice(0, n);
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

// Simple deterministic hash of a string
function strHash(s) {
  var h = 0;
  for (var i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// Deterministic shuffle using a seed
function deterministicShuffle(arr, seed) {
  var a = arr.slice();
  var s = seed >>> 0;
  for (var i = a.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    var j = s % (i + 1);
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

/* =====================================================================
   MODE 1 — FLASHCARDS
   ===================================================================== */

var fcState = { initialized: false, surah: null, start: 1, end: 1, flipped: false, currentAyahNum: 1 };

function initFlashcards() {
  if (fcState.initialized) return;
  fcState.initialized = true;

  setupSurahSelector({ prefix: 'fc' });

  document.getElementById('fc-back-btn').addEventListener('click', function () { showPage('home'); });
  document.getElementById('fc-start-btn').addEventListener('click', fcStartSession);
  document.getElementById('fc-card').addEventListener('click', fcFlip);
  document.getElementById('fc-known').addEventListener('click', function () { fcRate('known'); });
  document.getElementById('fc-learning').addEventListener('click', function () { fcRate('learning'); });
  document.getElementById('fc-unknown').addEventListener('click', function () { fcRate('unknown'); });
}

async function fcStartSession() {
  var r = getRange('fc');
  if (!r) { alert('الرجاء اختيار سورة أولاً'); return; }
  fcState.surah = r.surah;
  fcState.start = r.start;
  fcState.end   = r.end;

  if (englishMode) fetchTranslation(r.surah.number);

  document.getElementById('fc-area').classList.remove('hidden');
  document.getElementById('fc-selector-panel').classList.add('hidden');
  fcNextCard();
}

function fcWeightedRandom() {
  var surah = fcState.surah;
  var pool = [], weights = [];
  for (var i = fcState.start; i <= fcState.end; i++) {
    var key = surah.number + '-' + i;
    pool.push(i);
    weights.push(progress.ayahWeights[key] || 1);
  }
  var total = weights.reduce(function (a, b) { return a + b; }, 0);
  var r = Math.random() * total;
  for (var j = 0; j < pool.length; j++) {
    r -= weights[j];
    if (r <= 0) return pool[j];
  }
  return pool[pool.length - 1];
}

function fcNextCard() {
  var ayahNum  = fcWeightedRandom();
  var ayah     = fcState.surah.ayahs[ayahNum - 1];
  var nextAyah = fcState.surah.ayahs[ayahNum]; // ayahNum is 1-indexed; [ayahNum] = index ayahNum = N+1

  fcState.currentAyahNum = ayahNum;
  fcState.flipped = false;
  document.getElementById('fc-card').classList.remove('flipped');
  document.getElementById('fc-rating-btns').classList.add('hidden');

  document.getElementById('fc-surah-label').textContent = fcState.surah.name + ' — الآية ' + ayahNum;
  document.getElementById('fc-question').textContent = ayah.text;

  if (nextAyah) {
    document.getElementById('fc-answer-label').textContent = fcState.surah.name + ' — الآية ' + nextAyah.number;
    document.getElementById('fc-answer').textContent = nextAyah.text;
  } else {
    document.getElementById('fc-answer-label').textContent = 'نهاية السورة';
    document.getElementById('fc-answer').textContent = '(نهاية السورة الكريمة)';
  }

  // Translation
  document.getElementById('fc-translation').classList.add('hidden');
  document.getElementById('fc-answer-translation').classList.add('hidden');

  if (englishMode && translationCache[fcState.surah.number]) {
    var trans = translationCache[fcState.surah.number];
    var t1 = trans[ayahNum - 1];
    if (t1) {
      document.getElementById('fc-translation').textContent = t1.text;
      document.getElementById('fc-translation').classList.remove('hidden');
    }
    if (nextAyah) {
      var t2 = trans[ayahNum];
      if (t2) {
        document.getElementById('fc-answer-translation').textContent = t2.text;
        document.getElementById('fc-answer-translation').classList.remove('hidden');
      }
    }
  }
}

function fcFlip() {
  if (!fcState.surah) return;
  fcState.flipped = !fcState.flipped;
  document.getElementById('fc-card').classList.toggle('flipped', fcState.flipped);
  if (fcState.flipped) {
    document.getElementById('fc-rating-btns').classList.remove('hidden');
  }
}

function fcRate(rating) {
  var key = fcState.surah.number + '-' + fcState.currentAyahNum;
  var w   = progress.ayahWeights[key] || 1;
  if (rating === 'known') {
    progress.ayahWeights[key] = Math.max(0.25, w * 0.5);
    awardXP(10);
  } else if (rating === 'learning') {
    progress.ayahWeights[key] = w; // unchanged
  } else {
    progress.ayahWeights[key] = Math.min(8, w * 2);
  }
  saveProgress();
  document.getElementById('fc-rating-btns').classList.add('hidden');
  setTimeout(fcNextCard, 280);
}

// Keyboard shortcuts for flashcards
document.addEventListener('keydown', function (e) {
  if (currentPage !== 'flashcards' || !fcState.surah) return;
  if (e.code === 'Space') { e.preventDefault(); fcFlip(); }
  else if (e.key === '1') fcRate('known');
  else if (e.key === '2') fcRate('learning');
  else if (e.key === '3') fcRate('unknown');
});

/* =====================================================================
   MODE 2 — FILL IN THE BLANK
   ===================================================================== */

var fbState = { initialized: false, surah: null, start: 1, end: 1, blanks: [], blankIndices: [] };

function initFillBlank() {
  if (fbState.initialized) return;
  fbState.initialized = true;

  setupSurahSelector({ prefix: 'fb' });

  document.getElementById('fb-back-btn').addEventListener('click', function () { showPage('home'); });
  document.getElementById('fb-start-btn').addEventListener('click', fbStartSession);
  document.getElementById('fb-check-btn').addEventListener('click', fbCheck);
  document.getElementById('fb-next-btn').addEventListener('click', fbNext);
}

async function fbStartSession() {
  var r = getRange('fb');
  if (!r) { alert('الرجاء اختيار سورة أولاً'); return; }
  fbState.surah = r.surah;
  fbState.start = r.start;
  fbState.end   = r.end;
  if (englishMode) fetchTranslation(r.surah.number);
  document.getElementById('fb-area').classList.remove('hidden');
  document.getElementById('fb-selector-panel').classList.add('hidden');
  fbGenerateQuestion();
}

function fbGenerateQuestion() {
  var surah = fbState.surah;
  var range = fbState.end - fbState.start;
  var ayahNum = fbState.start + Math.floor(Math.random() * (range + 1));
  var ayah = surah.ayahs[ayahNum - 1];
  var difficulty = document.getElementById('fb-difficulty').value;
  var words = ayah.text.split(' ');

  var blankIndices = [];
  if (words.length < 3) {
    blankIndices = [words.length - 1];
  } else if (difficulty === 'easy') {
    blankIndices = [words.length - 1];
  } else if (difficulty === 'medium') {
    blankIndices = [Math.floor(words.length / 2)];
  } else {
    // hard: 2-3 random non-first words
    var count = Math.min(3, Math.floor(words.length / 2));
    var indices = [];
    var attempts = 0;
    while (indices.length < count && attempts < 100) {
      attempts++;
      var idx = 1 + Math.floor(Math.random() * (words.length - 1));
      if (indices.indexOf(idx) === -1) indices.push(idx);
    }
    blankIndices = indices.sort(function (a, b) { return a - b; });
  }

  fbState.blanks       = blankIndices.map(function (i) { return words[i]; });
  fbState.blankIndices = blankIndices;

  // Build display HTML
  var display = words.map(function (w, i) {
    return blankIndices.indexOf(i) >= 0
      ? '<span class="blank-placeholder">[___]</span>'
      : w;
  }).join(' ');

  document.getElementById('fb-surah-label').textContent = surah.name + ' — الآية ' + ayahNum;
  document.getElementById('fb-ayah-display').innerHTML = display;

  // Translation
  var tranEl = document.getElementById('fb-translation-display');
  tranEl.classList.add('hidden');
  if (englishMode && translationCache[surah.number]) {
    var t = translationCache[surah.number][ayahNum - 1];
    if (t) { tranEl.textContent = t.text; tranEl.classList.remove('hidden'); }
  }

  // Build input fields
  var inputsArea = document.getElementById('fb-inputs-area');
  inputsArea.innerHTML = '';
  blankIndices.forEach(function (_, i) {
    var group = document.createElement('div');
    group.className = 'fb-input-group';

    var lbl = document.createElement('label');
    lbl.textContent = 'الكلمة ' + (i + 1) + ':';

    var inp = document.createElement('input');
    inp.type = 'text';
    inp.className = 'fb-word-input';
    inp.id = 'fb-inp-' + i;
    inp.placeholder = 'اكتب الكلمة المفقودة';
    inp.autocomplete = 'off';
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') fbCheck();
    });

    group.appendChild(lbl);
    group.appendChild(inp);
    inputsArea.appendChild(group);
  });

  document.getElementById('fb-result').classList.add('hidden');
  document.getElementById('fb-next-btn').classList.add('hidden');
  document.getElementById('fb-check-btn').classList.remove('hidden');

  setTimeout(function () {
    var f = document.getElementById('fb-inp-0');
    if (f) f.focus();
  }, 80);
}

function fbCheck() {
  var xpMap = { easy: 5, medium: 10, hard: 15 };
  var allCorrect = true;

  fbState.blanks.forEach(function (correct, i) {
    var inp = document.getElementById('fb-inp-' + i);
    if (!inp) return;
    var user = stripDiacritics(inp.value);
    var tgt  = stripDiacritics(correct);
    if (user === tgt) {
      inp.classList.add('correct');
      inp.classList.remove('incorrect');
    } else {
      inp.classList.add('incorrect');
      inp.classList.remove('correct');
      allCorrect = false;
      if (!inp.parentNode.querySelector('.correct-answer-hint')) {
        var hint = document.createElement('div');
        hint.className = 'correct-answer-hint';
        hint.textContent = 'الصواب: ' + correct;
        inp.parentNode.appendChild(hint);
      }
    }
    inp.disabled = true;
  });

  var resultEl = document.getElementById('fb-result');
  if (allCorrect) {
    resultEl.textContent = '✓ أحسنت! إجابة صحيحة';
    resultEl.className = 'result-msg correct';
    var diff = document.getElementById('fb-difficulty').value;
    awardXP(xpMap[diff] || 10);
  } else {
    resultEl.textContent = '✗ راجع الإجابات الصحيحة أعلاه';
    resultEl.className = 'result-msg incorrect';
  }
  resultEl.classList.remove('hidden');

  document.getElementById('fb-check-btn').classList.add('hidden');
  document.getElementById('fb-next-btn').classList.remove('hidden');
}

function fbNext() {
  fbState.blanks.forEach(function (_, i) {
    var inp = document.getElementById('fb-inp-' + i);
    if (!inp) return;
    inp.classList.remove('correct', 'incorrect');
    var hint = inp.parentNode.querySelector('.correct-answer-hint');
    if (hint) hint.remove();
  });
  fbGenerateQuestion();
}

/* =====================================================================
   MODE 3 — MULTIPLE CHOICE
   ===================================================================== */

var mcState = { initialized: false, surah: null, start: 1, end: 1,
                correct: 0, total: 0, answered: false };

function initMultipleChoice() {
  if (mcState.initialized) return;
  mcState.initialized = true;

  setupSurahSelector({ prefix: 'mc' });

  document.getElementById('mc-back-btn').addEventListener('click', function () { showPage('home'); });
  document.getElementById('mc-start-btn').addEventListener('click', mcStartSession);
  document.getElementById('mc-next-btn').addEventListener('click', mcNext);
}

async function mcStartSession() {
  var r = getRange('mc');
  if (!r) { alert('الرجاء اختيار سورة أولاً'); return; }
  if (r.surah.numberOfAyahs < 4) {
    alert('هذه السورة قصيرة جداً لهذا النشاط. الرجاء اختيار سورة أخرى.');
    return;
  }
  mcState.surah   = r.surah;
  mcState.start   = r.start;
  mcState.end     = r.end;
  mcState.correct = 0;
  mcState.total   = 0;
  mcState.answered = false;

  if (englishMode) fetchTranslation(r.surah.number);

  document.getElementById('mc-area').classList.remove('hidden');
  document.getElementById('mc-selector-panel').classList.add('hidden');
  mcUpdateScore();
  mcGenerateQuestion();
}

function mcUpdateScore() {
  document.getElementById('mc-correct').textContent = mcState.correct;
  document.getElementById('mc-total').textContent   = mcState.total;
}

function mcGenerateQuestion() {
  var surah = mcState.surah;
  // We show ayah N and ask for ayah N+1, so N can be at most numberOfAyahs-1
  var maxStart = Math.min(mcState.end, surah.numberOfAyahs - 1);
  var minStart = mcState.start;
  if (minStart > maxStart) minStart = 1;

  var ayahNum  = minStart + Math.floor(Math.random() * (maxStart - minStart + 1));
  var ayah     = surah.ayahs[ayahNum - 1];
    var nextAyah = surah.ayahs[ayahNum]; // 0-indexed: ayahs[N] = the (N+1)th ayah (next after current)

  if (!nextAyah) { mcGenerateQuestion(); return; }

  mcState.answered = false;

  document.getElementById('mc-surah-label').textContent  = surah.name + ' — الآية ' + ayahNum;
  document.getElementById('mc-current-ayah').textContent = ayah.text;

  var transEl = document.getElementById('mc-translation');
  transEl.classList.add('hidden');
  if (englishMode && translationCache[surah.number]) {
    var t = translationCache[surah.number][ayahNum - 1];
    if (t) { transEl.textContent = t.text; transEl.classList.remove('hidden'); }
  }

  // Build options: correct + 3 decoys from same surah
  var allIndices = surah.ayahs.map(function (_, i) { return i; }).filter(function (i) { return i !== ayahNum; });
  var decoys     = pickRandom(allIndices, 3).map(function (i) { return surah.ayahs[i]; });
  var options    = shuffle([nextAyah].concat(decoys));
  var correctIdx = options.indexOf(nextAyah);

  var optionsEl = document.getElementById('mc-options');
  optionsEl.innerHTML = '';
  document.getElementById('mc-next-btn').classList.add('hidden');

  options.forEach(function (opt, i) {
    var btn = document.createElement('div');
    btn.className = 'mc-option';
    btn.textContent = opt.text;
    btn.addEventListener('click', function () {
      mcAnswer(i, btn, correctIdx, optionsEl);
    });
    optionsEl.appendChild(btn);
  });
}

function mcAnswer(selectedIdx, btn, correctIdx, optionsEl) {
  if (mcState.answered) return;
  mcState.answered = true;
  mcState.total += 1;

  var opts = optionsEl.querySelectorAll('.mc-option');
  opts.forEach(function (o) { o.classList.add('disabled'); });
  opts[correctIdx].classList.add('correct');

  if (selectedIdx === correctIdx) {
    mcState.correct += 1;
    awardXP(10);
  } else {
    btn.classList.add('incorrect');
  }

  mcUpdateScore();
  document.getElementById('mc-next-btn').classList.remove('hidden');
}

function mcNext() { mcGenerateQuestion(); }

/* =====================================================================
   MODE 4 — WORD ORDER PUZZLE
   ===================================================================== */

var woState = { initialized: false, surah: null, start: 1, end: 1,
                originalWords: [], timerInterval: null, timeLeft: 60 };

function initWordOrder() {
  if (woState.initialized) return;
  woState.initialized = true;

  setupSurahSelector({ prefix: 'wo' });

  document.getElementById('wo-back-btn').addEventListener('click', function () {
    woStopTimer();
    showPage('home');
  });
  document.getElementById('wo-start-btn').addEventListener('click', woStartSession);
  document.getElementById('wo-check-btn').addEventListener('click', woCheck);
  document.getElementById('wo-next-btn').addEventListener('click', woNext);
}

async function woStartSession() {
  var r = getRange('wo');
  if (!r) { alert('الرجاء اختيار سورة أولاً'); return; }
  woState.surah    = r.surah;
  woState.start    = r.start;
  woState.end      = r.end;
  woState.useTimer = document.getElementById('wo-timer-toggle').checked;

  document.getElementById('wo-area').classList.remove('hidden');
  document.getElementById('wo-selector-panel').classList.add('hidden');
  woGenerateQuestion();
}

function woGenerateQuestion() {
  woStopTimer();

  var surah   = woState.surah;
  var range   = woState.end - woState.start;
  var ayahNum = woState.start + Math.floor(Math.random() * (range + 1));
  var ayah    = surah.ayahs[ayahNum - 1];

  woState.originalWords = ayah.text.split(' ');

  document.getElementById('wo-surah-label').textContent = surah.name + ' — الآية ' + ayahNum;

  var answerArea = document.getElementById('wo-answer-area');
  var wordBank   = document.getElementById('wo-word-bank');
  answerArea.innerHTML = '';
  wordBank.innerHTML   = '';

  var shuffled = shuffle(woState.originalWords.slice());

  shuffled.forEach(function (word) {
    wordBank.appendChild(woCreateTile(word, answerArea, wordBank));
  });

  // Drop-zone drag support
  woSetupDropZone(answerArea);
  woSetupDropZone(wordBank);

  document.getElementById('wo-result').classList.add('hidden');
  document.getElementById('wo-next-btn').classList.add('hidden');
  document.getElementById('wo-check-btn').classList.remove('hidden');

  if (woState.useTimer) {
    document.getElementById('wo-timer-display').classList.remove('hidden');
    document.getElementById('wo-timer-display').classList.remove('urgent');
    woStartTimer();
  } else {
    document.getElementById('wo-timer-display').classList.add('hidden');
  }
}

function woCreateTile(word, answerArea, wordBank) {
  var tile = document.createElement('div');
  tile.className = 'word-tile';
  tile.textContent = word;
  tile.draggable = true;

  tile.addEventListener('click', function () {
    if (tile.parentNode === wordBank) {
      answerArea.appendChild(tile);
    } else {
      wordBank.appendChild(tile);
    }
  });

  tile.addEventListener('dragstart', function (e) {
    e.dataTransfer.setData('text/plain', '');
    tile.classList.add('dragging');
    woState._dragging = tile;
  });

  tile.addEventListener('dragend', function () {
    tile.classList.remove('dragging');
    woState._dragging = null;
  });

  return tile;
}

function woSetupDropZone(zone) {
  zone.addEventListener('dragover', function (e) {
    e.preventDefault();
    zone.classList.add('drag-over');
  });
  zone.addEventListener('dragleave', function () {
    zone.classList.remove('drag-over');
  });
  zone.addEventListener('drop', function (e) {
    e.preventDefault();
    zone.classList.remove('drag-over');
    if (woState._dragging) {
      zone.appendChild(woState._dragging);
    }
  });
}

function woStartTimer() {
  woState.timeLeft = 60;
  document.getElementById('wo-timer').textContent = 60;
  woState.timerInterval = setInterval(function () {
    woState.timeLeft -= 1;
    document.getElementById('wo-timer').textContent = woState.timeLeft;
    if (woState.timeLeft <= 10) {
      document.getElementById('wo-timer-display').classList.add('urgent');
    }
    if (woState.timeLeft <= 0) {
      woStopTimer();
      woCheck();
    }
  }, 1000);
}

function woStopTimer() {
  if (woState.timerInterval) {
    clearInterval(woState.timerInterval);
    woState.timerInterval = null;
  }
}

function woCheck() {
  woStopTimer();

  var answerArea  = document.getElementById('wo-answer-area');
  var tiles       = answerArea.querySelectorAll('.word-tile');
  var userWords   = Array.from(tiles).map(function (t) { return t.textContent; });
  var original    = woState.originalWords;

  if (userWords.length === 0) {
    alert('الرجاء وضع الكلمات في منطقة الإجابة أولاً');
    return;
  }

  var correctCount = 0;
  tiles.forEach(function (tile, i) {
    if (i < original.length && stripDiacritics(tile.textContent) === stripDiacritics(original[i])) {
      tile.classList.add('correct-tile');
      correctCount++;
    } else {
      tile.classList.add('incorrect-tile');
    }
  });

  var resultEl = document.getElementById('wo-result');
  var perfect  = correctCount === original.length && userWords.length === original.length;

  if (perfect) {
    resultEl.textContent = '✓ ممتاز! الترتيب صحيح تماماً';
    resultEl.className   = 'result-msg correct';
    awardXP(20);
  } else if (correctCount > original.length / 2) {
    resultEl.textContent = correctCount + '/' + original.length + ' كلمة في مكانها الصحيح';
    resultEl.className   = 'result-msg incorrect';
    awardXP(5);
  } else {
    resultEl.textContent = correctCount + '/' + original.length + ' كلمة في مكانها الصحيح';
    resultEl.className   = 'result-msg incorrect';
  }

  resultEl.classList.remove('hidden');
  document.getElementById('wo-check-btn').classList.add('hidden');
  document.getElementById('wo-next-btn').classList.remove('hidden');
}

function woNext() { woGenerateQuestion(); }

/* =====================================================================
   MODE 5 — LISTENING
   ===================================================================== */

var liState = { initialized: false, surah: null, start: 1, end: 1,
                currentAyahNum: 1, answered: false };

function initListening() {
  if (liState.initialized) return;
  liState.initialized = true;

  setupSurahSelector({ prefix: 'li' });

  document.getElementById('li-back-btn').addEventListener('click', function () {
    var audio = document.getElementById('li-audio');
    audio.pause();
    showPage('home');
  });
  document.getElementById('li-start-btn').addEventListener('click', liStartSession);
  document.getElementById('li-done-btn').addEventListener('click', liShowQuestion);
  document.getElementById('li-next-btn').addEventListener('click', liNext);

  document.getElementById('li-audio').addEventListener('ended', function () {
    setTimeout(liShowQuestion, 400);
  });
}

async function liStartSession() {
  var r = getRange('li');
  if (!r) { alert('الرجاء اختيار سورة أولاً'); return; }
  if (r.surah.numberOfAyahs < 3) {
    alert('هذه السورة قصيرة جداً لهذا النشاط.');
    return;
  }
  liState.surah = r.surah;
  liState.start = r.start;
  liState.end   = r.end;

  document.getElementById('li-area').classList.remove('hidden');
  document.getElementById('li-selector-panel').classList.add('hidden');
  liGenerateQuestion();
}

function liGenerateQuestion() {
  var surah   = liState.surah;
  // Need ayah N and N+1, so max ayahNum = numberOfAyahs-1
  var maxN    = Math.min(liState.end, surah.numberOfAyahs - 1);
  var minN    = liState.start;
  if (minN > maxN) minN = 1;

  var ayahNum = minN + Math.floor(Math.random() * (maxN - minN + 1));
  liState.currentAyahNum = ayahNum;
  liState.answered = false;

  var globalNum = SURAH_STARTS[surah.number] + ayahNum;

  document.getElementById('li-surah-label').textContent = surah.name + ' — الآية ' + ayahNum;

  var audio = document.getElementById('li-audio');
  audio.src = 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/' + globalNum + '.mp3';
  audio.load();
  audio.play().catch(function () {});

  document.getElementById('li-question-area').classList.add('hidden');
  document.getElementById('li-done-btn').classList.remove('hidden');
  document.getElementById('li-next-btn').classList.add('hidden');
  document.getElementById('li-options').innerHTML = '';
}

function liShowQuestion() {
  if (liState.answered) return;

  var surah    = liState.surah;
  var ayahNum  = liState.currentAyahNum;
  var nextAyah = surah.ayahs[ayahNum]; // N+1

  if (!nextAyah) { liNext(); return; }

  document.getElementById('li-done-btn').classList.add('hidden');
  document.getElementById('li-question-area').classList.remove('hidden');

  var allIdx  = surah.ayahs.map(function (_, i) { return i; }).filter(function (i) { return i !== ayahNum; });
  var decoys  = pickRandom(allIdx, 3).map(function (i) { return surah.ayahs[i]; });
  var options = shuffle([nextAyah].concat(decoys));
  var corrIdx = options.indexOf(nextAyah);

  var optEl = document.getElementById('li-options');
  optEl.innerHTML = '';

  options.forEach(function (opt, i) {
    var btn = document.createElement('div');
    btn.className = 'mc-option';
    btn.textContent = opt.text;
    btn.addEventListener('click', function () {
      liAnswer(i, btn, corrIdx, optEl);
    });
    optEl.appendChild(btn);
  });
}

function liAnswer(selectedIdx, btn, corrIdx, optEl) {
  if (liState.answered) return;
  liState.answered = true;

  var opts = optEl.querySelectorAll('.mc-option');
  opts.forEach(function (o) { o.classList.add('disabled'); });
  opts[corrIdx].classList.add('correct');

  if (selectedIdx === corrIdx) {
    awardXP(10);
  } else {
    btn.classList.add('incorrect');
  }

  document.getElementById('li-next-btn').classList.remove('hidden');
}

function liNext() { liGenerateQuestion(); }

/* =====================================================================
   MODE 6 — SEQUENTIAL REVIEW
   ===================================================================== */

var sqState = { initialized: false, surah: null, ayahs: [], idx: 0, known: 0, unknown: 0 };

function initSequential() {
  if (sqState.initialized) return;
  sqState.initialized = true;

  setupSurahSelector({ prefix: 'sq' });

  document.getElementById('sq-back-btn').addEventListener('click', function () { showPage('home'); });
  document.getElementById('sq-start-btn').addEventListener('click', sqStartSession);
  document.getElementById('sq-known-btn').addEventListener('click', function () { sqRespond(true); });
  document.getElementById('sq-unknown-btn').addEventListener('click', function () { sqRespond(false); });
  document.getElementById('sq-home-btn').addEventListener('click', function () { showPage('home'); });
}

async function sqStartSession() {
  var r = getRange('sq');
  if (!r) { alert('الرجاء اختيار سورة أولاً'); return; }
  sqState.surah   = r.surah;
  sqState.ayahs   = r.surah.ayahs.filter(function (a) { return a.number >= r.start && a.number <= r.end; });
  sqState.idx     = 0;
  sqState.known   = 0;
  sqState.unknown = 0;

  if (englishMode) fetchTranslation(r.surah.number);

  document.getElementById('sq-area').classList.remove('hidden');
  document.getElementById('sq-summary').classList.add('hidden');
  document.getElementById('sq-selector-panel').classList.add('hidden');
  document.getElementById('sq-total-num').textContent = sqState.ayahs.length;
  sqShowAyah();
}

function sqShowAyah() {
  if (sqState.idx >= sqState.ayahs.length) { sqShowSummary(); return; }

  var ayah  = sqState.ayahs[sqState.idx];
  var total = sqState.ayahs.length;

  document.getElementById('sq-surah-label').textContent = sqState.surah.name + ' — الآية ' + ayah.number;
  document.getElementById('sq-ayah-text').textContent   = ayah.text;
  document.getElementById('sq-current-num').textContent  = sqState.idx + 1;

  var pct = Math.round((sqState.idx / total) * 100);
  document.getElementById('sq-progress-fill').style.width = pct + '%';

  var transEl = document.getElementById('sq-translation');
  transEl.classList.add('hidden');
  if (englishMode && translationCache[sqState.surah.number]) {
    var t = translationCache[sqState.surah.number][ayah.number - 1];
    if (t) { transEl.textContent = t.text; transEl.classList.remove('hidden'); }
  }
}

function sqRespond(known) {
  if (known) { sqState.known++; awardXP(5); }
  else       { sqState.unknown++; }
  sqState.idx++;
  sqShowAyah();
}

function sqShowSummary() {
  document.getElementById('sq-area').classList.add('hidden');
  var sumEl = document.getElementById('sq-summary');
  sumEl.classList.remove('hidden');

  var total = sqState.known + sqState.unknown;
  var pct   = total > 0 ? Math.round((sqState.known / total) * 100) : 0;

  document.getElementById('sq-known-count').textContent   = sqState.known;
  document.getElementById('sq-unknown-count').textContent  = sqState.unknown;
  document.getElementById('sq-percent').textContent        = pct + '%';
  document.getElementById('sq-progress-fill').style.width  = '100%';
}

/* =====================================================================
   MODE 7 — DAILY CHALLENGE
   ===================================================================== */

var DC_XP_PER_CORRECT   = 20;
var DC_XP_PERFECT_BONUS = 50;  // extra XP for scoring 10/10

var dcState = {
  initialized: false,
  sessionReady: false,
  surah: null,
  questionTypes: [],
  questionAyahs: [],
  currentQ: 0,
  score: 0
};

function initDailyChallenge() {
  if (!dcState.initialized) {
    dcState.initialized = true;
    document.getElementById('dc-back-btn').addEventListener('click', function () { showPage('home'); });
    document.getElementById('dc-share-btn').addEventListener('click', dcShare);
    document.getElementById('dc-end-home-btn').addEventListener('click', function () { showPage('home'); });
    document.getElementById('dc-completed-home-btn').addEventListener('click', function () { showPage('home'); });
  }
  dcStartOrShow();
}

async function dcStartOrShow() {
  var today = todayString();

  // Already completed today
  if (progress.dailyChallengeDate === today) {
    document.getElementById('dc-completed-screen').classList.remove('hidden');
    document.getElementById('dc-area').classList.add('hidden');
    document.getElementById('dc-end-screen').classList.add('hidden');
    var score = progress.dailyChallengeScore;
    document.getElementById('dc-last-score').textContent =
      'نتيجة آخر تحدٍّ: ' + score + '/10 ' + dcScoreEmoji(score);
    return;
  }

  // Session already built in memory (e.g. navigated away and back mid-challenge)
  if (dcState.sessionReady && dcState.currentQ < 10) {
    document.getElementById('dc-completed-screen').classList.add('hidden');
    document.getElementById('dc-end-screen').classList.add('hidden');
    document.getElementById('dc-area').classList.remove('hidden');
    dcShowQuestion();
    return;
  }

  // Build new session
  var hash = strHash(today);

  // Eligible surahs: those with at least 15 ayahs
  var eligible = ALL_SURAHS.filter(function (s) {
    var nextS = SURAH_STARTS[s.number + 1] !== undefined
      ? SURAH_STARTS[s.number + 1]
      : TOTAL_AYAHS;
    return (nextS - SURAH_STARTS[s.number]) >= 15;
  });

  var surahInfo = eligible[hash % eligible.length];

  showSpinner(true);
  var surah = await fetchSurah(surahInfo.number);
  showSpinner(false);

  if (!surah) return;

  dcState.surah = surah;

  // Pick 10 ayahs deterministically (need ayah.number < numberOfAyahs to allow N+1)
  var available = surah.ayahs
    .filter(function (a) { return a.number < surah.numberOfAyahs; })
    .map(function (a) { return a.number; });

  var seed = strHash(today + '_picks');
  var picks = deterministicShuffle(available, seed).slice(0, 10);

  // Assign question types: 5 MC, 3 FB, 2 WO
  dcState.questionTypes = ['mc','mc','mc','mc','mc','fb','fb','fb','wo','wo'];
  dcState.questionAyahs = picks;
  dcState.currentQ      = 0;
  dcState.score         = 0;
  dcState.sessionReady  = true;

  document.getElementById('dc-completed-screen').classList.add('hidden');
  document.getElementById('dc-end-screen').classList.add('hidden');
  document.getElementById('dc-area').classList.remove('hidden');
  dcShowQuestion();
}

function dcShowQuestion() {
  var q    = dcState.currentQ;
  var type = dcState.questionTypes[q];
  var anum = dcState.questionAyahs[q];

  document.getElementById('dc-q-num').textContent = q + 1;
  var pct = Math.round((q / 10) * 100);
  document.getElementById('dc-progress-fill').style.width = pct + '%';

  var qArea = document.getElementById('dc-question-area');
  qArea.innerHTML = '';

  if (type === 'mc')       dcBuildMC(qArea, dcState.surah, anum);
  else if (type === 'fb')  dcBuildFB(qArea, dcState.surah, anum);
  else if (type === 'wo')  dcBuildWO(qArea, dcState.surah, anum);
}

function dcAdvance(isCorrect, delay) {
  if (isCorrect) dcState.score++;
  setTimeout(function () {
    dcState.currentQ++;
    if (dcState.currentQ >= 10) dcEnd();
    else dcShowQuestion();
  }, delay || 420);
}

function dcBuildMC(container, surah, ayahNum) {
  var ayah     = surah.ayahs[ayahNum - 1];
  var nextAyah = surah.ayahs[ayahNum]; // N+1

  var card = document.createElement('div');
  card.className = 'question-card';
  card.innerHTML =
    '<div class="surah-label">' + surah.name + ' — الآية ' + ayahNum + '</div>' +
    '<p class="question-prompt">ما هي الآية التالية؟</p>' +
    '<div class="ayah-text">' + ayah.text + '</div>';
  container.appendChild(card);

  if (!nextAyah) { dcAdvance(false, 100); return; }

  var allIdx  = surah.ayahs.map(function (_, i) { return i; }).filter(function (i) { return i !== ayahNum; });
  var decoys  = pickRandom(allIdx, 3).map(function (i) { return surah.ayahs[i]; });
  var options = shuffle([nextAyah].concat(decoys));
  var corrIdx = options.indexOf(nextAyah);

  var optDiv = document.createElement('div');
  optDiv.className = 'mc-options';

  options.forEach(function (opt, i) {
    var btn = document.createElement('div');
    btn.className = 'mc-option';
    btn.textContent = opt.text;
    btn.addEventListener('click', function () {
      if (btn.classList.contains('disabled')) return;
      var btns = optDiv.querySelectorAll('.mc-option');
      btns.forEach(function (b) { b.classList.add('disabled'); });
      btns[corrIdx].classList.add('correct');
      var ok = (i === corrIdx);
      if (!ok) btn.classList.add('incorrect');
      dcAdvance(ok, 600);
    });
    optDiv.appendChild(btn);
  });

  container.appendChild(optDiv);
}

function dcBuildFB(container, surah, ayahNum) {
  var ayah  = surah.ayahs[ayahNum - 1];
  var words = ayah.text.split(' ');
  var bi    = words.length < 3 ? words.length - 1 : Math.floor(words.length / 2);
  var correctWord = words[bi];

  var displayWords = words.map(function (w, i) {
    return i === bi ? '<span class="blank-placeholder">[___]</span>' : w;
  }).join(' ');

  var card = document.createElement('div');
  card.className = 'question-card';
  card.innerHTML =
    '<div class="surah-label">' + surah.name + ' — الآية ' + ayahNum + '</div>' +
    '<p class="question-prompt">أكمل الكلمة المفقودة:</p>' +
    '<div class="ayah-text fill-ayah">' + displayWords + '</div>';
  container.appendChild(card);

  var inp = document.createElement('input');
  inp.type = 'text';
  inp.className = 'fb-word-input';
  inp.placeholder = 'اكتب الكلمة المفقودة';
  inp.style.cssText = 'width:100%;margin:10px 0;';
  container.appendChild(inp);

  var checkBtn = document.createElement('button');
  checkBtn.className = 'primary-btn';
  checkBtn.textContent = 'تحقق ✓';

  var checked = false;
  function doCheck() {
    if (checked) return;
    checked = true;
    var ok = stripDiacritics(inp.value.trim()) === stripDiacritics(correctWord);
    inp.classList.add(ok ? 'correct' : 'incorrect');
    inp.disabled = true;
    checkBtn.disabled = true;
    if (!ok) {
      var hint = document.createElement('div');
      hint.className = 'correct-answer-hint';
      hint.textContent = 'الصواب: ' + correctWord;
      container.appendChild(hint);
    }
    dcAdvance(ok, 750);
  }

  checkBtn.addEventListener('click', doCheck);
  inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') doCheck(); });
  container.appendChild(checkBtn);
  setTimeout(function () { inp.focus(); }, 60);
}

function dcBuildWO(container, surah, ayahNum) {
  var ayah          = surah.ayahs[ayahNum - 1];
  var originalWords = ayah.text.split(' ');

  var card = document.createElement('div');
  card.className = 'question-card';
  card.innerHTML =
    '<div class="surah-label">' + surah.name + ' — الآية ' + ayahNum + '</div>' +
    '<p class="question-prompt">رتّب الكلمات لتكوين الآية الكريمة:</p>';
  container.appendChild(card);

  var answerArea = document.createElement('div');
  answerArea.className = 'word-drop-zone';
  answerArea.style.cssText = 'margin-bottom:10px;min-height:70px;';

  var bankLbl = document.createElement('p');
  bankLbl.className = 'zone-label';
  bankLbl.textContent = 'انقر على الكلمات لترتيبها:';

  var wordBank = document.createElement('div');
  wordBank.className = 'word-bank';

  var dragging = { tile: null };

  shuffle(originalWords).forEach(function (word) {
    var tile = document.createElement('div');
    tile.className = 'word-tile';
    tile.textContent = word;
    tile.draggable = true;

    tile.addEventListener('click', function () {
      if (tile.parentNode === wordBank) answerArea.appendChild(tile);
      else wordBank.appendChild(tile);
    });

    tile.addEventListener('dragstart', function (e) {
      e.dataTransfer.setData('text/plain', '');
      tile.classList.add('dragging');
      dragging.tile = tile;
    });
    tile.addEventListener('dragend', function () {
      tile.classList.remove('dragging');
      dragging.tile = null;
    });

    wordBank.appendChild(tile);
  });

  [answerArea, wordBank].forEach(function (zone) {
    zone.addEventListener('dragover', function (e) { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', function () { zone.classList.remove('drag-over'); });
    zone.addEventListener('drop', function (e) {
      e.preventDefault();
      zone.classList.remove('drag-over');
      if (dragging.tile) zone.appendChild(dragging.tile);
    });
  });

  container.appendChild(answerArea);
  container.appendChild(bankLbl);
  container.appendChild(wordBank);

  var checkBtn = document.createElement('button');
  checkBtn.className = 'primary-btn';
  checkBtn.style.marginTop = '10px';
  checkBtn.textContent = 'تحقق ✓';

  var checked = false;
  checkBtn.addEventListener('click', function () {
    if (checked) return;
    checked = true;
    var tiles   = answerArea.querySelectorAll('.word-tile');
    var correct = 0;
    tiles.forEach(function (t, i) {
      if (i < originalWords.length && stripDiacritics(t.textContent) === stripDiacritics(originalWords[i])) {
        t.classList.add('correct-tile');
        correct++;
      } else {
        t.classList.add('incorrect-tile');
      }
    });
    checkBtn.disabled = true;
    var ok = correct === originalWords.length && tiles.length === originalWords.length;
    dcAdvance(ok, 800);
  });

  container.appendChild(checkBtn);
}

function dcEnd() {
  var score = dcState.score;
  var today = todayString();
  var xp    = score * DC_XP_PER_CORRECT + (score === 10 ? DC_XP_PERFECT_BONUS : 0);
  awardXP(xp);

  progress.dailyChallengeDate  = today;
  progress.dailyChallengeScore = score;
  saveProgress();
  dcState.sessionReady = false;

  document.getElementById('dc-area').classList.add('hidden');
  document.getElementById('dc-progress-fill').style.width = '100%';

  var endScreen = document.getElementById('dc-end-screen');
  endScreen.classList.remove('hidden');
  document.getElementById('dc-final-score').textContent =
    'النتيجة: ' + score + '/10 ' + dcScoreEmoji(score);
}

function dcScoreEmoji(score) {
  if (score === 10) return '🎉 مثالي!';
  if (score >= 8)  return '👏 ممتاز!';
  if (score >= 6)  return '👍 جيد!';
  if (score >= 4)  return '💪 استمر!';
  return '📖 تحتاج مزيداً من المراجعة';
}

function dcShare() {
  var score = progress.dailyChallengeScore || 0;
  var today = todayString();
  var text  = 'مراجعة القرآن 🌙\nتحدي اليوم ' + today + '\nالنتيجة: ' + score + '/10 ' + dcScoreEmoji(score) + '\n';
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function () {
      alert('تم نسخ النتيجة! يمكنك مشاركتها الآن.');
    }).catch(function () {
      prompt('انسخ هذا النص للمشاركة:', text);
    });
  } else {
    prompt('انسخ هذا النص للمشاركة:', text);
  }
}

/* =====================================================================
   INITIALISATION
   ===================================================================== */

function init() {
  loadProgress();

  // Reset today's counters if it's a new day
  var today = todayString();
  if (progress.lastPracticeDate && progress.lastPracticeDate !== today) {
    var last = new Date(progress.lastPracticeDate);
    var diff = (new Date(today) - last) / 86400000;
    if (diff > 1) { progress.streak = 0; }
    progress.todayReviewed = 0;
    saveProgress();
  }

  updateNavStats();
  updateGoalBar();

  // Mode card clicks
  document.querySelectorAll('.mode-card').forEach(function (card) {
    card.addEventListener('click', function () {
      showPage(card.dataset.mode);
    });
  });

  // Language / English toggle
  document.getElementById('langToggle').addEventListener('click', function () {
    englishMode = !englishMode;
    this.textContent = englishMode ? 'عر' : 'EN';
  });
}

document.addEventListener('DOMContentLoaded', init);

