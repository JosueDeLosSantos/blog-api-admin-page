export default function base64ToImage(base64Url: string, index: number): File {
  const byteString = atob(base64Url.split(",")[1]);
  const mimeString = base64Url.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([ab], { type: mimeString });

  const file = new File([blob], `data-image-${index}`, {
    type: "image/jpeg",
  });

  return file;
}
