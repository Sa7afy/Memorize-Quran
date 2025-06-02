// Cache for storing fetched surahs
const surahCache = {};
let currentSurah = null;
let currentAyahIndex = null;

// Elements
const surahSelect = document.getElementById('surahSelect');
const newCardBtn = document.getElementById('newCard');
const loadingSpinner = document.getElementById('loadingSpinner');
const flashcard = document.getElementById('flashcard');
const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');
const surahNameEl = document.getElementById('surahName');

// Fetch Surah from API
async function fetchSurah(surahNumber) {
    // Check cache first
    if (surahCache[surahNumber]) {
        return surahCache[surahNumber];
    }

    try {
        showLoading(true);
        
        // Using Al Quran Cloud API - it's free and reliable
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
    } else {
        loadingSpinner.classList.remove('show');
        flashcard.classList.remove('hidden');
        surahSelect.disabled = false;
        newCardBtn.disabled = false;
    }
}

// Generate new flashcard
async function generateNewCard() {
    if (!currentSurah) {
        alert('الرجاء اختيار سورة أولاً');
        return;
    }
    
    // Reset flip
    flashcard.classList.remove('flipped');
    
    // Generate random ayah index (not the last two)
    const maxIndex = currentSurah.ayahs.length - 3;
    currentAyahIndex = Math.floor(Math.random() * (maxIndex + 1));
    
    // Set surah name
    surahNameEl.textContent = currentSurah.name;
    
    // Set question (current ayah)
    const currentAyah = currentSurah.ayahs[currentAyahIndex];
    questionEl.innerHTML = `
        <span class="ayah-number">الآية ${currentAyah.number}</span>
        <br><br>
        ${currentAyah.text}
    `;
    
    // Set answer (next two ayahs)
    const nextAyah1 = currentSurah.ayahs[currentAyahIndex + 1];
    const nextAyah2 = currentSurah.ayahs[currentAyahIndex + 2];
    
    let answerHTML = `
        <span class="ayah-number">الآية ${nextAyah1.number}</span>
        <br>
        ${nextAyah1.text}
    `;
    
    if (nextAyah2) {
        answerHTML += `
            <br><br>
            <span class="ayah-number">الآية ${nextAyah2.number}</span>
            <br>
            ${nextAyah2.text}
        `;
    }
    
    answerEl.innerHTML = answerHTML;
}

// Flip the flashcard
function flipCard() {
    if (currentSurah) {
        flashcard.classList.toggle('flipped');
    }
}

// Event listeners
surahSelect.addEventListener('change', async function() {
    const surahNumber = this.value;
    if (surahNumber) {
        // Clear current surah name while loading
        surahNameEl.textContent = '';
        questionEl.textContent = 'جاري تحميل السورة...';
        
        // Fetch the selected surah
        const surahData = await fetchSurah(surahNumber);
        
        if (surahData) {
            currentSurah = surahData;
            // Generate first card automatically
            generateNewCard();
        } else {
            // Reset if fetch failed
            currentSurah = null;
            questionEl.textContent = 'اختر سورة للبدء';
            surahSelect.value = '';
        }
    } else {
        // No surah selected
        currentSurah = null;
        questionEl.textContent = 'اختر سورة للبدء';
        surahNameEl.textContent = '';
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
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Add all 114 surahs to the select dropdown
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

    // Clear existing options and add all surahs
    surahSelect.innerHTML = '<option value="">اختر السورة</option>';
    allSurahs.forEach(surah => {
        const option = document.createElement('option');
        option.value = surah.number;
        option.textContent = `${surah.number}. ${surah.name}`;
        surahSelect.appendChild(option);
    });
});

// Make flipCard function available globally for onclick
window.flipCard = flipCard;
