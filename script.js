// Cache for storing fetched surahs
const surahCache = {};
let currentSurah = null;
let currentAyahIndex = null;
let ayahRange = { start: 1, end: null }; // null means full surah

// Elements
const surahSelect = document.getElementById('surahSelect');
const newCardBtn = document.getElementById('newCard');
const loadingSpinner = document.getElementById('loadingSpinner');
const flashcard = document.getElementById('flashcard');
const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');
const surahNameEl = document.getElementById('surahName');
const startAyahInput = document.getElementById('startAyah');
const endAyahInput = document.getElementById('endAyah');
const answerCountSelect = document.getElementById('answerCount');
const useFullSurahBtn = document.getElementById('useFullSurah');
const rangeControls = document.getElementById('rangeControls');
const infoBar = document.getElementById('infoBar');
const rangeInfo = document.getElementById('rangeInfo');
const totalAyahsInfo = document.getElementById('totalAyahs');

// All 114 Surahs
const allSurahs = [
    { number: 1, name: "الفاتحة" },
    { number: 2, name: "البقرة" },
    { number: 3, name: "آل عمران" },
    { number: 4, name: "النساء" },
    { number: 5, name: "المائدة" },
    { number: 6, name: "الأنعام" },
    { number: 7, name: "الأعراف" },
    { number: 8, name: "الأنفال" },
    { number: 9, name: "التوبة" },
    { number: 10, name: "يونس" },
    { number: 11, name: "هود" },
    { number: 12, name: "يوسف" },
    { number: 13, name: "الرعد" },
    { number: 14, name: "إبراهيم" },
    { number: 15, name: "الحجر" },
    { number: 16, name: "النحل" },
    { number: 17, name: "الإسراء" },
    { number: 18, name: "الكهف" },
    { number: 19, name: "مريم" },
    { number: 20, name: "طه" },
    { number: 21, name: "الأنبياء" },
    { number: 22, name: "الحج" },
    { number: 23, name: "المؤمنون" },
    { number: 24, name: "النور" },
    { number: 25, name: "الفرقان" },
    { number: 26, name: "الشعراء" },
    { number: 27, name: "النمل" },
    { number: 28, name: "القصص" },
    { number: 29, name: "العنكبوت" },
    { number: 30, name: "الروم" },
    { number: 31, name: "لقمان" },
    { number: 32, name: "السجدة" },
    { number: 33, name: "الأحزاب" },
    { number: 34, name: "سبأ" },
    { number: 35, name: "فاطر" },
    { number: 36, name: "يس" },
    { number: 37, name: "الصافات" },
    { number: 38, name: "ص" },
    { number: 39, name: "الزمر" },
    { number: 40, name: "غافر" },
    { number: 41, name: "فصلت" },
    { number: 42, name: "الشورى" },
    { number: 43, name: "الزخرف" },
    { number: 44, name: "الدخان" },
    { number: 45, name: "الجاثية" },
    { number: 46, name: "الأحقاف" },
    { number: 47, name: "محمد" },
    { number: 48, name: "الفتح" },
    { number: 49, name: "الحجرات" },
    { number: 50, name: "ق" },
    { number: 51, name: "الذاريات" },
    { number: 52, name: "الطور" },
    { number: 53, name: "النجم" },
    { number: 54, name: "القمر" },
    { number: 55, name: "الرحمن" },
    { number: 56, name: "الواقعة" },
    { number: 57, name: "الحديد" },
    { number: 58, name: "المجادلة" },
    { number: 59, name: "الحشر" },
    { number: 60, name: "الممتحنة" },
    { number: 61, name: "الصف" },
    { number: 62, name: "الجمعة" },
    { number: 63, name: "المنافقون" },
    { number: 64, name: "التغابن" },
    { number: 65, name: "الطلاق" },
    { number: 66, name: "التحريم" },
    { number: 67, name: "الملك" },
    { number: 68, name: "القلم" },
    { number: 69, name: "الحاقة" },
    { number: 70, name: "المعارج" },
    { number: 71, name: "نوح" },
    { number: 72, name: "الجن" },
    { number: 73, name: "المزمل" },
    { number: 74, name: "المدثر" },
    { number: 75, name: "القيامة" },
    { number: 76, name: "الإنسان" },
    { number: 77, name: "المرسلات" },
    { number: 78, name: "النبأ" },
    { number: 79, name: "النازعات" },
    { number: 80, name: "عبس" },
    { number: 81, name: "التكوير" },
    { number: 82, name: "الانفطار" },
    { number: 83, name: "المطففين" },
    { number: 84, name: "الانشقاق" },
    { number: 85, name: "البروج" },
    { number: 86, name: "الطارق" },
    { number: 87, name: "الأعلى" },
    { number: 88, name: "الغاشية" },
    { number: 89, name: "الفجر" },
    { number: 90, name: "البلد" },
    { number: 91, name: "الشمس" },
    { number: 92, name: "الليل" },
    { number: 93, name: "الضحى" },
    { number: 94, name: "الشرح" },
    { number: 95, name: "التين" },
    { number: 96, name: "العلق" },
    { number: 97, name: "القدر" },
    { number: 98, name: "البينة" },
    { number: 99, name: "الزلزلة" },
    { number: 100, name: "العاديات" },
    { number: 101, name: "القارعة" },
    { number: 102, name: "التكاثر" },
    { number: 103, name: "العصر" },
    { number: 104, name: "الهمزة" },
    { number: 105, name: "الفيل" },
    { number: 106, name: "قريش" },
    { number: 107, name: "الماعون" },
    { number: 108, name: "الكوثر" },
    { number: 109, name: "الكافرون" },
    { number: 110, name: "النصر" },
    { number: 111, name: "المسد" },
    { number: 112, name: "الإخلاص" },
    { number: 113, name: "الفلق" },
    { number: 114, name: "الناس" }
];

// Fetch Surah from API
async function fetchSurah(surahNumber) {
    // Check cache first
    if (surahCache[surahNumber]) {
        return surahCache[surahNumber];
    }

    try {
        showLoading(true);
        
        // Using Al Quran Cloud API
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
        const data = await response.json();
        
        if (data.status === "OK" && data.data) {
            const surah = data.data;
            const surahData = {
                number: surah.number,
                name: surah.name,
                englishName: surah.englishName,
                numberOfAyahs: surah.numberOfAyahs,
                ayahs: surah.ayahs.map(ayah => ({
                    number: ayah.numberInSurah,
                    text: ayah.text
                }))
            };
            
            // Cache the surah data
            surahCache[surahNumber] = surahData;
            return surahData;
        } else {
            throw new Error('Failed to fetch surah data');
        }
    } catch (error) {
        console.error('Error fetching surah:', error);
        alert('حدث خطأ في تحميل السورة. الرجاء المحاولة مرة أخرى.');
        return null;
    } finally {
        showLoading(false);
    }
}

// Show/hide loading spinner
function showLoading(show) {
    if (show) {
        loadingSpinner.classList.add('show');
        flashcard.classList.add('hidden');
        surahSelect.disabled = true;
        newCardBtn.disabled = true;
        startAyahInput.disabled = true;
        endAyahInput.disabled = true;
        answerCountSelect.disabled = true;
    } else {
        loadingSpinner.classList.remove('show');
        flashcard.classList.remove('hidden');
        surahSelect.disabled = false;
        newCardBtn.disabled = false;
        startAyahInput.disabled = false;
        endAyahInput.disabled = false;
        answerCountSelect.disabled = false;
    }
}

// Update range information display
function updateRangeInfo() {
    if (!currentSurah) {
        infoBar.classList.add('hidden');
        return;
    }
    
    infoBar.classList.remove('hidden');
    const start = ayahRange.start;
    const end = ayahRange.end || currentSurah.numberOfAyahs;
    rangeInfo.textContent = `النطاق: ${start} - ${end}`;
    totalAyahsInfo.textContent = `مجموع الآيات في السورة: ${currentSurah.numberOfAyahs}`;
}

// Get valid ayah indices within the selected range
function getValidAyahIndices() {
    if (!currentSurah) return [];
    
    const start = ayahRange.start - 1; // Convert to 0-based index
    const end = (ayahRange.end || currentSurah.numberOfAyahs) - 1;
    const answerCount = parseInt(answerCountSelect.value);
    
    // We need at least answerCount ayahs after the selected ayah
    const maxStartIndex = end - answerCount + 1;
    
    const validIndices = [];
    for (let i = start; i < maxStartIndex; i++) {
        validIndices.push(i);
    }
    
    return validIndices;
}

// Generate new flashcard
async function generateNewCard() {
    if (!currentSurah) {
        alert('الرجاء اختيار سورة أولاً');
        return;
    }
    
    // Reset flip
    flashcard.classList.remove('flipped');
    
    // Get valid indices for the range
    const validIndices = getValidAyahIndices();
    
    if (validIndices.length === 0) {
        alert('النطاق المحدد صغير جداً. الرجاء توسيع النطاق أو تقليل عدد الآيات في الإجابة.');
        return;
    }
    
    // Select random ayah from valid indices
    currentAyahIndex = validIndices[Math.floor(Math.random() * validIndices.length)];
    
    // Set surah name
    surahNameEl.textContent = currentSurah.name;
    
    // Set question (current ayah)
    const currentAyah = currentSurah.ayahs[currentAyahIndex];
    questionEl.innerHTML = `
        <span class="ayah-number">الآية ${currentAyah.number}</span>
        <br><br>
        ${currentAyah.text}
    `;
    
    // Set answer (next ayahs based on user selection)
    const answerCount = parseInt(answerCountSelect.value);
    let answerHTML = '';
    
    for (let i = 1; i <= answerCount; i++) {
        const nextAyah = currentSurah.ayahs[currentAyahIndex + i];
        if (nextAyah) {
            if (i > 1) answerHTML += '<br><br>';
            answerHTML += `
                <span class="ayah-number">الآية ${nextAyah.number}</span>
                <br>
                ${nextAyah.text}
            `;
        }
    }
    
    answerEl.innerHTML = answerHTML;
}

// Flip the flashcard
function flipCard() {
    if (currentSurah) {
        flashcard.classList.toggle('flipped');
    }
}

// Validate and update range
function updateRange() {
    if (!currentSurah) return;
    
    const start = parseInt(startAyahInput.value) || 1;
    const end = parseInt(endAyahInput.value) || currentSurah.numberOfAyahs;
    
    // Validate range
    if (start < 1) {
        startAyahInput.value = 1;
        ayahRange.start = 1;
    } else if (start > currentSurah.numberOfAyahs) {
        startAyahInput.value = currentSurah.numberOfAyahs;
        ayahRange.start = currentSurah.numberOfAyahs;
    } else {
        ayahRange.start = start;
    }
    
    if (end < ayahRange.start) {
        endAyahInput.value = ayahRange.start;
        ayahRange.end = ayahRange.start;
    } else if (end > currentSurah.numberOfAyahs) {
        endAyahInput.value = currentSurah.numberOfAyahs;
        ayahRange.end = currentSurah.numberOfAyahs;
    } else {
        ayahRange.end = end;
    }
    
    updateRangeInfo();
}

// Event Listeners
surahSelect.addEventListener('change', async function() {
    const surahNumber = this.value;
    if (surahNumber) {
        // Show range controls
        rangeControls.classList.remove('hidden');
        
        // Clear current surah name while loading
        surahNameEl.textContent = '';
        questionEl.textContent = 'جاري تحميل السورة...';
        
        // Fetch the selected surah
        const surahData = await fetchSurah(surahNumber);
        
        if (surahData) {
            currentSurah = surahData;
            
            // Reset range to full surah
            ayahRange.start = 1;
            ayahRange.end = null;
            
            // Update range inputs
            startAyahInput.value = 1;
            endAyahInput.value = currentSurah.numberOfAyahs;
            startAyahInput.max = currentSurah.numberOfAyahs;
            endAyahInput.max = currentSurah.numberOfAyahs;
            
            updateRangeInfo();
            
            // Generate first card automatically
            generateNewCard();
        } else {
            // Reset if fetch failed
            currentSurah = null;
            questionEl.textContent = 'اختر سورة للبدء';
            surahSelect.value = '';
            rangeControls.classList.add('hidden');
        }
    } else {
        // No surah selected
        currentSurah = null;
        questionEl.textContent = 'اختر سورة للبدء';
        surahNameEl.textContent = '';
        rangeControls.classList.add('hidden');
        infoBar.classList.add('hidden');
    }
});

// Range input listeners
startAyahInput.addEventListener('change', updateRange);
endAyahInput.addEventListener('change', updateRange);
startAyahInput.addEventListener('input', updateRange);
endAyahInput.addEventListener('input', updateRange);

// Use full surah button
useFullSurahBtn.addEventListener('click', function() {
    if (currentSurah) {
        startAyahInput.value = 1;
        endAyahInput.value = currentSurah.numberOfAyahs;
        ayahRange.start = 1;
        ayahRange.end = null;
        updateRangeInfo();
    }
});

// New card button
newCardBtn.addEventListener('click', generateNewCard);

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Space bar to flip card
    if (event.code === 'Space' && currentSurah) {
        event.preventDefault();
        flipCard();
    }
    // Enter key for new card
    else if (event.code === 'Enter' && currentSurah) {
        event.preventDefault();
        generateNewCard();
    }
    // Arrow keys to adjust range
    else if (event.code === 'ArrowUp' && document.activeElement === startAyahInput) {
        event.preventDefault();
        startAyahInput.value = Math.min(parseInt(startAyahInput.value) + 1, currentSurah.numberOfAyahs);
        updateRange();
    }
    else if (event.code === 'ArrowDown' && document.activeElement === startAyahInput) {
        event.preventDefault();
        startAyahInput.value = Math.max(parseInt(startAyahInput.value) - 1, 1);
        updateRange();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Hide range controls initially
    rangeControls.classList.add('hidden');
    infoBar.classList.add('hidden');
    
    // Populate surah dropdown
    surahSelect.innerHTML = '<option value="">اختر السورة</option>';
    allSurahs.forEach(surah => {
        const option = document.createElement('option');
        option.value = surah.number;
        option.textContent = `${surah.number}. ${surah.name}`;
        surahSelect.appendChild(option);
    });
    
    // Set default answer count to 1
    answerCountSelect.value = '1';
});

// Make flipCard function available globally for onclick
window.flipCard = flipCard;

// Save preferences to localStorage
function savePreferences() {
    const prefs = {
        answerCount: answerCountSelect.value,
        lastSurah: surahSelect.value
    };
    localStorage.setItem('quranFlashcardPrefs', JSON.stringify(prefs));
}

// Load preferences from localStorage
function loadPreferences() {
    const prefsString = localStorage.getItem('quranFlashcardPrefs');
    if (prefsString) {
        try {
            const prefs = JSON.parse(prefsString);
            if (prefs.answerCount) {
                answerCountSelect.value = prefs.answerCount;
            }
        } catch (e) {
            console.error('Error loading preferences:', e);
        }
    }
}

// Save preferences when changed
answerCountSelect.addEventListener('change', savePreferences);
surahSelect.addEventListener('change', savePreferences);

// Load preferences on startup
loadPreferences();

// Handle offline/online status
window.addEventListener('online', function() {
    console.log('Back online');
});

window.addEventListener('offline', function() {
    alert('لا يوجد اتصال بالإنترنت. تأكد من الاتصال بالإنترنت لتحميل السور.');
});
