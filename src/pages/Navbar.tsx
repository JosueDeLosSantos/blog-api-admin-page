import { Outlet } from "react-router-dom";
import MenuBar from "../components/MenuBar";
import MenuBarLarge from "../components/MenuBarLarge";
import useWindowSize from "../hooks/windowSize";

function Home() {
  const { windowWidth } = useWindowSize();

  return (
    <div
      style={windowWidth > 1023 ? { display: "flex" } : { display: "block" }}
      className="min-h-screen w-full bg-slate-100 dark:bg-slate-950"
    >
      {windowWidth < 1024 && <MenuBar />}
      {windowWidth > 1023 && <MenuBarLarge />}
      <main className="w-4/5">
        <Outlet />
      </main>
    </div>
  );
}

export default Home;
