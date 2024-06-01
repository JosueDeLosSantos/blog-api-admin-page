import React, { useState, useRef } from "react";
import { formDataType } from "../../components/CreateUpdatePost";
import ImageUploading, { ImageListType } from "react-images-uploading";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import { canvasPreview } from "./canvasPreview";
import { useDebounceEffect } from "./useDebounceEffect";
import "react-image-crop/dist/ReactCrop.css";

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(mediaWidth: number, mediaHeight: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      16 / 9,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export default function App({
  message = "Click or Drop here",
  operation = "create",
  url = "",
  formData,
  setFormData,
}: {
  message?: string;
  operation?: string;
  url?: string;
  formData: formDataType;
  setFormData: (formData: formDataType) => void;
}) {
  const [imgSrc, setImgSrc] = useState("");
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [fileName, setFileName] = useState("");
  const [images, setImages] = useState<ImageListType>([]);
  const [imageContainer, setImageContainer] = useState("block");
  const [cropSectionVisibility, setCropSectionVisibility] = useState("block");
  const [selectedCropSection, setSelectedCropSection] = useState("none");
  const [selectedCroppedImageSrc, setSelectedCroppedImageSrc] = useState("");
  const aspect = 16 / 9;

  const onChange = (imageList: ImageListType) => {
    setImages(imageList);
    setImgSrc(imageList[0]["data_url"]);
    if (imageList[0].file) {
      setFileName(imageList[0].file.name);
    }
    setCrop(undefined); // Makes crop preview update between images.
    setImageContainer("none"); // hides fake image container

    if (cropSectionVisibility === "none") setCropSectionVisibility("block");
  };

  // MARK: onImageLoad
  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height));
    setImageContainer("none"); // hides fake image container
  }

  // MARK: onDownloadCropClick
  async function onCropSelected() {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error("Crop canvas does not exist");
    }

    // This will size relative to the uploaded image
    // size. If you want to size according to what they
    // are looking at on screen, remove scaleX + scaleY
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
    );
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height,
    );
    // You might want { type: "image/jpeg", quality: <0 to 1> } to
    // reduce image size
    const blob = await offscreen.convertToBlob({
      type: "image/png",
    });

    const file = new File([blob], `${fileName} cropped`, {
      type: "image/jpeg",
    });

    setCropSectionVisibility("none");
    setFormData({ ...formData, file: file });
    const croppedImgUrl = URL.createObjectURL(file);
    setSelectedCroppedImageSrc(croppedImgUrl);
    setSelectedCropSection("block");
    console.log(file);
  }

  function onRemoveCrop() {
    setImageContainer("block");
    setSelectedCropSection("none");
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
      }
    },
    100,
    [completedCrop],
  );

  // MARK: render
  return (
    <div>
      <ImageUploading value={images} onChange={onChange} dataURLKey="data_url">
        {({ imageList, onImageUpload, isDragging, dragProps }) => (
          <div>
            <div className="mx-auto w-full text-start md:mb-0 xl:text-xl">
              {operation === "create" ? (
                <button
                  style={{ display: `${imageContainer}` }}
                  className={
                    isDragging
                      ? "h-[24rem] w-full rounded-lg bg-blue-100 text-2xl font-bold text-blue-300 max-sm:h-[12rem] dark:bg-slate-900 dark:text-slate-700"
                      : "h-[24rem] w-full rounded-lg bg-slate-200 text-2xl font-bold text-slate-400 max-sm:h-[12rem] dark:bg-slate-800 dark:text-slate-600"
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    onImageUpload();
                  }}
                  {...dragProps}
                >
                  {message}
                </button>
              ) : (
                <div style={{ display: `${imageContainer}` }}>
                  <div className="relative bottom-0 left-0 h-[24rem] w-full max-sm:h-[12rem]">
                    <img
                      className="absolute left-0 top-0 h-full w-full rounded-lg object-cover"
                      src={url}
                      alt=""
                    />
                  </div>
                  <button
                    className="mt-2 rounded bg-blue-500 px-[1em] py-[0.5em] font-bold text-white hover:bg-blue-700 max-sm:text-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      onImageUpload();
                    }}
                  >
                    Update
                  </button>
                </div>
              )}
            </div>
            <div
              style={{ display: `${cropSectionVisibility}` }}
              className="relative bottom-0 left-0 w-full"
            >
              <div>
                {!!imgSrc && (
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={16 / 9}
                    // minWidth={400}
                    minHeight={100}
                    // circularCrop
                  >
                    <img
                      className="rounded-lg object-cover"
                      ref={imgRef}
                      alt="Crop me"
                      src={imgSrc}
                      onLoad={onImageLoad}
                    />
                  </ReactCrop>
                )}
              </div>
              {!!completedCrop && (
                <div>
                  {/* remove the hidden class to see crop preview. 
                  This element can't be removed or the library will
                  misbehave.*/}
                  <div className="hidden">
                    <canvas
                      ref={previewCanvasRef}
                      style={{
                        border: "1px solid black",
                        objectFit: "contain",
                        width: "100%",
                        // width: completedCrop.width,
                        // height: completedCrop.height,
                      }}
                    />
                  </div>
                  <button
                    className="mt-2 rounded bg-green-600 px-[1em] py-[0.5em] font-bold text-white hover:bg-green-700 max-sm:text-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      onCropSelected();
                    }}
                  >
                    Crop
                  </button>
                </div>
              )}
            </div>
            <div style={{ display: `${selectedCropSection}` }}>
              <div className="relative bottom-0 left-0 h-[24rem] w-full max-sm:h-[12rem]">
                <img
                  className="absolute left-0 top-0 h-full w-full rounded-lg object-cover"
                  src={selectedCroppedImageSrc}
                  alt=""
                />
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  onRemoveCrop();
                }}
                className="mt-2 rounded bg-red-500 px-[1em] py-[0.5em] font-bold text-white hover:bg-red-700 max-sm:text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </ImageUploading>
    </div>
  );
}
