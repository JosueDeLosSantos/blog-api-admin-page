import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import codeImage from "../../public/images/safar-safarov-koOdUvfGr4c-unsplash.jpg";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import { switchPrivilege } from "./posts/privilegeSlice";

function LogIn() {
  const dispatch: AppDispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const navigate = useNavigate(); // Utilize the useNavigate hook for programmatic navigation

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const [credentials, setCredentials] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    // http://localhost:3000/
    // https://dummy-blog.adaptable.app/user/log-in
    const apiUrl = "http://localhost:3000/user/admin/log-in";
    try {
      const response = await axios.post(apiUrl, formData);

      if (response.data.accessToken) {
        localStorage.setItem("accessToken", `${response.data.accessToken}`);
        dispatch(switchPrivilege("admin"));
        navigate("/"); // Redirect to desired page after successful login
      } else {
        if (response.data.errors) {
          const newErrors = { username: "", password: "" };
          while (response.data.errors.length > 0) {
            const error = response.data.errors.shift();
            switch (error.path) {
              case "username":
                newErrors.username = error.msg;
                break;
              case "password":
                newErrors.password = error.msg;
                break;

              default:
                break;
            }
          }
          setErrors(newErrors);
          if (credentials !== "") {
            setCredentials("");
          }
        }
        if (response.data.message) {
          setCredentials(response.data.message);
          setErrors({ username: "", password: "" });
        }
      }
    } catch (error) {
      navigate("/server-error");
    }
  }

  return (
    <div className="container mx-auto mt-16 flex h-full max-w-md overflow-hidden rounded-lg bg-white shadow xl:max-w-3xl dark:bg-slate-700">
      <div className="relative hidden h-full xl:block xl:w-1/2">
        <img
          className="absolute h-auto w-full object-cover"
          src={codeImage}
          alt="image of computers displaying code lines"
        />
      </div>
      <div className="w-full p-8 xl:w-1/2">
        <h1 className="mb-10 text-center font-PressStart2P text-xl ">
          <Link
            className="logo text-[#721ea3] no-underline visited:text-[#540d7d] hover:text-[#721ea3]"
            to="../"
          >
            {"<JCODER>"}
          </Link>
        </h1>
        <form onSubmit={onSubmit}>
          <h1 className="text-2xl font-bold">Sign in to your account</h1>
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Don't have an account?
            </span>{" "}
            <span className="text-sm font-semibold">
              <Link
                className="text-[#721ea3] visited:text-[#540d7d] hover:text-[#721ea3] dark:text-purple-200 dark:visited:text-purple-300 dark:hover:text-purple-100"
                to="../sign-up"
              >
                Sign up
              </Link>
            </span>
          </div>
          <div className="mb-4 mt-6 box-border w-full">
            <label
              className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="py focus:shadow-outline box-border  h-10 w-full appearance-none rounded  border border-[#461c5f] bg-gray-200 px-2 text-sm leading-tight text-gray-700 focus:border-blue-300 focus:outline-none dark:border-slate-400 dark:bg-gray-800 dark:text-gray-200"
              name="username"
              type="text"
              placeholder="Your username"
              onInput={handleInputChange}
              value={formData.username}
              required
            />
            <span className="text-red-600 max-sm:text-xs sm:text-sm dark:text-red-300">
              {errors.username}
            </span>
          </div>
          <div className="mb-6 mt-6 box-border w-full">
            <label
              className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="py focus:shadow-outline box-border  h-10 w-full appearance-none rounded  border border-[#461c5f] bg-gray-200 px-2 text-sm leading-tight text-gray-700 focus:border-blue-300 focus:outline-none dark:border-slate-400 dark:bg-gray-800 dark:text-gray-200"
              name="password"
              type="password"
              placeholder="Your password"
              onInput={handleInputChange}
              value={formData.password}
              required
            />
            <span className="text-red-600 max-sm:text-xs sm:text-sm dark:text-red-300">
              {errors.password}
            </span>
          </div>

          <div className="text-red-600 max-sm:text-xs sm:text-sm dark:text-red-300">
            <span>{credentials}</span>
          </div>

          <div className="mt-8 flex w-full">
            <button
              className="py h-10 w-full rounded border border-[#461c5f] bg-[#721ea3] px-2 text-sm font-semibold text-white hover:bg-[#540d7d] dark:bg-purple-500 dark:hover:bg-purple-600"
              type="submit"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LogIn;
