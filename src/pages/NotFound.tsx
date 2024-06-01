import { Link } from "react-router-dom";

function NotFound() {
  return (
    <>
      <div>
        <div className="mt-[25vh] text-center">
          <h1 className="text-4xl font-medium sm:text-7xl">404</h1>
          <p className="m-6 text-xl font-medium sm:text-3xl">
            Sorry, the page you're looking for can't be found.
          </p>

          <Link
            to="/"
            className="rounded bg-slate-800 px-4 py-2 text-white no-underline hover:bg-slate-700 sm:text-2xl"
          >
            Go Home
          </Link>
        </div>
      </div>
    </>
  );
}

export default NotFound;
