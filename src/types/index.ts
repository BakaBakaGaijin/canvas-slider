type Clip = "bottom" | "top" | "bottomRight" | null;

export interface Slide {
    title: string;
    description: string;
    main: string;
    parallax: string;
    clip: Clip;
}
