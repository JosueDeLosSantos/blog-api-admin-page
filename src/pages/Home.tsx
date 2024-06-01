import { useNavigate } from "react-router-dom";
import MenuBar from "../components/MenuBar";
import MenuBarLarge from "../components/MenuBarLarge";
import useWindowSize from "../hooks/windowSize";

function Home() {
  const { windowWidth } = useWindowSize();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-slate-100 dark:bg-slate-950">
      {windowWidth < 769 && <MenuBar />}
      {windowWidth > 768 && <MenuBarLarge />}
      <main>
        <div className="relative mx-auto h-screen max-h-screen w-full max-w-[1536px] overflow-hidden">
          <div className="bg-custom-animation z-0 grid w-full grid-cols-[repeat(11,_minmax(0,_1fr))] opacity-5 sm:grid-cols-[repeat(15,_minmax(0,_1fr))] lg:grid-cols-[repeat(19,_minmax(0,_1fr))]">
            {Array.from({ length: 800 }).map((_, index) => (
              <div className="text-3xl sm:text-5xl lg:text-8xl " key={index}>
                {index % 2 === 0 ? 0 : 1}
              </div>
            ))}
          </div>
          <div className="roboto-medium absolute left-[50%] top-[40%] z-10 w-[70%] translate-x-[-50%] translate-y-[-50%] space-y-14 rounded-lg border border-slate-200 bg-white p-10 sm:w-1/2 lg:space-y-28 dark:border-slate-900 dark:bg-slate-800">
            <div className="text-center text-2xl tracking-wide sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              <h1>The experiences of a programmer in pursuit of his dreams</h1>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => navigate("/posts")}
                className="md:text-md w-fit cursor-pointer rounded border border-[#461c5f] bg-[#721ea3] px-5 py-2 text-sm text-slate-100 hover:bg-[#540d7d] lg:text-xl xl:text-2xl dark:bg-purple-500 dark:hover:bg-purple-600"
                type="button"
              >
                Read Posts
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
