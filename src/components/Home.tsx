import MenuBar from "../features/MenuBar";
import MenuBarLarge from "../features/MenuBarLarge";
import useWindowSize from "../features/windowSize";

function Home() {
  const { windowWidth } = useWindowSize();

  return (
    <div className="min-h-screen w-full bg-slate-100 dark:bg-slate-950">
      {windowWidth < 769 && <MenuBar />}
      {windowWidth > 768 && <MenuBarLarge />}
      <main /* className="pt-28 lg:pt-32" */>
        <div className="relative mx-auto h-screen max-h-[1536px] w-full max-w-[1536px] overflow-hidden">
          <div className="bg-custom-animation z-0 grid w-full grid-cols-[repeat(11,_minmax(0,_1fr))] opacity-10 sm:grid-cols-[repeat(19,_minmax(0,_1fr))] md:grid-cols-[repeat(29,_minmax(0,_1fr))]">
            {Array.from({ length: 1000 }).map((_, index) => (
              <div className="text-2xl sm:text-5xl lg:text-8xl " key={index}>
                {index % 2 === 0 ? 0 : 1}
              </div>
            ))}
          </div>
          {/* <div className="roboto-bold absolute left-0 top-10 z-10 text-center text-5xl">
            <div>
              <h1>The experiences of a programmer in pursuit of his dreams</h1>
            </div>
            <div className="mx-auto mt-8 flex w-1/3">
              <button
                className="h-10 w-full cursor-pointer rounded border border-[#461c5f] bg-[#721ea3] px-2 py-2 text-sm font-semibold text-slate-100 hover:bg-[#540d7d] dark:bg-purple-500 dark:hover:bg-purple-600"
                type="button"
              >
                Read Posts
              </button>
            </div>
          </div> */}
        </div>
      </main>
    </div>
  );
}

export default Home;
