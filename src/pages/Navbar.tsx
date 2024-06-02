import { Outlet } from "react-router-dom";
import MenuBar from "../components/MenuBar";
import MenuBarLarge from "../components/MenuBarLarge";
import useWindowSize from "../hooks/windowSize";

function Home() {
  const { windowWidth } = useWindowSize();

  return (
    <div className="min-h-screen w-full bg-slate-100 dark:bg-slate-950">
      {windowWidth < 769 && <MenuBar />}
      {windowWidth > 768 && <MenuBarLarge />}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Home;
