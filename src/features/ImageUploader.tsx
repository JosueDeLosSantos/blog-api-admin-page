import { useState } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { formDataType } from "../components/CreateUpdatePost";

const ImageUploader = ({
  message = "Click or Drop here",
  url = "",
  operation = "create",
  formData,
  setFormData,
}: {
  formData: formDataType;
  setFormData: (formData: formDataType) => void;
  message?: string;
  url?: string;
  operation?: string;
}) => {
  const [images, setImages] = useState<ImageListType>([]);
  const [imageContainer, setImageContainer] = useState("block");

  const onChange = (imageList: ImageListType) => {
    setImages(imageList);
    setImageContainer("none");
    setFormData({ ...formData, file: imageList[0].file });
  };

  function removeImage(index: number) {
    setImages(images.filter((_, i) => i !== index));
    setImageContainer("block");
  }

  return (
    <div className="box-border">
      <ImageUploading value={images} onChange={onChange} dataURLKey="data_url">
        {({ imageList, onImageUpload, isDragging, dragProps }) => (
          // write your building UI
          <div className="mx-auto w-full text-start md:mb-0 xl:text-xl">
            {operation === "create" ? (
              <button
                style={{ display: `${imageContainer}` }}
                className={
                  isDragging
                    ? "h-[24rem] w-full rounded-lg bg-blue-100 text-2xl font-bold text-blue-300 max-sm:h-[12rem] dark:bg-slate-900 dark:text-slate-700"
                    : "h-[24rem] w-full rounded-lg bg-slate-200 text-2xl font-bold text-slate-400 max-sm:h-[12rem] dark:bg-slate-800 dark:text-slate-600"
                }
                onClick={onImageUpload}
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
            &nbsp;
            {imageList.map((image, index) => (
              <>
                <div
                  key={`image-${index}`}
                  className="relative bottom-0 left-0 h-[24rem] w-full max-sm:h-[12rem]"
                >
                  <img
                    className="absolute left-0 top-0 h-full w-full rounded-lg object-cover"
                    src={image["data_url"]}
                    alt=""
                  />
                </div>
                <button>
                  <button
                    className="mt-2 rounded bg-red-500 px-[1em] py-[0.5em] font-bold text-white hover:bg-red-700 max-sm:text-sm"
                    onClick={() => removeImage(index)}
                  >
                    Remove
                  </button>
                </button>
              </>
            ))}
          </div>
        )}
      </ImageUploading>
    </div>
  );
};

export default ImageUploader;
