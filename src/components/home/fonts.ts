import { Mona_Sans, Work_Sans } from "next/font/google";

/** Body and display faces of the site design; apply both `.variable`s next to the `.home` class. */
export const bodyFont = Work_Sans({ subsets: ["latin"], variable: "--home-body", display: "swap" });
export const displayFont = Mona_Sans({ subsets: ["latin"], variable: "--home-display", display: "swap" });
