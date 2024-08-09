import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="relative mx-auto h-screen max-h-screen w-full max-w-[1536px] overflow-hidden">
      <div className="bg-custom-animation z-0 grid w-full grid-cols-[repeat(11,_minmax(0,_1fr))] opacity-5 sm:grid-cols-[repeat(15,_minmax(0,_1fr))] lg:grid-cols-[repeat(19,_minmax(0,_1fr))] dark:bg-black dark:text-slate-500">
        {Array.from({ length: 800 }).map((_, index) => (
          <div
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
            key={index}
          >
            {index % 2 === 0 ? 0 : 1}
          </div>
        ))}
      </div>
      <div className="roboto-medium absolute left-[50%] top-[40%] z-10 w-[70%] translate-x-[-50%] translate-y-[-50%] rounded-lg border border-slate-200 bg-white p-4 sm:w-1/2 dark:border-slate-900 dark:bg-slate-800">
        <div className="text-center text-lg tracking-wide sm:text-xl lg:text-2xl">
          <h1>Your Gateway to the Latest in Web Development Technologies.</h1>
        </div>
        <div className="mt-10 flex justify-center">
          <Link to="/posts">
            <button
              className="w-fit cursor-pointer rounded border border-purple-700 bg-purple-500 px-4 py-2 text-sm text-slate-100 hover:bg-purple-600 md:text-base"
              type="button"
            >
              Read Posts
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
