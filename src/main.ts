import data from "./data/data.json";
import smokeSrc from "./images/smoke.png";
import pentagonSrc from "./images/pentagon.svg";
import { Slide } from "./types";

import "./style.css";

const text = document.querySelector(".text");
const title = document.querySelector(".title");
const description = document.querySelector(".description");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const bottomBtns = document.querySelectorAll(".slider-bottom-buttons__button");

const slides = data as Slide[];

const canvas: HTMLCanvasElement | null = document.querySelector("#canvas");
let ctx: CanvasRenderingContext2D | null | undefined;

if (canvas) {
    canvas.width = 967;
    canvas.height = 621;
    ctx = canvas.getContext("2d");
}

let currentIndex = 0;

const draw = () => {
    const secondCanvas: HTMLCanvasElement = document.createElement("canvas");
    secondCanvas.width = 967;
    secondCanvas.height = 621;
    const secondCtx = secondCanvas.getContext("2d");
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

        if (count === 4 && ctx && canvas && secondCtx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            secondCtx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(pentagon, -281, 80, 1160, 458);
            ctx.globalCompositeOperation = "source-in";

            ctx.drawImage(smoke, 0, 0, 236, 233.5, 100, -200, 1000, 1000);

            ctx.drawImage(image, 0, 0);
            ctx.globalCompositeOperation = "source-over";

            switch (slides[currentIndex].clip) {
                case "bottom":
                    secondCtx.fillStyle = "rgba(0, 0, 255, 1)";
                    secondCtx.fillRect(0, 0, 1160, 540);
                    break;
                case "top":
                    secondCtx.fillStyle = "rgba(0, 0, 255, 1)";
                    secondCtx.fillRect(0, 79, 1160, 540);
                    break;
                case "bottomRight":
                    secondCtx.beginPath();
                    secondCtx.moveTo(0, 0);
                    secondCtx.lineTo(878, 0);
                    secondCtx.lineTo(878, 500);
                    secondCtx.lineTo(838, 540);
                    secondCtx.lineTo(0, 540);
                    secondCtx.closePath();
                    secondCtx;
                    secondCtx.fill();
                    break;
                default:
                    break;
            }

            secondCtx.globalCompositeOperation = "source-in";

            secondCtx.drawImage(parallax1, 0, 0);

            ctx.drawImage(secondCanvas, 0, 0);
        }
    };

    const pentagon = new Image();
    pentagon.src = pentagonSrc;
    pentagon.onload = loadHandler;

    const smoke = new Image();
    smoke.src = smokeSrc;
    smoke.onload = loadHandler;

    const image = new Image();
    image.src = slides[currentIndex].main;
    image.onload = loadHandler;

    const parallax1 = new Image();
    parallax1.src = slides[currentIndex].parallax;
    parallax1.onload = loadHandler;
};

let timerId: number | null = null;

const slide = () => {
    if (timerId) {
        clearTimeout(timerId);
    }

    text?.classList.add("out");
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
