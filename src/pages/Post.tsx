import { Link, useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CommentsBox from "../components/CommentsBox";
import { onePostType } from "../types/types";
import he from "he"; // decodes mongodb encoded HTML
import { useState, useEffect, useRef } from "react";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Badge from "@mui/material/Badge";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { red, grey } from "@mui/material/colors";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../app/store";
import { switchPrivilege } from "../utils/privilegeSlice";
import { RootState } from "../app/rootReducer";
import axios, { AxiosError } from "axios";
import { deletePost } from "../utils/postsSlice";
import useWindowSize from "../hooks/windowSize";
import dynamicStyles from "../utils/dynamicStyles";

const theme = createTheme({
  palette: {
    primary: {
      main: red[500],
    },
    secondary: {
      main: grey[900],
    },
    info: {
      main: grey[50],
    },
  },
});

type photoType = {
  filename: string;
  originalname: string;
  mimetype: string;
  path: string;
  size: number;
};

export type commentType = {
  _id: string;
  comment: string;
  author: string;
  date: string;
  email: string;
  name: string;
  post: string;
  photo: photoType | null;
  __v: number;
};

function Post({ server }: { server: string }) {
  const dispatch: AppDispatch = useDispatch();
  const member = useSelector((state: RootState) => state.privilege);
  const initialPost = null as unknown as onePostType;
  const [post, setPost] = useState<onePostType>(initialPost);
  const [originalPost, setOriginalPost] = useState<onePostType>(initialPost);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [commentsBoxOptionsVisibility, setCommentsBoxOptionsVisibility] =
    useState(""); // "" / "none"
  const [commentToEdit, setCommentToEdit] = useState<commentType>({
    _id: "",
    comment: "",
    author: "",
    name: "",
    email: "",
    date: "",
    post: "",
    photo: null,
    __v: 0,
  });

  function manageCommentsBoxOptionsVisibility(v: string) {
    setCommentsBoxOptionsVisibility(v);
  }

  // keep comments array updated to avoid unnecessary API calls
  function addComment(arg: commentType) {
    // Change array's order to show the most recent one on the top
    if (post) {
      setPost({ ...post, comments: [arg, ...post.comments] });
    }
  }

  // this method is more effective than useRef for scrolling into view
  // though is less React friendly
  function ScrollTo(v: string) {
    const commentsSection = document.getElementById("comments-box");
    const postsSection = document.getElementById("post-header");
    if (commentsSection && postsSection) {
      window.scrollTo({
        top:
          v === "comments"
            ? commentsSection?.offsetTop
            : postsSection?.offsetTop,
        behavior: "smooth",
      });
    }
  }

  type userType = {
    email: string;
    exp: number;
    first_name: string;
    iat: number;
    last_name: string;
    username: string;
    __v: number;
    _id: string;
  };

  const [user, setUser] = useState<userType>({} as userType);

  // MARK: fetch post
  useEffect(() => {
    // position the scroll at the top of the page
    window.scrollTo(0, 0);

    (async function fetchPost() {
      const url = window.location.href;
      const urlId = url.split("/")[5];
      const jwtToken = localStorage.getItem("accessToken");
      const headers: Record<string, string> = {};
      if (jwtToken) {
        headers["Authorization"] = `Bearer ${jwtToken}`;
      }
      try {
        const url = `${server}user/posts/${urlId}`;
        const response = await axios.get(url, {
          headers: headers,
        });

        dispatch(switchPrivilege("admin"));
        setUser(response.data.user);
        // this is the original post and will be needed to edit it
        setOriginalPost(response.data.post);
        // the following post is subject to change due to admins's color scheme preferences
        dynamicStyles(response.data.post, setPost);
        setCommentToEdit({ ...commentToEdit, post: response.data.post._id });
      } catch (error) {
        const axiosError = error as AxiosError;

        if (
          axiosError?.response?.status === 403 ||
          axiosError?.response?.status === 401
        ) {
          type userPostType = { post: onePostType };
          const userData = axiosError?.response?.data as userPostType;
          dispatch(switchPrivilege("user"));
          setOriginalPost(userData.post);
          dynamicStyles(userData.post, setPost);
        } else {
          navigate("/server-error");
        }
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // MARK: Edit post
  // Redirect admin to the post's edition page
  function EditPost(postToEdit: onePostType) {
    const postWithFormattedComments = {
      ...postToEdit,
      comments: postToEdit?.comments?.map((comment) => {
        return comment._id;
      }),
    };
    // console.log(postWithFormattedComments);
    navigate(`/posts/update/${postToEdit?._id}`, {
      state: postWithFormattedComments,
    });
  }
  // MARK: Delete post
  const handleDeletePost = async (postId: string) => {
    const API_URL = `${server}user/posts`;
    // get security token
    const jwtToken = localStorage.getItem("accessToken");
    const headers: Record<string, string> = {};
    if (jwtToken) {
      headers["Authorization"] = `Bearer ${jwtToken}`;
    }
    try {
      const response = await axios.delete(`${API_URL}/${postId}`, {
        headers: headers,
      });

      dispatch(deletePost(response.data.post._id)); // update global state
      navigate("/posts");
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
  };

  const commentsOptionsParentRef = useRef(
    Array(post?.comments?.length).fill(null),
  );
  const deleteRef = useRef(Array(post?.comments?.length).fill(null));
  const editRef = useRef(Array(post?.comments?.length).fill(null));

  const handleDeletion = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;
    deleteRef.current.forEach((el) => {
      if (el && el.contains(target)) {
        deleteComment(el.dataset.deleteid);
      }
    });
  };
  const handleEdition = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;

    editRef.current.forEach((el) => {
      if (el && el.contains(target)) {
        editComment(el.dataset.editid);
      }
    });
  };

  function hideCommentsOptions(e: React.MouseEvent<HTMLButtonElement>) {
    const target = e.target as HTMLButtonElement;

    if (target?.parentElement?.dataset) {
      let optionsParent = null;
      const dataset = target.parentElement.dataset;
      if (dataset.testid) {
        optionsParent = target.parentElement?.parentElement?.parentElement;
      } else if (dataset.deleteid || dataset.editid) {
        optionsParent = target.parentElement?.parentElement;
      } else {
        optionsParent = target.parentElement;
      }

      if (optionsParent) {
        commentsOptionsParentRef.current.forEach((el) => {
          if (el && el.contains(optionsParent)) {
            el.style.display = "none";
          }
        });
      }
    }
  }

  // MARK: edit comment
  function editComment(commentId: string) {
    manageCommentsBoxOptionsVisibility("");
    const selectedComment = post.comments.filter(
      (comment) => comment._id === commentId,
    )[0];
    setIsEditing(true);
    setCommentToEdit({
      ...selectedComment,
      comment: he.decode(selectedComment.comment),
    });

    /* Scroll to comments box */
    const commentsBoxSection = document.getElementById("edit-comment-box");
    window.scrollTo({
      top: commentsBoxSection?.offsetTop,
      behavior: "smooth",
    });
  }

  // MARK: delete comment
  async function deleteComment(commentId: string) {
    const apiUrl = `${server}user/comments/${commentId}`;
    try {
      const jwtToken = localStorage.getItem("accessToken");
      const headers: Record<string, string> = {};
      if (jwtToken) {
        headers["Authorization"] = `Bearer ${jwtToken}`;
      }
      const response = await axios.delete(apiUrl, {
        headers: headers,
      });
      setPost(response.data.post);
    } catch (error) {
      const axiosError = error as AxiosError;

      if (
        axiosError?.response?.status === 403 ||
        axiosError?.response?.status === 401
      ) {
        navigate("/log-in");
      } else {
        navigate("/server-error");
      }
    }
  }

  const { windowWidth } = useWindowSize();

  // MARK: return
  return (
    <div className="min-h-screen bg-slate-100 lg:w-[94.5%] dark:bg-slate-950">
      <div className="flex gap-4 px-4 pb-4 max-lg:pt-14 lg:pt-4">
        <ThemeProvider theme={theme}>
          <div
            className={
              windowWidth > 1023
                ? "fixed right-5 flex h-screen w-fit flex-col gap-8 pt-10"
                : "toolbarBorder fixed bottom-0 left-0 z-50 flex w-screen justify-around bg-white p-2 shadow-[0px_-0.5px_5px_rgb(148,163,184)] dark:bg-slate-800 dark:shadow-none"
            }
          >
            <div>
              <IconButton onClick={() => ScrollTo("comments")}>
                <Badge badgeContent={post?.comments?.length} color="primary">
                  <ForumOutlinedIcon
                    className="icons"
                    fontSize="medium"
                    color="secondary"
                    titleAccess="Comments"
                  />
                </Badge>
              </IconButton>
            </div>
            {post && member === "admin" && (
              <div>
                <IconButton onClick={() => EditPost(originalPost)}>
                  <EditIcon
                    className="icons"
                    fontSize="medium"
                    color="secondary"
                    titleAccess="Edit post"
                  />
                </IconButton>
              </div>
            )}
            {post && member === "admin" && (
              <div>
                <IconButton onClick={() => handleDeletePost(post._id)}>
                  <DeleteIcon
                    className="icons"
                    fontSize="medium"
                    color="secondary"
                    titleAccess="Delete post"
                  />
                </IconButton>
              </div>
            )}
            <div>
              <IconButton onClick={() => ScrollTo("posts")}>
                <KeyboardArrowUpIcon
                  className="icons"
                  fontSize="medium"
                  color="secondary"
                  titleAccess="Back to top"
                />
              </IconButton>
            </div>
          </div>
        </ThemeProvider>

        <article className="w-full rounded-lg border border-solid border-slate-200 bg-white pb-3 dark:border-slate-950 dark:bg-slate-800">
          {/* MARK: Post's header */}
          <header id="post-header">
            <div
              className="relative mx-auto w-full md:mb-0"
              style={{ height: "24em" }}
            >
              <div
                className="absolute bottom-0 left-0 z-10 h-full w-full"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg,transparent,rgba(0,0,0,.7))",
                }}
              ></div>

              <img
                src={`${server}${post?.file?.path}`}
                className="absolute left-0 top-0 h-full w-full rounded-t-lg object-cover"
              />
              {/* skeleton image */}
              {!post && (
                <div className="bg-custom-animation-1 absolute left-0 top-0 h-full w-full rounded-lg object-cover"></div>
              )}

              <div className="absolute bottom-0 left-0 z-20 p-4">
                <h2 className="except font-semibold leading-tight text-gray-100 sm:text-3xl">
                  {post?.title && he.decode(post.title)}
                </h2>
                <div className="mt-4 flex">
                  <div>
                    <p className="font-semibold text-gray-200">
                      {" "}
                      {post?.author && he.decode(post?.author)}{" "}
                    </p>
                    <p className="text-gray-400">
                      {" "}
                      {post?.date && he.decode(post?.date)}{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>
          {/* MARK: Post's content */}

          {post?.post && (
            <div
              className="prose mx-auto max-w-screen-md border-b-[0.5px] border-l-0 border-r-0 border-t-0 border-solid border-slate-200 p-4 sm:mt-4 md:mt-8 dark:border-slate-600 dark:text-white"
              dangerouslySetInnerHTML={{
                __html: he.decode(post.post), // renders decoded HTML
              }}
            />
          )}

          {/* Skeleton post */}
          {!post && (
            <div className="mx-auto max-w-screen-md animate-pulse border-b-[0.5px] border-l-0 border-r-0 border-t-0 border-solid border-slate-200 p-5 sm:mt-5 md:mt-8">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={`skeleton-card-${i}`}>
                  <div
                    key={`fake-title-${i}`}
                    className="mt-6 h-7 w-1/2 rounded-full bg-slate-600"
                  />
                  {Array.from({ length: 7 }).map((_, index) => (
                    <div
                      key={`fake-text${i}-${index}`}
                      className="mt-3 h-4 w-11/12 rounded-full bg-slate-500"
                    />
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Comment's box */}
          {member === "admin" && post?.post && (
            <CommentsBox
              server={server}
              commentsOptionsParentRef={commentsOptionsParentRef}
              formData={commentToEdit}
              commentsBoxOptionsVisibility={commentsBoxOptionsVisibility}
              manageCommentsBoxOptionsVisibility={
                manageCommentsBoxOptionsVisibility
              }
              setFormData={setCommentToEdit}
              setIsEditing={setIsEditing}
              isEditing={isEditing}
              addComment={addComment}
              setPost={setPost}
              post_id={`${post._id}`}
            />
          )}
          <div id="comments-box" className="mx-auto mt-10 max-w-screen-md">
            {post?.comments?.length > 0 && (
              <div className="mx-auto mb-12 mt-10 text-center">
                <h2>Comments</h2>
              </div>
            )}

            {member === "user" && (
              <div className="mx-auto w-11/12 pb-10 pl-5 pr-5 pt-10 text-slate-600 dark:text-slate-300">
                If you want to leave a comment{" "}
                <Link
                  className="font-bold text-blue-800 no-underline dark:text-white"
                  to="/log-in"
                >
                  Log in
                </Link>
              </div>
            )}
            {/* MARK: Comments */}
            {post?.comments?.map((comment, index) => (
              <div
                key={comment._id}
                className="mx-auto mb-8 box-border flex max-h-[1600px] w-11/12 gap-4 truncate rounded-lg border border-solid border-slate-300 p-5 max-md:flex-col max-md:gap-2 dark:border-slate-600"
              >
                <div>
                  <img
                    className="rounded-full ring-1 ring-blue-400 dark:ring-blue-500"
                    src={
                      comment.photo === undefined || comment.photo === null
                        ? "/images/profile-pic-placeholder.webp"
                        : `${server}${comment.photo.path}`
                    }
                    width={35}
                    height={35}
                    alt="profile picture"
                  />
                </div>
                <div className="w-11/12 max-md:space-y-8">
                  <div>
                    <div className="relative mb-5 flex h-5 flex-col items-start md:flex-row md:gap-2">
                      <div className="text-sm font-bold text-slate-500 dark:text-slate-300">
                        {comment.name}
                      </div>
                      <div className="relative bottom-6 text-slate-400 max-md:hidden md:text-xl dark:text-slate-200">
                        .
                      </div>
                      <div className="text-slate-500 max-md:text-[0.70rem] max-md:leading-[1.390] md:self-center md:text-[0.80rem] md:leading-snug dark:text-slate-300">
                        {comment.date}
                      </div>
                      {member === "admin" && (
                        <div
                          ref={(el) =>
                            (commentsOptionsParentRef.current[index] = el)
                          }
                          data-comment-options-parent={comment._id}
                          className="absolute right-[-15px] top-[-15px] flex flex-row-reverse max-md:right-[-35px] max-md:top-[-50px]"
                        >
                          <IconButton
                            className="icons"
                            ref={(el) => (deleteRef.current[index] = el)}
                            data-deleteid={comment._id}
                            data-author={comment.author}
                            onClick={(e) => {
                              hideCommentsOptions(e);
                              handleDeletion(e);
                            }}
                            title="Delete comment"
                          >
                            <DeleteIcon
                              sx={{ opacity: 0.7 }}
                              fontSize="small"
                            />
                          </IconButton>
                          {comment.author === user._id && (
                            <IconButton
                              className="icons"
                              ref={(el) => (editRef.current[index] = el)}
                              data-editid={comment._id}
                              data-author={comment.author}
                              onClick={(e) => {
                                hideCommentsOptions(e);
                                handleEdition(e);
                              }}
                              title="Edit comment"
                            >
                              <EditIcon
                                sx={{ opacity: 0.7 }}
                                fontSize="small"
                              />
                            </IconButton>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-full truncate text-pretty text-sm dark:text-slate-100">
                    {/* Converts avery \n into a paragraph */}
                    {comment.comment
                      .split("\n")
                      .map((line, i) =>
                        line === "" ? (
                          <br key={`${comment._id}${i}`} />
                        ) : (
                          <p key={`${comment._id}${i}`}>{he.decode(line)}</p>
                        ),
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

export default Post;
