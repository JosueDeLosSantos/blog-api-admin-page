import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios, { AxiosError } from "axios";

function SignUp() {
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
    // http://localhost:3000/user/sign-up
    //https://dummy-blog.adaptable.app/user/sign-up
    const apiUrl = "http://localhost:3000/user/admin/sign-up";
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
    <div className="container mx-auto mt-14 flex h-full max-w-md overflow-hidden rounded-lg bg-white shadow dark:bg-slate-700">
      <div className="w-full p-8">
        <h1 className="mb-10 text-center font-PressStart2P text-xl">
          <Link
            className="logo text-[#721ea3] no-underline visited:text-[#540d7d] hover:text-[#721ea3]"
            to="../"
          >
            {"<JCODER>"}
          </Link>
        </h1>
        <form onSubmit={onSubmit} className="mt-10">
          <h1 className="text-2xl font-bold">Sign up to create an account</h1>

          <div>
            <span className="text-red-600 max-sm:text-xs sm:text-sm dark:text-red-300">
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
              className="py focus:shadow-outline box-border h-10 w-full cursor-pointer appearance-none rounded  border border-[#461c5f] bg-gray-200 px-2 text-sm leading-tight text-gray-700 focus:border-blue-300 focus:outline-none dark:border-slate-400 dark:bg-gray-800 dark:text-gray-200"
              name="first_name"
              type="text"
              placeholder="Your first name"
              onInput={handleInputChange}
              value={formData.first_name}
            />
            <span className="text-red-600 max-sm:text-xs sm:text-sm dark:text-red-300">
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
              className="py focus:shadow-outline box-border h-10  w-full cursor-pointer appearance-none rounded  border border-[#461c5f] bg-gray-200 px-2 text-sm leading-tight text-gray-700 focus:border-blue-300 focus:outline-none dark:border-slate-400 dark:bg-gray-800 dark:text-gray-200"
              name="last_name"
              type="text"
              placeholder="Your last name"
              onInput={handleInputChange}
              value={formData.last_name}
            />
            <span className="text-red-600 max-sm:text-xs sm:text-sm dark:text-red-300">
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
              className="py focus:shadow-outline box-border h-10  w-full cursor-pointer appearance-none rounded  border border-[#461c5f] bg-gray-200 px-2 text-sm leading-tight text-gray-700 focus:border-blue-300 focus:outline-none dark:border-slate-400 dark:bg-gray-800 dark:text-gray-200"
              name="email"
              type="text"
              placeholder="Your email address"
              onInput={handleInputChange}
              value={formData.email}
            />
            <span className="text-red-600 max-sm:text-xs sm:text-sm dark:text-red-300">
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
              className="py focus:shadow-outline box-border h-10  w-full cursor-pointer appearance-none rounded  border border-[#461c5f] bg-gray-200 px-2 text-sm leading-tight text-gray-700 focus:border-blue-300 focus:outline-none dark:border-slate-400 dark:bg-gray-800 dark:text-gray-200"
              name="username"
              type="text"
              placeholder="Your username"
              onInput={handleInputChange}
              value={formData.username}
            />
            <span className="text-red-600 max-sm:text-xs sm:text-sm dark:text-red-300">
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
              className="py focus:shadow-outline mb-1 box-border h-10  w-full cursor-pointer appearance-none rounded  border border-[#461c5f] bg-gray-200 px-2 text-sm leading-tight text-gray-700 focus:border-blue-300 focus:outline-none dark:border-slate-400 dark:bg-gray-800 dark:text-gray-200"
              name="password"
              type="password"
              placeholder="Your password"
              onInput={handleInputChange}
              value={formData.password}
            />
            <span className="text-red-600 max-sm:text-xs sm:text-sm dark:text-red-300">
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
              className="py focus:shadow-outline mb-1 box-border h-10  w-full cursor-pointer appearance-none rounded  border border-[#461c5f] bg-gray-200 px-2 text-sm leading-tight text-gray-700 focus:border-blue-300 focus:outline-none dark:border-slate-400 dark:bg-gray-800 dark:text-gray-200"
              name="passwordConfirmation"
              type="password"
              placeholder="Confirm your password"
              onInput={handleInputChange}
              value={formData.passwordConfirmation}
            />
            <span className="text-red-600 max-sm:text-xs sm:text-sm dark:text-red-300">
              {errors.passwordConfirmation}
            </span>
          </div>

          <div className="mt-8 flex w-full">
            <button
              className="h-10 w-full cursor-pointer rounded border border-[#461c5f] bg-[#721ea3] px-2 py-2 text-sm font-semibold text-slate-100 hover:bg-[#540d7d] dark:bg-purple-500 dark:hover:bg-purple-600"
              type="submit"
            >
              Sign up
            </button>
          </div>

          <div className="mt-5 flex w-full">
            <button
              onClick={() => navigate("/")}
              className="py h-10 w-full cursor-pointer rounded border-none bg-white px-2 text-sm font-semibold text-slate-500 ring-1 ring-slate-400 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
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
