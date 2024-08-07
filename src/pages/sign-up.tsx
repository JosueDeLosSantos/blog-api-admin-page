import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios, { AxiosError } from "axios";

function SignUp({ server }: { server: string }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    passwordConfirmation: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const [Unauthorized, setUnauthorized] = useState("");

  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    passwordConfirmation: "",
  });
  // MARK: onSubmit
  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const apiUrl = `${server}user/admin/sign-up`;
    try {
      const response = await axios.post(apiUrl, formData);

      if (response.data.errors) {
        /* fix form's error management */
        const newErrors = {
          first_name: "",
          last_name: "",
          email: "",
          username: "",
          password: "",
          passwordConfirmation: "",
        };
        while (response.data.errors.length > 0) {
          const error = response.data.errors.shift();
          switch (error.path) {
            case "first_name":
              newErrors.first_name = error.msg;
              break;
            case "last_name":
              newErrors.last_name = error.msg;
              break;
            case "email":
              newErrors.email = error.msg;
              break;
            case "username":
              newErrors.username = error.msg;
              break;
            case "password":
              newErrors.password = error.msg;
              break;
            case "passwordConfirmation":
              newErrors.passwordConfirmation = error.msg;
              break;
            default:
              break;
          }
        }
        setErrors(newErrors);
      } else {
        navigate("/log-in");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        type notAutorized = { message: string };
        const errorResponse = axiosError.response.data as notAutorized;
        setUnauthorized(errorResponse.message);
        setErrors({
          first_name: "",
          last_name: "",
          email: "",
          username: "",
          password: "",
          passwordConfirmation: "",
        });
      } else {
        navigate("/server-error");
      }
    }
  }
  // MARK: return
  return (
    <div className="container mx-auto flex max-w-md overflow-hidden rounded-lg bg-white shadow sm:mt-10 dark:bg-slate-800">
      <div className="w-full p-8">
        <h1 className="mb-10 text-center font-PressStart2P text-xl">
          <Link
            className="logo text-lg text-purple-600 no-underline visited:text-purple-700 hover:text-purple-500 dark:text-purple-300 dark:visited:text-purple-400 dark:hover:text-purple-500"
            to="../"
          >
            {"<JCODER>"}
          </Link>
        </h1>
        <form onSubmit={onSubmit} className="mt-10">
          <h1 className="text-lg font-bold">Sign up to create an account</h1>

          <div>
            <span className="max-sm:text-xs text-red-600 sm:text-sm dark:text-red-300">
              {Unauthorized}
            </span>
          </div>

          <div className="mb-4 mt-6">
            <label
              className="mb-2 block text-base font-semibold text-gray-700 dark:text-gray-200"
              htmlFor="first_name"
            >
              First Name
            </label>
            <input
              className="py focus:shadow-outline mb-1 box-border h-10  w-full cursor-pointer appearance-none rounded  border border-slate-400 bg-gray-100 px-2 text-sm leading-tight text-gray-700 focus:border-blue-500 focus:outline-none dark:border-slate-500 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-blue-400"
              name="first_name"
              type="text"
              placeholder="Your first name"
              onInput={handleInputChange}
              value={formData.first_name}
              maxLength={40}
            />
            <span className="max-sm:text-xs text-red-600 sm:text-sm dark:text-red-300">
              {errors.first_name}
            </span>
          </div>
          <div className="mb-4 mt-6">
            <label
              className="mb-2 block text-base font-semibold text-gray-700 dark:text-gray-200"
              htmlFor="last_name"
            >
              Last Name
            </label>
            <input
              className="py focus:shadow-outline mb-1 box-border h-10  w-full cursor-pointer appearance-none rounded  border border-slate-400 bg-gray-100 px-2 text-sm leading-tight text-gray-700 focus:border-blue-500 focus:outline-none dark:border-slate-500 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-blue-400"
              name="last_name"
              type="text"
              placeholder="Your last name"
              onInput={handleInputChange}
              value={formData.last_name}
              maxLength={70}
            />
            <span className="max-sm:text-xs text-red-600 sm:text-sm dark:text-red-300">
              {errors.last_name}
            </span>
          </div>
          <div className="mb-4 mt-6">
            <label
              className="mb-2 block text-base font-semibold text-gray-700 dark:text-gray-200"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="py focus:shadow-outline mb-1 box-border h-10  w-full cursor-pointer appearance-none rounded  border border-slate-400 bg-gray-100 px-2 text-sm leading-tight text-gray-700 focus:border-blue-500 focus:outline-none dark:border-slate-500 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-blue-400"
              name="email"
              type="text"
              placeholder="Your email address"
              onInput={handleInputChange}
              value={formData.email}
              maxLength={120}
            />
            <span className="max-sm:text-xs text-red-600 sm:text-sm dark:text-red-300">
              {errors.email}
            </span>
          </div>
          <div className="mb-4 mt-6">
            <label
              className="mb-2 block text-base font-semibold text-gray-700 dark:text-gray-200"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="py focus:shadow-outline mb-1 box-border h-10  w-full cursor-pointer appearance-none rounded  border border-slate-400 bg-gray-100 px-2 text-sm leading-tight text-gray-700 focus:border-blue-500 focus:outline-none dark:border-slate-500 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-blue-400"
              name="username"
              type="text"
              placeholder="Your username"
              onInput={handleInputChange}
              value={formData.username}
              maxLength={80}
            />
            <span className="max-sm:text-xs text-red-600 sm:text-sm dark:text-red-300">
              {errors.username}
            </span>
          </div>
          <div className="mb-6 mt-6">
            <label
              className="mb-2 block text-base font-semibold text-gray-700 dark:text-gray-200"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="py focus:shadow-outline mb-1 box-border h-10  w-full cursor-pointer appearance-none rounded  border border-slate-400 bg-gray-100 px-2 text-sm leading-tight text-gray-700 focus:border-blue-500 focus:outline-none dark:border-slate-500 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-blue-400"
              name="password"
              type="password"
              placeholder="Your password"
              onInput={handleInputChange}
              value={formData.password}
              maxLength={70}
            />
            <span className="max-sm:text-xs text-red-600 sm:text-sm dark:text-red-300">
              {errors.password}
            </span>
          </div>
          <div className="mb-6 mt-6">
            <label
              className="mb-2 block text-base font-semibold text-gray-700 dark:text-gray-200"
              htmlFor="passwordConfirmation"
            >
              Confirm Password
            </label>
            <input
              className="py focus:shadow-outline mb-1 box-border h-10  w-full cursor-pointer appearance-none rounded  border border-slate-400 bg-gray-100 px-2 text-sm leading-tight text-gray-700 focus:border-blue-500 focus:outline-none dark:border-slate-500 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-blue-400"
              name="passwordConfirmation"
              type="password"
              placeholder="Confirm your password"
              onInput={handleInputChange}
              value={formData.passwordConfirmation}
              maxLength={70}
            />
            <span className="max-sm:text-xs text-red-600 sm:text-sm dark:text-red-300">
              {errors.passwordConfirmation}
            </span>
          </div>

          <div className="mt-8 flex w-full">
            <button
              className="h-10 w-full cursor-pointer rounded border border-purple-700 bg-purple-600 px-2 py-1 text-sm font-semibold text-white hover:bg-purple-500 dark:bg-purple-500 dark:hover:bg-purple-600"
              type="submit"
            >
              Sign up
            </button>
          </div>

          <div className="mt-5 flex w-full">
            <button
              onClick={() => navigate("/")}
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

export default SignUp;
