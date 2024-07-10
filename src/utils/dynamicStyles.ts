import { onePostType } from "../types/types";
import hslRgb from "hsl-rgb";

/**
 * Custom React hook that updates the post content based on the user's preferred color scheme.
 *
 * @param {onePostType} post - The current post content.
 * @param {React.Dispatch<React.SetStateAction<onePostType>>} setPost - The function to update the post content.
 * @return {void}
 */
export default function dynamicStyles(
  post: onePostType,
  setPost: React.Dispatch<React.SetStateAction<onePostType>>,
) {
  const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");

  // check if the user's preferred color scheme is dark
  if (matchMedia.matches) {
    let tempPost = post?.post;
    // Find all hsl values for background-color
    // ex: background-color:hsl(0, 0%, 0%)
    const bg_color_regex =
      /(?<=background-color:)hsl\(\s*\d+,\s*\d+%,\s*\d+%\s*\)/g;
    const bgColorMatches = tempPost?.match(bg_color_regex);

    // bg colors will be darker
    if (bgColorMatches) {
      bgColorMatches.forEach((match, i) => {
        // deserialize hsl
        const hslArr = match.match(/\d+/g);
        if (hslArr) {
          const [h, s, l] = hslArr;
          // convert to rgb
          const rgbArr = hslRgb(Number(h), Number(s) / 100, Number(l) / 100);
          // adjust luminance to a darker version of the color
          const darkerRgb = isLightColor(rgbArr)
            ? adjustLuminance(rgbArr, -100)
            : undefined;
          if (darkerRgb) {
            const [r, g, b] = darkerRgb;
            // replace hsl string with rgb
            bgColorMatches[i] = `rgb(${r}, ${g}, ${b})`;
          }
        }
      });
      let counter = 0;
      tempPost = tempPost.replace(
        bg_color_regex,
        () => bgColorMatches[counter++],
      );
    }

    const remainingColors = /hsl\(\s*\d+,\s*\d+%,\s*\d+%\s*\)/g;
    const remainingColorMatches = tempPost?.match(remainingColors);

    // remaining colors will be lighter
    if (remainingColorMatches) {
      remainingColorMatches.forEach((match, i) => {
        // deserialize hsl
        const hslArr = match.match(/\d+/g);
        if (hslArr) {
          const [h, s, l] = hslArr;
          // convert to rgb
          const rgbArr = hslRgb(Number(h), Number(s) / 100, Number(l) / 100);
          // adjust luminance to a lighter version of the color
          const lighterRgb = isLightColor(rgbArr)
            ? undefined
            : adjustLuminance(rgbArr, 100);
          if (lighterRgb) {
            const [r, g, b] = lighterRgb;
            // replace hsl string with rgb
            remainingColorMatches[i] = `rgb(${r}, ${g}, ${b})`;
          }
        }
      });
      let counter = 0;
      tempPost = tempPost.replace(
        remainingColors,
        () => remainingColorMatches[counter++],
      );
    }

    setPost({ ...post, post: tempPost });
  } else {
    // user's preferred color scheme is light
    // do nothing
    setPost({ ...post, post: post?.post });
  }
}

/**
 * Adjusts the luminance of an RGB color by a given factor.
 *
 * @param {number[]} rgbColor - The RGB color to adjust.
 * @param {number} factor - The factor by which to adjust the luminance.
 * @return {number[]} The adjusted RGB color.
 */
function adjustLuminance(rgbColor: number[] | undefined, factor: number) {
  if (rgbColor !== undefined) {
    const [r, g, b] = rgbColor;
    const adjustedR = Math.min(255, Math.max(0, r + factor));
    const adjustedG = Math.min(255, Math.max(0, g + factor));
    const adjustedB = Math.min(255, Math.max(0, b + factor));
    return [adjustedR, adjustedG, adjustedB];
  }
}

/**
 * Determines if a given RGB color is light or dark based on its brightness.
 *
 * @param {number[]} rgbArr - The RGB color to check.
 * @return {boolean} Returns true if the color is light, false otherwise.
 */
function isLightColor(rgbArr: number[]) {
  const color = rgbArr;
  const brightness = Math.round(
    (parseInt(color[0].toString()) * 299 +
      parseInt(color[1].toString()) * 587 +
      parseInt(color[2].toString()) * 114) /
      1000,
  );
  const isLight = brightness > 125 ? true : false;
  return isLight;
}
