import data from "./data/data.json";
import smokeSrc from "./images/smoke.png";
import pentagonSrc from "./images/pentagon.svg";
import { Slide } from "./types";
import { FrameHandler } from "./FrameHandler";
import { GA_STEP, OFFSET_MAX, OFFSET_STEP } from "./constants";
import { clipParallaxImage } from "./helpers/clipParallaxImage";

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
let offset = OFFSET_MAX;
let ga = 0.0;

const drawCanvas = (offset: number, ga: number) => {
    const parallax = new Image();
    parallax.src = slides[currentIndex].parallax;
    parallax.onload = () => {
        if (mainCtx && mainCanvas && parallaxCtx) {
            mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
            mainCtx.globalAlpha = ga;
            mainCtx.drawImage(pentagon, -281, 80, 1160, 458);
            mainCtx.globalCompositeOperation = "source-in";
            mainCtx.drawImage(backgroundCanvas, offset, 0);
            mainCtx.globalCompositeOperation = "source-over";

            parallaxCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
            clipParallaxImage(parallaxCtx, slides[currentIndex].clip);
            parallaxCtx.globalCompositeOperation = "source-in";
            parallaxCtx.drawImage(parallax, offset, 0);
            parallaxCtx.globalCompositeOperation = "source-over";

            mainCtx.drawImage(parallaxCanvas, 0, 0);
        }
    };
};

const fadeIn = (delta: number) => {
    const offsetDelta = OFFSET_STEP * delta;
    const gaDelta = GA_STEP * delta;
    drawCanvas(offset, ga);
    const nextOffset = offset - offsetDelta;
    const nextGA = ga + gaDelta;
    offset = nextOffset < 0 ? 0 : nextOffset;
    ga = nextGA < 0 ? 0 : nextGA > 1 ? 1 : nextGA;
};

const fadeOut = (delta: number) => {
    const offsetDelta = OFFSET_STEP * delta;
    const gaDelta = GA_STEP * delta;
    drawCanvas(offset, ga);
    const nextOffset = offset + offsetDelta;
    const nextGA = ga - gaDelta;
    offset = nextOffset > OFFSET_MAX ? OFFSET_MAX : nextOffset;
    ga = nextGA < 0 ? 0 : nextGA > 1 ? 1 : nextGA;
};

const fadeInFrameHandler = new FrameHandler(fadeIn);
const fadeOutFrameHandler = new FrameHandler(fadeOut);

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

            mainCtx.drawImage(backgroundCanvas, offset, 0);
            mainCtx.globalCompositeOperation = "source-over";

            clipParallaxImage(parallaxCtx, slides[currentIndex].clip);
            parallaxCtx.globalCompositeOperation = "source-in";
            parallaxCtx.drawImage(parallax, offset, 0);
            parallaxCtx.globalCompositeOperation = "source-over";

            mainCtx.drawImage(parallaxCanvas, 0, 0);

            fadeInFrameHandler.start();

            setTimeout(() => {
                fadeInFrameHandler.stop();
            }, 1000);
        }
    };

    const image = new Image();
    image.src = slides[currentIndex].main;
    image.onload = loadHandler;

    const parallax = new Image();
    parallax.src = slides[currentIndex].parallax;
    parallax.onload = loadHandler;
};

const handleNext = () => {
    text?.classList.add("out");
    fadeOutFrameHandler.start();

    setTimeout(() => {
        fadeOutFrameHandler.stop();

        if (currentIndex === slides.length - 1) {
            currentIndex = 0;
        } else {
            currentIndex++;
        }

        draw();
    }, 1000);
};

const handlePrev = () => {
    text?.classList.add("out");
    fadeOutFrameHandler.start();

    setTimeout(() => {
        fadeOutFrameHandler.stop();

        if (currentIndex === 0) {
            currentIndex = slides.length - 1;
        } else {
            currentIndex--;
        }

        draw();
    }, 1000);
};

nextBtn?.addEventListener("click", handleNext);
prevBtn?.addEventListener("click", handlePrev);

bottomBtns.forEach((btn, i) => {
    btn.addEventListener("click", () => {
        text?.classList.add("out");
        fadeOutFrameHandler.start();

        setTimeout(() => {
            fadeOutFrameHandler.stop();

            currentIndex = i;

            draw();
        }, 1000);
    });
});

draw();

const step = () => {
    setTimeout(() => {
        handleNext();
        step();
    }, 5000);
};

step();
