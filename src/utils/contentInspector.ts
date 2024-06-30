import base64ToImage from "./base64ToImage";
export default function contentInspector(content: string) {
  // finds base64 encoded images in the content
  const regex = /data:image\/[^\\>\\"]+/g;
  const matches = content.match(regex);
  const tempArr: File[] = [];
  // decodes base64 encoded images
  if (matches) {
    // creates an array of images from base64 encoded images
    matches.forEach((match, i) => {
      tempArr.push(base64ToImage(match, i));
    });

    let matchIndex = 0;
    // replaces base64 encoded images with URLs
    const newStr = content.replace(regex, () => tempArr[matchIndex++].name);
    // returns a new content without Base64 encoded images and the array of images
    return { post: newStr, gallery: tempArr };
  }
}
