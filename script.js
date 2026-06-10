const flavors = [
    { name: "Alpine Ascent", tag: "Crisp Mint & Pine", color: "linear-gradient(135deg, #06b6d4, #0b849e)", icon: "🏔️", story: "Harvested from pure high-altitude glacial currents. One sip, and you're scaling vertical peaks with the crisp clarity of alpine mountain air." },
    { name: "Solar Flare", tag: "Blood Orange & Ginger", color: "linear-gradient(135deg, #f97316, #b45309)", icon: "☀️", story: "Unapologetically sharp and bright. Infused with organic ginger to fire up metabolism and blast through morning mental static like a solar storm." },
    { name: "Amazonia Rush", tag: "Açai Berry Burst", color: "linear-gradient(135deg, #a855f7, #6b21a8)", icon: "🌿", story: "Deep canopy protection meets intense cellular energy. Blending wild açai and concentrated guayusa for an ancient, earth-bound focus spike." },
    { name: "Electric Jungle", tag: "Kiwi Lime & Cactus", color: "linear-gradient(135deg, #22c55e, #15803d)", icon: "⚡", story: "Spiky on the outside, radically refreshing inside. Hydrating cactus water pairs with lime to recharge vital electrolytes instantly." },
    { name: "Zenith Bloom", tag: "Lavender Elderflower", color: "linear-gradient(135deg, #ec4899, #9d174d)", icon: "🌸", story: "The quiet chaotic energy of nature blooming all at once. Calms physical anxieties while focusing cognitive processing speed." },
    { name: "Midnight Moss", tag: "Wild Blackberry Bark", color: "linear-gradient(135deg, #312e81, #1e1b4b)", icon: "🌙", story: "For the night-shifts and dark gym basements. Deep, earth-toned berry sweetness combined with stamina-building adaptogenic roots." },
    { name: "Tundra Freeze", tag: "Eucalyptus Blue-Rasp", color: "linear-gradient(135deg, #38bdf8, #0369a1)", icon: "❄️", story: "Shock the nervous system into absolute alertness. A sub-zero freezing wind of organic mint elements that instantly opens up airways." },
    { name: "Volcanic Crush", tag: "Mango Chili Extract", color: "linear-gradient(135deg, #ef4444, #991b1b)", icon: "🌋", story: "Sweet liquid gold with a back-end thermal kick. Activates clean cardiovascular responses to send your productivity into absolute overdrive." },
    { name: "Cosmic Kelp", tag: "Yuzu & Sea Botanicals", color: "linear-gradient(135deg, #14b8a6, #0f766e)", icon: "🌊", story: "Intense coastal processing. Infused with oceanic trace minerals to sustainably supercharge communication speeds within cell paths." },
    { name: "Terra Aura", tag: "Smoked Vanilla Peach", color: "linear-gradient(135deg, #eab308, #a16207)", icon: "🍂", story: "Smooth, velvety golden hour vibes. Designed for creative writers, artists, and creators who need a calm, persistent flow-state." }
];

const track = document.getElementById('productTrack');
const nextBtn = document.getElementById('nextBtn');
const timerBar = document.getElementById('timerBar');

let cardWidth = 420;
const gap = 32; 
let currentIndex = 0; 
let timerInterval;
let progress = 0;
const duration = 6000; 
const intervalStep = 30; 
let isTransitioning = false;

function createCardHTML(flavor) {
    return `
        <div class="can-mockup" style="background: ${flavor.color}">
            <span>${flavor.icon}</span>
        </div>
        <h3>${flavor.name}</h3>
        <div class="flavor-tag" style="color: ${flavor.color.split(',')[0].replace('linear-gradient(135deg, ', '')}">${flavor.tag}</div>
        <p class="flavor-story">${flavor.story}</p>
    `;
}

function buildCarousel() {
    const clonesToPrepend = flavors.slice(-2);
    const clonesToAppend = flavors.slice(0, 2);
    const combinedList = [...clonesToPrepend, ...flavors, ...clonesToAppend];

    combinedList.forEach((flavor, index) => {
        const card = document.createElement('div');
        card.classList.add('flavor-card');
        
        let logicalIndex = index - 2;
        if (logicalIndex < 0) logicalIndex = flavors.length + logicalIndex;
        if (logicalIndex >= flavors.length) logicalIndex = logicalIndex - flavors.length;
        card.setAttribute('data-flavor-idx', logicalIndex);

        card.innerHTML = createCardHTML(flavor);
        track.appendChild(card);
    });
    
    currentIndex = 2; 
}

function updateSlider(animate = true) {
    const cards = document.querySelectorAll('.flavor-card');
    cardWidth = cards[0].offsetWidth;
    
    if (animate) {
        track.classList.remove('no-transition');
    } else {
        track.classList.add('no-transition');
    }

    let activeLogicalIdx = currentIndex - 2;
    if (activeLogicalIdx < 0) activeLogicalIdx = flavors.length - 1;
    if (activeLogicalIdx >= flavors.length) activeLogicalIdx = 0;

    cards.forEach((card, idx) => {
        const cardLogicalIdx = parseInt(card.getAttribute('data-flavor-idx'));
        if (cardLogicalIdx === activeLogicalIdx && idx === currentIndex) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });

    const viewportWidth = window.innerWidth;
    const centerOffset = (viewportWidth / 2) - (cardWidth / 2);
    const amountToMove = (currentIndex * (cardWidth + gap)) - centerOffset;
    
    track.style.transform = `translateX(-${amountToMove}px)`;
    
    if (animate) resetTimer();
}

function nextSlide() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex++;
    updateSlider(true);
}

track.addEventListener('transitionend', () => {
    isTransitioning = false;
    const totalCards = flavors.length + 4;

    if (currentIndex >= totalCards - 2) {
        currentIndex = 2; 
        updateSlider(false);
    } else if (currentIndex <= 1) {
        currentIndex = totalCards - 3; 
        updateSlider(false);
    }
});

function startTimer() {
    timerInterval = setInterval(() => {
        progress += (intervalStep / duration) * 100;
        timerBar.style.width = `${progress}%`;

        if (progress >= 100) {
            nextSlide();
        }
    }, intervalStep);
}

function resetTimer() {
    clearInterval(timerInterval);
    progress = 0;
    timerBar.style.width = '0%';
    startTimer();
}

nextBtn.addEventListener('click', () => {
    nextSlide();
});

window.addEventListener('resize', () => updateSlider(false));

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-in-section').forEach(section => {
    fadeObserver.observe(section);
});

buildCarousel();
setTimeout(() => updateSlider(false), 50); 
startTimer();