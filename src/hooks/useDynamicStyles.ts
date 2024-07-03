import { useEffect } from "react";
import { onePostType } from "../modules/posts/types";
import hslRgb from "hsl-rgb";

// the following hook should detect whether dark mode is enabled or not
// and set the tables background color, and tables border color accordingly

export default function useDynamicStyles(
  post: onePostType,
  setPost: React.Dispatch<React.SetStateAction<onePostType>>,
) {
  useEffect(() => {
    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      console.log(
        `Dark mode is ${matchMedia.matches ? "enabled" : "disabled"}`,
      );
      if (matchMedia.matches) {
        let tempPost = post?.post;
        const regex = /hsl\(\s*\d+,\s\d+%,\s\d+%\s*\)/g;
        const matches = tempPost?.match(regex);
        if (matches) {
          matches.forEach((match, i) => {
            const hslArr = match.match(/\d+/g);
            if (hslArr) {
              const [h, s, l] = hslArr;
              const rgbArr = hslRgb(
                Number(h),
                Number(s) / 100,
                Number(l) / 100,
              );
              const darkerRgb = isLightColor(rgbArr)
                ? adjustLuminance(rgbArr, -100)
                : undefined;
              if (darkerRgb) {
                const [r, g, b] = darkerRgb;
                matches[i] = `rgb(${r}, ${g}, ${b})`;
              }
            }
          });
          let counter = 0;
          tempPost = tempPost.replace(regex, () => matches[counter++]);
          setPost({ ...post, post: tempPost });
        }
      } else {
        setPost(post);
      }
    };

    handleChange(); // Check initial state
    matchMedia.addEventListener("change", handleChange);

    return () => {
      matchMedia.removeEventListener("change", handleChange);
    };
  }, [post, setPost]);
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
