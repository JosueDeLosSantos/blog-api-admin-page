import { FormEvent, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import { addPost, updatePost } from "../features/posts/postsSlice";
import { switchPrivilege } from "../features/posts/privilegeSlice";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "./editor.css";
import he from "he"; // decodes mongodb encoded HTML
import { editPostType } from "../features/posts/types";
import MenuBar from "../features/MenuBar";
import MenuBarLarge from "../features/MenuBarLarge";
import useWindowSize from "../features/windowSize";
import TextareaAutosize from "react-textarea-autosize";

type fileType = {
  filename: string;
  originalname: string;
  mimetype: string;
  path: string;
  size: number;
};

type formDataType = {
  title: string;
  description: string;
  post: string;
  author: string;
  comments: string[];
  file: string | File | fileType;
  trash: string;
};

function CreateUpdatePost({ operation }: { operation: string }) {
  const dispatch: AppDispatch = useDispatch();
  const { name } = useParams();
  const { state }: { state: editPostType | null } = useLocation();
  const [formData, setFormData] = useState<formDataType>({
    /* mongodb do not process apostrophes and commas as humans do, so he.decode helps to fix that */
    title: state !== null ? he.decode(state.title) : "",
    description: state !== null ? he.decode(state.description) : "",
    post: state !== null ? he.decode(state.post) : "",
    author: state !== null ? he.decode(state.author) : "",
    comments: state !== null ? state.comments : [],
    file: state !== null ? state.file : "",
    // if the initial state.post.file value includes metadata for any file stored in the server
    // that filename is saved in a temporal trash state. It will be useful if
    // a new file is uploaded so that we can command the server to delete the old one.
    trash: state !== null ? state.file.filename : "",
  });
  const navigate = useNavigate();

  const handlePostChange = (arg: string): void => {
    setFormData({ ...formData, post: arg });
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const { name, value, files } = event.target;
    setFormData({ ...formData, [name]: files?.length ? files[0] : value });
  };

  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    post: "",
    author: "",
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
      author: "",
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
        case "author":
          errorsInitialState.author = error.msg;
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

    const jwtToken = localStorage.getItem("accessToken");
    const headers: Record<string, string> = {};

    if (operation === "update") {
      /* the condition bellow fixes unexpected behavior when
			an image file is selected and then deselected,
			to make sure that the file property is always filled,
			since no post without image should be submitted */
      if (formData.file === "") {
        formData.file = state!.file;
      }

      // http://localhost:3000/user/posts/:name
      //https://dummy-blog.adaptable.app/user/posts/:name
      const apiUrl = `http://localhost:3000/user/posts/${name}`;
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
          navigate("/");
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
      const apiUrl = "http://localhost:3000/user/create-post";
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
          navigate("/");
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

  const editorConfiguration = {
    // Displaying the proper UI element in the toolbar.
    toolbar: [
      "heading",
      "|",
      "bold",
      "italic",
      "link",
      "bulletedList",
      "numberedList",
      "|",
      "outdent",
      "indent",
      "|",
      "blockQuote",
      "insertTable",
      "undo",
      "redo",
    ],
  };

  const { windowWidth } = useWindowSize();

  // MARK: return

  return (
    <>
      {windowWidth < 769 && <MenuBar />}
      {windowWidth > 768 && <MenuBarLarge />}

      <div className="py-12 max-sm:mt-5 sm:mt-8">
        <div className="mx-auto max-w-[900px] sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow-sm sm:rounded-lg ">
            <div className="min-h-[80vh] border-b border-gray-200  bg-white p-6 dark:bg-slate-700">
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
                <div className="mb-4 mt-10">
                  <label
                    htmlFor="title"
                    className="text-xl text-gray-700 dark:text-gray-200"
                  >
                    Title{" "}
                    <span className="text-red-500 dark:text-red-300">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={170}
                    className="py focus:shadow-outline box-border  h-10 w-full appearance-none rounded  border border-[#461c5f] bg-gray-200 px-2 text-sm leading-tight text-gray-700 focus:border-blue-300 focus:outline-none dark:border-slate-400 dark:bg-gray-800 dark:text-gray-200"
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
                    className="text-xl text-gray-700 dark:text-gray-200"
                  >
                    Description{" "}
                  </label>
                  <TextareaAutosize
                    maxLength={370}
                    minRows={2}
                    className="py focus:shadow-outline box-border w-full resize-none appearance-none rounded border border-[#461c5f] bg-gray-200 px-2 text-sm leading-tight text-gray-700 focus:border-blue-300 focus:outline-none dark:border-slate-400 dark:bg-gray-800 dark:text-gray-200"
                    name="description"
                    onInput={handleCommentChange}
                    value={formData.description}
                  />
                  <span className="text-sm text-gray-400">{`${formData.description.length}/370`}</span>
                  <br />
                  <span className="text-red-600 max-sm:text-xs sm:text-sm dark:text-red-300">
                    {errors.description}
                  </span>
                </div>

                <div className="mb-8">
                  <label className="text-xl text-gray-700 dark:text-gray-200">
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
													editor.ui.componentFactory.names() // display available list of toolbar editor
												);
												console.log(toolbarItems.sort()); */
                    }}
                  />
                  <span className="text-sm text-gray-400">{`${formData.post.length}/100000`}</span>
                  <br />
                  <span className="text-red-600 max-sm:text-xs sm:text-sm dark:text-red-300">
                    {errors.post}
                  </span>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="file"
                    className="text-xl text-gray-700 dark:text-gray-200"
                  >
                    Image
                  </label>
                  <span className="text-red-500 dark:text-red-300">*</span>
                  <input
                    type="file"
                    className="stroke w-[98%] bg-slate-300 p-2 font-bold text-slate-600 max-sm:pr-0 dark:bg-slate-600 dark:text-slate-300"
                    name="file"
                    onChange={handleInputChange}
                  />
                  <span className="text-red-600 max-sm:text-xs sm:text-sm dark:text-red-300">
                    {errors.file}
                  </span>
                </div>

                <div className="mt-10 flex w-full gap-5">
                  <div className="w-1/2">
                    <button
                      role="submit"
                      className="py mx-auto h-10 w-full cursor-pointer rounded border border-[#461c5f] bg-purple-600 text-sm font-semibold text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
                    >
                      Submit
                    </button>
                  </div>

                  <div className="w-1/2">
                    <button
                      onClick={() => navigate("/")}
                      className="py mx-auto h-10 w-full cursor-pointer rounded border-none bg-white px-2 text-sm font-semibold text-slate-500 ring-1 ring-slate-400 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
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
