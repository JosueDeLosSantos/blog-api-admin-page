import React, { useState, useRef, useEffect } from "react";
// import { formDataType } from "../pages/CreateUpdatePost";
import ImageUploading, { ImageListType } from "react-images-uploading";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import { canvasPreview } from "../utils/canvasPreview";
import { useDebounceEffect } from "../utils/useDebounceEffect";
import "react-image-crop/dist/ReactCrop.css";
import AutorenewIcon from "@mui/icons-material/Autorenew";

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

type profilePicType = {
  src: string;
  file: File | undefined;
  trash: string | undefined;
};

type AppProps = {
  message?: string;
  onProfilePicChange: (src?: string, file?: File) => void;
  profilePic: profilePicType;
};

const App: React.FC<AppProps> = ({
  message = "Upload",
  onProfilePicChange,
  profilePic,
}) => {
  const [imgSrc, setImgSrc] = useState("");
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [fileName, setFileName] = useState("");
  const [images, setImages] = useState<ImageListType>([]);
  const [imageContainer, setImageContainer] = useState("block");
  const [cropSectionVisibility, setCropSectionVisibility] = useState("none");
  const [selectedCropSection, setSelectedCropSection] = useState("none");
  const [cropBtnsVisibility, setCropBtnsVisibility] = useState("block");
  const aspect = 1 / 1;

  useEffect(() => {
    if (profilePic.trash) {
      setImageContainer("none"); // disable Upload button
      setSelectedCropSection("block"); // enable Remove button
    }
  }, [profilePic.trash]);

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
    setCrop(centerAspectCrop(width, height, aspect));
    setImageContainer("none"); // hides fake image container
  }

  function onCrop(param: string) {
    setCropBtnsVisibility(`${param}`);
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

    const file = new File([blob], `${fileName} profile-pic`, {
      type: "image/jpeg",
    });

    setCropSectionVisibility("none");
    const croppedImgUrl = URL.createObjectURL(file);
    onProfilePicChange(croppedImgUrl, file);
    setSelectedCropSection("block");
  }

  function onRemoveCrop() {
    setImageContainer("block");
    setSelectedCropSection("none");
    setCropSectionVisibility("none");
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
        {({ onImageUpload, isDragging, dragProps }) => (
          <div>
            <BlogImgUploadBtn
              imageContainer={imageContainer}
              isDragging={isDragging}
              message={message}
              dragProps={{ ...dragProps }}
              onImageUpload={onImageUpload}
            />
            <ImgCrop
              cropSectionVisibility={cropSectionVisibility}
              aspect={aspect}
              imgSrc={imgSrc}
              imgRef={imgRef}
              previewCanvasRef={previewCanvasRef}
              completedCrop={completedCrop}
              crop={crop}
              cropBtnsVisibility={cropBtnsVisibility}
              onCrop={onCrop}
              onRemoveCrop={onRemoveCrop}
              setCrop={setCrop}
              setCompletedCrop={setCompletedCrop}
              onCropSelected={onCropSelected}
              onImageLoad={onImageLoad}
            />
            <BlogImgRemovalBtn
              selectedCropSection={selectedCropSection}
              onCrop={onCrop}
              onRemoveCrop={onRemoveCrop}
              onProfilePicChange={onProfilePicChange}
            />
          </div>
        )}
      </ImageUploading>
    </div>
  );
};

export default App;

interface ImgUploadBtnProps {
  imageContainer: string;
  isDragging: boolean;
  message: string;
  dragProps: {
    onDrop: (e: React.DragEvent<HTMLElement>) => void;
    onDragEnter: (e: React.DragEvent<HTMLElement>) => void;
    onDragLeave: (e: React.DragEvent<HTMLElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLElement>) => void;
    onDragStart: (e: React.DragEvent<HTMLElement>) => void;
  };
  onImageUpload: () => void;
}

const BlogImgUploadBtn: React.FC<ImgUploadBtnProps> = ({
  imageContainer,
  isDragging,
  message,
  dragProps,
  onImageUpload,
}) => {
  return (
    <div className="mx-auto w-full text-start md:mb-0 xl:text-xl">
      <button
        style={{ display: `${imageContainer}` }}
        className={
          isDragging
            ? "w-full cursor-pointer rounded border-none bg-white px-[1em] py-[0.5em] text-sm font-semibold text-slate-600 ring-1 ring-slate-400 hover:bg-blue-100 max-md:mt-5 dark:bg-blue-500 dark:text-slate-100 dark:hover:bg-blue-600"
            : "w-full cursor-pointer rounded border-none bg-white px-[1em] py-[0.5em] text-sm font-semibold text-slate-600 ring-1 ring-slate-400 hover:bg-slate-100 max-md:mt-5 dark:bg-blue-500 dark:text-slate-100 dark:hover:bg-blue-600"
        }
        onClick={(e) => {
          e.preventDefault();
          onImageUpload();
        }}
        {...dragProps}
      >
        {message}
      </button>
    </div>
  );
};

interface ImgCropPros {
  cropSectionVisibility: string;
  aspect: number;
  imgSrc: string;
  imgRef: React.RefObject<HTMLImageElement>;
  previewCanvasRef: React.RefObject<HTMLCanvasElement>;
  completedCrop: PixelCrop | undefined;
  crop: Crop | undefined;
  cropBtnsVisibility: string;
  onCrop: (param: string) => void;
  onRemoveCrop: () => void;
  setCrop: React.Dispatch<React.SetStateAction<Crop | undefined>>;
  setCompletedCrop: React.Dispatch<React.SetStateAction<PixelCrop | undefined>>;
  onCropSelected: () => void;
  onImageLoad: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

const ImgCrop: React.FC<ImgCropPros> = ({
  cropSectionVisibility,
  aspect,
  imgSrc,
  imgRef,
  previewCanvasRef,
  completedCrop,
  crop,
  cropBtnsVisibility,
  onCrop,
  onRemoveCrop,
  setCrop,
  setCompletedCrop,
  onCropSelected,
  onImageLoad,
}) => {
  return (
    <div
      style={{ display: `${cropSectionVisibility}` }}
      className="absolute left-0 top-0 h-[150vh] w-full bg-[rgba(0,0,0,0.7)]"
    >
      <div
        style={{
          display: `${cropSectionVisibility}`,
        }}
        className="absolute left-[50%] top-[50%] w-3/4 translate-x-[-50%] translate-y-[-120%] bg-white p-5 sm:w-fit"
      >
        <div
          style={{ display: `${cropSectionVisibility}` }}
          className="relative bottom-0 left-0 w-full"
        >
          <div className="flex justify-center">
            {!!imgSrc && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
                minWidth={50}
                minHeight={50}
                circularCrop
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
              <div className="flex justify-center gap-2">
                <button
                  style={{ display: `${cropBtnsVisibility}` }}
                  className="mt-2 gap-2 rounded bg-purple-600 px-[1em] py-[0.5em] font-bold text-white hover:bg-purple-700 max-sm:text-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    onCropSelected();
                    onCrop("none");
                  }}
                >
                  Crop
                </button>
                <button
                  style={{ display: `${cropBtnsVisibility}` }}
                  className="mt-2 rounded border border-slate-400 bg-white px-[0.8em] py-[0.5em] font-bold text-slate-500 hover:bg-slate-100 max-sm:text-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    onRemoveCrop();
                  }}
                >
                  Cancel
                </button>
                {cropBtnsVisibility === "none" &&
                  cropSectionVisibility === "block" && (
                    <div className="mt-2 gap-2 rounded bg-purple-600 px-[1em] py-[0.5em] font-medium text-white hover:bg-purple-700 max-sm:text-sm">
                      <AutorenewIcon
                        className="animate-spin" /* sx={{ fontSize: 80  }} */
                      />{" "}
                      Cropping
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface ImgRemovalBtnProps {
  selectedCropSection: string;
  onCrop: (param: string) => void;
  onRemoveCrop: () => void;
  onProfilePicChange: (src?: string) => void;
}

const BlogImgRemovalBtn: React.FC<ImgRemovalBtnProps> = ({
  selectedCropSection,
  onCrop,
  onRemoveCrop,
  onProfilePicChange,
}) => {
  return (
    <div style={{ display: `${selectedCropSection}` }}>
      <button
        onClick={(e) => {
          e.preventDefault();
          onRemoveCrop();
          onProfilePicChange();
          onCrop("block");
        }}
        className="w-full cursor-pointer rounded border-none bg-white px-[1em] py-[0.5em] text-sm font-semibold text-slate-600 ring-1 ring-slate-400 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
      >
        Remove
      </button>
    </div>
  );
};
