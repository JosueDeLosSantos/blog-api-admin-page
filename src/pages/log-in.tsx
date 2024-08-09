import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import codeImage from "/images/safar-safarov-koOdUvfGr4c-unsplash.jpg";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import { switchPrivilege } from "../utils/privilegeSlice";

function LogIn({ server }: { server: string }) {
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

    const apiUrl = `${server}user/admin/log-in`;
    try {
      const response = await axios.post(apiUrl, formData);

      if (response.data.accessToken) {
        localStorage.setItem("accessToken", `${response.data.accessToken}`);
        dispatch(switchPrivilege("admin"));
        navigate("/posts"); // Redirect to desired page after successful login
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

  // MARK: return

  return (
    <div className="container mx-auto flex max-w-md overflow-hidden rounded-lg bg-white shadow max-[500px]:h-[100vh] min-[500px]:absolute min-[500px]:left-[50%] min-[500px]:top-[50%] min-[500px]:translate-x-[-50%] min-[500px]:translate-y-[-70%] xl:max-w-3xl dark:bg-slate-800">
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
            className="logo text-lg text-purple-600 no-underline visited:text-purple-700 hover:text-purple-500 dark:text-purple-300 dark:visited:text-purple-400 dark:hover:text-purple-500"
            to="../"
          >
            {"<JCODER>"}
          </Link>
        </h1>
        <form onSubmit={onSubmit}>
          <h1 className="text-lg font-bold">Sign in to your account</h1>
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Don't have an account?
            </span>{" "}
            <span className="text-sm font-semibold">
              <Link
                className="logo font-bold text-purple-600 visited:text-purple-700 hover:text-purple-500 dark:text-purple-300 dark:visited:text-purple-400 dark:hover:text-purple-500"
                to="../sign-up"
              >
                Sign up
              </Link>
            </span>
          </div>
          <div className="mb-4 mt-6 box-border w-full">
            <label
              className="mb-2 block text-base font-semibold text-gray-700 dark:text-gray-200"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="py focus:shadow-outline mb-1 box-border h-10  w-full cursor-pointer appearance-none rounded  border border-slate-400 bg-gray-100 px-2 leading-tight text-gray-700 focus:border-blue-500 focus:outline-none dark:border-slate-500 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-blue-400"
              name="username"
              type="text"
              placeholder="Your username"
              onInput={handleInputChange}
              value={formData.username}
              maxLength={80}
              required
            />
            <span className="max-sm:text-xs text-red-600 sm:text-sm dark:text-red-300">
              {errors.username}
            </span>
          </div>
          <div className="mb-6 mt-6 box-border w-full">
            <label
              className="mb-2 block text-base font-semibold text-gray-700 dark:text-gray-200"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="py focus:shadow-outline mb-1 box-border h-10 w-full cursor-pointer appearance-none rounded  border border-slate-400 bg-gray-100 px-2 leading-tight text-gray-700 focus:border-blue-500 focus:outline-none dark:border-slate-500 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-blue-400"
              name="password"
              type="password"
              placeholder="Your password"
              onInput={handleInputChange}
              value={formData.password}
              maxLength={70}
              required
            />
            <span className="max-sm:text-xs text-red-600 sm:text-sm dark:text-red-300">
              {errors.password}
            </span>
          </div>

          <div className="max-sm:text-xs text-red-600 sm:text-sm dark:text-red-300">
            <span>{credentials}</span>
          </div>

          <div className="mt-8 flex w-full">
            <button
              className="h-10 w-full cursor-pointer rounded border border-purple-700 bg-purple-600 px-2 py-1 text-sm font-semibold text-white hover:bg-purple-500 dark:bg-purple-500 dark:hover:bg-purple-600"
              type="submit"
            >
              Sign in
            </button>
          </div>
          <div className="mt-5 flex w-full">
            <button
              onClick={() => navigate("/posts")}
              className="py h-10 w-full cursor-pointer rounded border-none bg-white px-2 text-sm font-semibold text-slate-500 ring-1 ring-slate-400 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              type="button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LogIn;
