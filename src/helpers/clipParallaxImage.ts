import { Clip } from "../types";

export const clipParallaxImage = (parallaxCtx: CanvasRenderingContext2D, clipType: Clip) => {
    switch (clipType) {
        case "bottom":
            parallaxCtx.fillRect(0, 0, 1160, 540);
            break;
        case "top":
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
};
