import { FormEvent, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import { addPost, updatePost } from "../modules/posts/utils/postsSlice";
import { switchPrivilege } from "../modules/posts/utils/privilegeSlice";
import he from "he"; // decodes mongodb encoded HTML
import { editPostType } from "../modules/posts/types";
import TextareaAutosize from "react-textarea-autosize";
import ImageUploader from "../components/ImageUploader";
import { ImageType } from "react-images-uploading";
// CKEditor imports
import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic";
import { Essentials } from "@ckeditor/ckeditor5-essentials";
import { Bold, Italic } from "@ckeditor/ckeditor5-basic-styles";
import { Paragraph } from "@ckeditor/ckeditor5-paragraph";
import { ImageUpload, Image } from "@ckeditor/ckeditor5-image";
import { SimpleUploadAdapter } from "@ckeditor/ckeditor5-upload";
import { Table } from "@ckeditor/ckeditor5-table";
import "./editor.css";

type fileType = {
  filename: string;
  originalname: string;
  mimetype: string;
  path: string;
  size: number;
};

export type formDataType = {
  title: string;
  description: string;
  post: string;
  comments: string[];
  file: string | File | fileType | ImageType | undefined;
  trash: string;
};

function CreateUpdatePost({
  operation,
  server,
}: {
  operation: string;
  server: string;
}) {
  const jwtToken = localStorage.getItem("accessToken");
  const dispatch: AppDispatch = useDispatch();
  const { name } = useParams();
  const { state }: { state: editPostType | null } = useLocation();
  const [formData, setFormData] = useState<formDataType>({
    /* mongodb do not process apostrophes and commas as humans do, so he.decode helps to fix that */
    title: state !== null ? he.decode(state.title) : "",
    description: state !== null ? he.decode(state.description) : "",
    post: state !== null ? he.decode(state.post) : "",
    comments: state !== null ? state.comments : [],
    file: state !== null ? state.file : "",
    // if the initial state.post.file value includes metadata for any file stored in the server
    // that filename is saved in a temporal trash state. It will be useful if
    // a new file is uploaded so that we can command the server to delete the old one.
    trash: state !== null ? state.file.filename : "",
  });
  const navigate = useNavigate();

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePostChange = (arg: string): void => {
    setFormData({ ...formData, post: arg });
  };

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    post: "",
    file: "",
  });

  type ErrorsArrayType = {
    location: string;
    msg: string;
    path: string;
    type: string;
    value: string;
  };

  function errorHandler(errorsArray: ErrorsArrayType[]) {
    const errorsInitialState = {
      title: "",
      description: "",
      post: "",
      file: "",
    };
    while (errorsArray.length > 0) {
      const error = errorsArray.shift() as ErrorsArrayType;
      switch (error.path) {
        case "title":
          errorsInitialState.title = error.msg;
          break;
        case "description":
          errorsInitialState.description = error.msg;
          break;
        case "post":
          errorsInitialState.post = error.msg;
          break;
        case "file":
          errorsInitialState.file = error.msg;
          break;
        default:
          break;
      }
    }
    setErrors(errorsInitialState);
  }

  // MARK: onSubmit
  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    const headers: Record<string, string> = {};

    if (operation === "update") {
      /* the condition bellow fixes unexpected behavior when
			an image file is selected and then deselected,
			to make sure that the file property is always filled,
			since no post without image should be submitted */
      if (formData.file === "") {
        formData.file = state!.file;
      }

      const apiUrl = `${server}user/posts/${name}`;
      if (jwtToken) {
        headers["Authorization"] = `Bearer ${jwtToken}`;
      }

      try {
        const response = await axios.putForm(apiUrl, formData, {
          headers: headers,
        });

        if (response.data.errors) {
          const errorsArray = response.data.errors as ErrorsArrayType[];
          errorHandler(errorsArray);
        } else {
          delete response.data.post.post;
          delete response.data.post.comments;
          dispatch(updatePost(response.data.post)); // update global state
          navigate("/posts");
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        if (
          axiosError?.response?.status === 403 ||
          axiosError?.response?.status === 401
        ) {
          // if it's forbidden or unauthorized it will be logged out
          dispatch(switchPrivilege("user")); // logout
          navigate("/log-in");
        } else {
          navigate("/server-error");
        }
      }
    } else {
      const apiUrl = `${server}user/create-post`;
      if (jwtToken) {
        headers["Authorization"] = `Bearer ${jwtToken}`;
      }

      try {
        const response = await axios.postForm(apiUrl, formData, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        if (response.data.errors) {
          const errorsArray = response.data.errors as ErrorsArrayType[];
          errorHandler(errorsArray);
        } else {
          delete response.data.post.post;
          delete response.data.post.comments;
          dispatch(addPost(response.data.post)); // update global state
          navigate("/posts");
        }
      } catch (error) {
        const axiosError = error as AxiosError;

        if (
          axiosError?.response?.status === 403 ||
          axiosError?.response?.status === 401
        ) {
          // if it's forbidden or unauthorized it will be logged out
          dispatch(switchPrivilege("user")); // logout
          navigate("/log-in");
        } else {
          navigate("/server-error");
        }
      }
    }
  }

  // MARK: image deletion
  async function imageDeletion(value: string) {
    try {
      const response = await axios.delete(
        `${server}user/delete-image/${value}`,
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const editorConfiguration = {
    plugins: [
      Essentials,
      Bold,
      Italic,
      Paragraph,
      SimpleUploadAdapter,
      ImageUpload,
      Image,
      Table,
    ],
    toolbar: ["bold", "italic", "|", "uploadImage", "insertTable"],
    simpleUpload: {
      // The URL that the images are uploaded to.
      uploadUrl: `http://localhost:3000/user/upload-image`,
      /* 
      // Enable the XMLHttpRequest.withCredentials property.
      withCredentials: true,

      // Headers sent along with the XMLHttpRequest to the upload server.
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      }, */
    },
  };

  // MARK: return

  return (
    <>
      <div className="pb-5 max-sm:mt-5 sm:mt-8">
        <div className="mx-auto max-w-[900px] max-lg:mt-14 sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow-sm sm:rounded-lg ">
            <div className="min-h-[80vh] border-gray-200  bg-white p-6 dark:bg-slate-700">
              <form onSubmit={onSubmit}>
                {operation === "update" && (
                  <h1 className="text-center text-2xl font-bold sm:text-3xl">
                    Update post
                  </h1>
                )}
                {operation !== "update" && (
                  <h1 className="text-center text-2xl font-bold sm:text-3xl">
                    Create post
                  </h1>
                )}
                <div className="mb-4 mt-16">
                  <label
                    htmlFor="title"
                    className="text-xl font-bold text-gray-700 lg:text-2xl dark:text-gray-200"
                  >
                    Title{" "}
                    <span className="text-red-500 dark:text-red-300">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={170}
                    className="py focus:shadow-outline mt-3 box-border h-10 w-full appearance-none rounded  border border-[#461c5f] bg-gray-200 px-2 text-sm leading-tight text-gray-700 focus:border-blue-300 focus:outline-none dark:border-slate-400 dark:bg-gray-800 dark:text-gray-200"
                    name="title"
                    onInput={handleInputChange}
                    value={formData.title}
                    required
                  />
                  <span className="text-sm text-gray-400">{`${formData.title.length}/170`}</span>
                  <br />
                  <span className="text-red-600 max-sm:text-xs sm:text-sm dark:text-red-300">
                    {errors.title}
                  </span>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="text-xl font-bold text-gray-700 lg:text-2xl dark:text-gray-200"
                  >
                    Description{" "}
                  </label>
                  <TextareaAutosize
                    maxLength={370}
                    minRows={2}
                    className="focus:shadow-outline mt-3 box-border w-full resize-none appearance-none rounded border border-[#461c5f] bg-gray-200 px-2 py-2 text-sm leading-tight text-gray-700 focus:border-blue-300 focus:outline-none dark:border-slate-400 dark:bg-gray-800 dark:text-gray-200"
                    name="description"
                    onInput={handleDescriptionChange}
                    value={formData.description}
                  />
                  <span className="text-sm text-gray-400">{`${formData.description.length}/370`}</span>
                  <br />
                  <span className="text-red-600 max-sm:text-xs sm:text-sm dark:text-red-300">
                    {errors.description}
                  </span>
                </div>

                <div className="mb-4 space-y-3">
                  <label className="text-xl font-bold text-gray-700 lg:text-2xl dark:text-gray-200">
                    Content{" "}
                    <span className="text-red-500 dark:text-red-300">*</span>
                  </label>

                  <CKEditor
                    editor={ClassicEditor}
                    data={formData.post}
                    config={editorConfiguration}
                    onChange={(_, editor) => {
                      const content = editor.getData(); // Get the updated content
                      handlePostChange(content); // Update the state
                      /* const toolbarItems = Array.from(
                        editor.ui.componentFactory.names(), // display available list of toolbar editor
                      );
                      console.log(toolbarItems.sort()); */
                    }}
                    onReady={(editor) => {
                      editor.editing.view.document.on("delete", () => {
                        const selection = editor.model.document.selection;
                        const selectedElement = selection.getSelectedElement();
                        const regex = /imageBlock/i;
                        if (
                          selectedElement &&
                          selectedElement.name.match(regex)
                        ) {
                          const imageUrl = selectedElement.getAttribute("src");
                          const url = `${imageUrl}`;
                          const urlSplit = url.split("/");
                          const imageName = urlSplit[urlSplit.length - 1];
                          console.log(imageName);
                          imageDeletion(`${imageName}`);
                        }
                      });
                    }}
                  />

                  <span className="text-sm text-gray-400">{`${formData.post.length}/100000`}</span>
                  <br />
                  <span className="text-red-600 max-sm:text-xs sm:text-sm dark:text-red-300">
                    {errors.post}
                  </span>
                </div>

                <div className="mb-4 space-y-3">
                  <label
                    htmlFor="file"
                    className="text-xl font-bold text-gray-700 lg:text-2xl dark:text-gray-200"
                  >
                    Image
                  </label>
                  <span className="text-red-500 dark:text-red-300">*</span>

                  {operation === "update" && (
                    <ImageUploader
                      formData={formData}
                      setFormData={setFormData}
                      operation="update"
                      url={`${server}${state?.file.path}`}
                    />
                  )}

                  {operation === "create" && (
                    <ImageUploader
                      formData={formData}
                      setFormData={setFormData}
                    />
                  )}
                  <span className="text-red-600 max-sm:text-xs sm:text-sm dark:text-red-300">
                    {errors.file}
                  </span>
                </div>

                <div className="mt-10 flex w-full gap-5">
                  <div className="w-1/2">
                    <button
                      role="submit"
                      className="py mx-auto h-10 w-full cursor-pointer rounded border border-[#461c5f] bg-purple-600 font-semibold text-white hover:bg-purple-700 xl:text-xl dark:bg-purple-500 dark:hover:bg-purple-600"
                    >
                      Submit
                    </button>
                  </div>

                  <div className="w-1/2">
                    <button
                      onClick={() => navigate("/posts")}
                      className="py mx-auto h-10 w-full cursor-pointer rounded border-none bg-white px-2 font-semibold text-slate-500 ring-1 ring-slate-400 hover:bg-slate-100 xl:text-xl dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
                      type="button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateUpdatePost;
