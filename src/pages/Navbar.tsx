import { Outlet } from "react-router-dom";
import MenuBar from "../components/MenuBar";
import SideNav from "../components/SideNav";
import useWindowSize from "../hooks/windowSize";

function Home() {
  const { windowWidth } = useWindowSize();

  return (
    <div
      style={windowWidth > 1023 ? { display: "flex" } : { display: "block" }}
      className="min-h-screen w-full bg-slate-100 dark:bg-slate-950"
    >
      {windowWidth < 1024 && <MenuBar />}
      {windowWidth > 1023 && <SideNav />}
      <main className="mx-auto w-4/5">
        <Outlet />
      </main>
    </div>
  );
}

export default Home;
