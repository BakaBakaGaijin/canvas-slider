import data from "./data/data.json";
import smokeSrc from "./images/smoke.png";
import pentagonSrc from "./images/pentagon.svg";
import { Slide } from "./types";

import "./style.css";

const pentagon = new Image();
pentagon.src = pentagonSrc;
let isPentagonLoaded = false;
pentagon.onload = () => (isPentagonLoaded = true);

const smoke = new Image();
smoke.src = smokeSrc;
let isSmokeLoaded = false;
smoke.onload = () => (isSmokeLoaded = true);

const text = document.querySelector(".text");
const title = document.querySelector(".title");
const description = document.querySelector(".description");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const bottomBtns = document.querySelectorAll(".slider-bottom-buttons__button");

const slides = data as Slide[];

const mainCanvas: HTMLCanvasElement | null = document.querySelector("#canvas");
let mainCtx: CanvasRenderingContext2D | null | undefined;

if (mainCanvas) {
    mainCanvas.width = 967;
    mainCanvas.height = 621;
    mainCtx = mainCanvas.getContext("2d");
}

const backgroundCanvas: HTMLCanvasElement | null = document.createElement("canvas");
let backgroundCtx: CanvasRenderingContext2D | null | undefined;

if (backgroundCanvas) {
    backgroundCanvas.width = 967;
    backgroundCanvas.height = 621;
    backgroundCtx = backgroundCanvas.getContext("2d");
}

const parallaxCanvas: HTMLCanvasElement = document.createElement("canvas");
parallaxCanvas.width = 967;
parallaxCanvas.height = 621;
const parallaxCtx = parallaxCanvas.getContext("2d");

let currentIndex = 0;

const draw = () => {
    text?.classList.remove("out");

    if (title) {
        title.textContent = slides[currentIndex].title;
    }

    if (description) {
        description.textContent = slides[currentIndex].description;
    }

    bottomBtns.forEach((btn, i) =>
        i === currentIndex ? btn.classList.add("active") : btn.classList.remove("active")
    );

    let count = 0;

    const loadHandler = () => {
        count++;
        let delta = 64;
        let ga = 0.0;
        let time = 64;

        if (
            count === 2 &&
            backgroundCtx &&
            backgroundCanvas &&
            parallaxCtx &&
            mainCanvas &&
            mainCtx &&
            isPentagonLoaded &&
            isSmokeLoaded
        ) {
            mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
            backgroundCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
            parallaxCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

            mainCtx.globalAlpha = ga;

            mainCtx.drawImage(pentagon, -281, 80, 1160, 458);
            mainCtx.globalCompositeOperation = "source-in";

            backgroundCtx.drawImage(smoke, 0, 0, 236, 233.5, 100, -200, 1000, 1000);
            backgroundCtx.globalCompositeOperation = "source-in";

            backgroundCtx.drawImage(image, 0, 0);
            backgroundCtx.globalCompositeOperation = "source-over";

            mainCtx.drawImage(backgroundCanvas, delta, 0);
            mainCtx.globalCompositeOperation = "source-over";

            switch (slides[currentIndex].clip) {
                case "bottom":
                    parallaxCtx.fillStyle = "rgba(0, 0, 255, 1)";
                    parallaxCtx.fillRect(0, 0, 1160, 540);
                    break;
                case "top":
                    parallaxCtx.fillStyle = "rgba(0, 0, 255, 1)";
                    parallaxCtx.fillRect(0, 79, 1160, 540);
                    break;
                case "bottomRight":
                    parallaxCtx.beginPath();
                    parallaxCtx.moveTo(0, 0);
                    parallaxCtx.lineTo(878, 0);
                    parallaxCtx.lineTo(878, 500);
                    parallaxCtx.lineTo(838, 540);
                    parallaxCtx.lineTo(0, 540);
                    parallaxCtx.closePath();
                    parallaxCtx.fill();
                    break;
                default:
                    parallaxCtx.beginPath();
                    parallaxCtx.moveTo(0, 0);
                    parallaxCtx.lineTo(878, 0);
                    parallaxCtx.lineTo(878, 500);
                    parallaxCtx.lineTo(838, 540);
                    parallaxCtx.lineTo(0, 540);
                    parallaxCtx.closePath();
                    parallaxCtx.fill();
                    break;
            }

            parallaxCtx.globalCompositeOperation = "source-in";
            parallaxCtx.drawImage(parallax, 0, 0);
            parallaxCtx.globalCompositeOperation = "source-over";

            mainCtx.drawImage(parallaxCanvas, delta, 0);

            const fadeIn = () => {
                if (time < 0) return;

                setTimeout(() => {
                    if (mainCtx) {
                        mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                        mainCtx.globalAlpha = ga;
                        mainCtx.drawImage(pentagon, -281, 80, 1160, 458);
                        mainCtx.globalCompositeOperation = "source-in";
                        mainCtx.drawImage(backgroundCanvas, delta, 0);
                        mainCtx.globalCompositeOperation = "source-over";
                        mainCtx.drawImage(parallaxCanvas, delta, 0);
                        time -= 1;
                        delta -= 1;
                        ga += 0.016;

                        fadeIn();
                    }
                }, 16);
            };

            fadeIn();
        }
    };

    const image = new Image();
    image.src = slides[currentIndex].main;
    image.onload = loadHandler;

    const parallax = new Image();
    parallax.src = slides[currentIndex].parallax;
    parallax.onload = loadHandler;
};

let timerId: number | null = null;
let time = 0;
let delta = 10;
let ga = 1.0;

const fadeOut = () => {
    if (time > 63) return;

    setTimeout(() => {
        if (mainCtx && mainCanvas && isPentagonLoaded) {
            mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
            mainCtx.globalAlpha = ga;
            mainCtx.drawImage(pentagon, -281, 80, 1160, 458);
            mainCtx.globalCompositeOperation = "source-in";
            mainCtx.drawImage(backgroundCanvas, delta, 0);
            mainCtx.globalCompositeOperation = "source-over";
            mainCtx.drawImage(parallaxCanvas, delta, 0);
            time += 1;
            delta += 1;
            ga -= 0.016;

            fadeOut();
        }
    }, 16);
};

const slide = () => {
    time = 0;
    delta = 10;
    ga = 1.0;

    if (timerId) {
        clearTimeout(timerId);
    }

    text?.classList.add("out");
    fadeOut();

    timerId = setTimeout(draw, 1000);
};

const handleNext = () => {
    if (currentIndex === slides.length - 1) {
        currentIndex = 0;
    } else {
        currentIndex++;
    }

    slide();
};

const handlePrev = () => {
    if (currentIndex === 0) {
        currentIndex = slides.length - 1;
    } else {
        currentIndex--;
    }

    slide();
};

nextBtn?.addEventListener("click", handleNext);
prevBtn?.addEventListener("click", handlePrev);

bottomBtns.forEach((btn, i) => {
    btn.addEventListener("click", () => {
        currentIndex = i;

        slide();
    });
});

slide();

const step = () => {
    timerId = setTimeout(() => {
        handleNext();
        step();
    }, 5000);
};

step();
