
// =====================================
// 1. GET HTML ELEMENTS
// =====================================

const surpriseButton = document.getElementById("surpriseButton");

const welcomeScreen = document.getElementById("welcomeScreen");

const surpriseScreen = document.getElementById("surpriseScreen");

const giftBox = document.getElementById("giftBox");

const giftMessage = document.getElementById("giftMessage");

const giftInstruction = document.getElementById("giftInstruction");

const nextButton = document.getElementById("nextButton");


// =====================================
// 2. FLOATING HEARTS
// =====================================

const heartContainer = document.getElementById("heartContainer");

const heartSymbols = ["♥", "♡", "❤", "💕"];

function createHeart() {

    const heart = document.createElement("span");

    heart.classList.add("heart");

    heart.innerText =
        heartSymbols[Math.floor(Math.random() * heartSymbols.length)];

    heart.style.left = Math.random() * 100 + "%";

    heart.style.fontSize =
        Math.random() * 20 + 12 + "px";

    const duration = Math.random() * 5 + 6;

    heart.style.animationDuration = duration + "s";

    heartContainer.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, duration * 1000);

}

setInterval(createHeart, 500);


// =====================================
// 3. TWINKLING STARS
// =====================================

const starContainer = document.getElementById("starContainer");

function createStars() {

    for (let i = 0; i < 70; i++) {

        const star = document.createElement("span");

        star.classList.add("star");

        star.innerText = "✦";

        star.style.left = Math.random() * 100 + "%";

        star.style.top = Math.random() * 100 + "%";

        star.style.fontSize =
            Math.random() * 8 + 4 + "px";

        star.style.animationDuration =
            Math.random() * 3 + 2 + "s";

        star.style.animationDelay =
            Math.random() * 3 + "s";

        starContainer.appendChild(star);

    }

}

createStars();


// =====================================
// 4. CINEMATIC SURPRISE REVEAL
// =====================================

surpriseButton.addEventListener("click", function() {

    welcomeScreen.classList.add("leaving");

    surpriseScreen.classList.add("active");

});


// =====================================
// 5. OPEN THE GIFT
// =====================================

giftBox.addEventListener("click", function() {

    if (giftBox.classList.contains("opened")) {
        return;
    }

    giftBox.classList.add("opened");

    giftMessage.classList.add("show");

    giftInstruction.innerText =
        "A little reminder, just for you ❤️";

});



// =====================================
// 6. MOVE TO THE MEMORIES SECTION
// =====================================

const memoriesSection =
    document.getElementById("memoriesSection");

nextButton.addEventListener("click", function() {

    surpriseScreen.classList.remove("active");

    memoriesSection.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


// =====================================
// 7. PHOTO LIGHTBOX
// =====================================

const photoLightbox =
    document.getElementById("photoLightbox");

const lightboxContent =
    document.getElementById("lightboxContent");

const lightboxCaption =
    document.getElementById("lightboxCaption");

const closeLightbox =
    document.getElementById("closeLightbox");

const memoryCards =
    document.querySelectorAll(".memory-card");


// OPEN A PHOTO

memoryCards.forEach(function(card) {

    card.addEventListener("click", function() {

        const photo =
            card.querySelector(".memory-photo");

        const caption =
            card.dataset.caption;

        lightboxContent.innerHTML = "";

        const enlargedPhoto = photo.cloneNode(true);

        lightboxContent.appendChild(enlargedPhoto);

        lightboxCaption.textContent = caption;

        photoLightbox.classList.add("active");

    });

});


// CLOSE PHOTO

function hideLightbox() {

    photoLightbox.classList.remove("active");

}

closeLightbox.addEventListener("click", hideLightbox);


// CLOSE WHEN CLICKING OUTSIDE PHOTO

photoLightbox.addEventListener("click", function(event) {

    if (event.target === photoLightbox) {
        hideLightbox();
    }

});


// CLOSE WITH ESCAPE KEY

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {
        hideLightbox();
    }

});



// =====================================
// 8. MOVE FROM MEMORIES TO LOVE LETTER
// =====================================

const letterSection =
    document.getElementById("letterSection");

letterButton.addEventListener("click", function() {

    memoriesSection.classList.remove("active");

    letterSection.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


// =====================================
// 9. OPEN THE ENVELOPE
// =====================================

const envelopeWrapper =
    document.getElementById("envelopeWrapper");

const envelope =
    envelopeWrapper.querySelector(".envelope");

const envelopeInstruction =
    document.getElementById("envelopeInstruction");

const loveLetter =
    document.getElementById("loveLetter");

let envelopeOpened = false;

envelopeWrapper.addEventListener("click", function() {

    if (envelopeOpened) {
        return;
    }

    envelopeOpened = true;

    envelope.classList.add("opened");

    envelopeInstruction.innerText =
        "A letter, written especially for you... ❤️";

    // Give the envelope time to open

    setTimeout(function() {

        loveLetter.classList.add("show");

        envelopeInstruction.style.display = "none";

        loveLetter.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }, 1000);

});



// =====================================
// 10. MOVE FROM LETTER TO REASONS
// =====================================

const reasonsSection =
    document.getElementById("reasonsSection");

letterContinueButton.addEventListener("click", function() {

    letterSection.classList.remove("active");

    reasonsSection.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


// =====================================
// 11. FLIP LOVE NOTE CARDS
// =====================================

const loveNotes =
    document.querySelectorAll(".love-note");

loveNotes.forEach(function(note) {

    note.addEventListener("click", function() {

        const isFlipped =
            note.classList.toggle("flipped");

        note.setAttribute(
            "aria-pressed",
            isFlipped
        );

    });

});



// =====================================
// 12. OPEN THE BIRTHDAY CELEBRATION
// =====================================

const birthdaySection =
    document.getElementById("birthdaySection");

birthdayChapterButton.addEventListener("click", function() {

    reasonsSection.classList.remove("active");

    birthdaySection.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


// =====================================
// 13. BLOW OUT THE CANDLES
// =====================================

const blowCandlesButton =
    document.getElementById("blowCandlesButton");

const candles =
    document.querySelectorAll(".candle");

const candleInstruction =
    document.getElementById("candleInstruction");

const birthdayWish =
    document.getElementById("birthdayWish");

let candlesBlown = false;

blowCandlesButton.addEventListener("click", function() {

    if (candlesBlown) {
        return;
    }

    candlesBlown = true;

    // Extinguish every candle

    candles.forEach(function(candle) {
        candle.classList.add("off");
    });

    // Display birthday message

    candleInstruction.innerText =
        "Wish made! May all your dreams come true. ❤️";

    birthdayWish.classList.add("show");

    blowCandlesButton.disabled = true;

    blowCandlesButton.innerText =
        "Wish sent! ❤️";

    // Launch confetti

    createConfetti();

    // Bring the birthday wish into view

    setTimeout(function() {

        birthdayWish.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }, 300);

});


// =====================================
// 14. CONFETTI GENERATOR
// =====================================

const confettiContainer =
    document.getElementById("confettiContainer");

function createConfetti() {

    const confettiColors = [
        "#ff8fb7",
        "#ffd166",
        "#ffffff",
        "#e7a4d0",
        "#c9a7ff",
        "#ffb347"
    ];

    for (let i = 0; i < 120; i++) {

        const piece = document.createElement("span");

        piece.classList.add("confetti");

        piece.style.left = Math.random() * 100 + "%";

        piece.style.backgroundColor =
            confettiColors[
                Math.floor(Math.random() * confettiColors.length)
            ];

        piece.style.animationDuration =
            Math.random() * 3 + 2 + "s";

        piece.style.animationDelay =
            Math.random() * 1.5 + "s";

        piece.style.width =
            Math.random() * 8 + 5 + "px";

        piece.style.height =
            Math.random() * 12 + 7 + "px";

        confettiContainer.appendChild(piece);

        setTimeout(function() {
            piece.remove();
        }, 6500);

    }

}


// =====================================
// 15. CELEBRATE AGAIN
// =====================================

const celebrateAgainButton =
    document.getElementById("celebrateAgainButton");

celebrateAgainButton.addEventListener("click", function() {

    candles.forEach(function(candle) {
        candle.classList.remove("off");
    });

    candlesBlown = false;

    birthdayWish.classList.remove("show");

    blowCandlesButton.disabled = false;

    blowCandlesButton.innerText =
        "Blow the candles! 💨";

    candleInstruction.innerText =
        "Make a wish, Bhavana! ✨";

    createConfetti();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


// =====================================
// 16. BACKGROUND MUSIC CONTROL
// =====================================

const birthdayMusic =
    document.getElementById("birthdayMusic");

const musicButton =
    document.getElementById("musicButton");

musicButton.addEventListener("click", async function() {

    if (birthdayMusic.paused) {

        try {

            await birthdayMusic.play();

            musicButton.innerText = "♫ Pause Music";

        } catch (error) {

            musicButton.innerText =
                "Add your music file 🎵";

            console.error("Music playback failed:", error);

        }

    } else {

        birthdayMusic.pause();

        musicButton.innerText = "♫ Play Music";

    }

});


// Update music button if audio ends or playback stops

birthdayMusic.addEventListener("pause", function() {

    musicButton.innerText = "♫ Play Music";

});

birthdayMusic.addEventListener("play", function() {

    musicButton.innerText = "♫ Pause Music";

});

