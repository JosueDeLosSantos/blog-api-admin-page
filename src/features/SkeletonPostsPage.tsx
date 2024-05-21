import {
  AppBar,
  Box,
  IconButton,
  Menu,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState, useEffect } from "react";

function SkeletonPostsPage() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty array ensures effect is only run on mount and unmount

  return (
    <div className="max-h-auto min-h-screen bg-slate-100">
      <Box>
        <AppBar
          className="border border-solid border-slate-200 bg-white shadow-none"
          position="fixed"
        >
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              aria-label="menu"
              sx={{ mr: 2, color: "black" }}
            >
              <MenuIcon fontSize={windowWidth > 350 ? "large" : "medium"} />
            </IconButton>
            <Menu
              id="basic-menu"
              open={false}
              elevation={1}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            ></Menu>
            <Typography
              variant="h6"
              component="div"
              className="mx-sm:text-xl w-full text-center font-PressStart2P lg:text-3xl"
              sx={{
                color: "black",
              }}
            >
              {"<JCODER>"}
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <div className="mx-auto w-fit pt-24">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            className="mx-5 mb-2 flex max-w-screen-lg flex-col rounded-lg border border-solid border-slate-200 bg-white p-2 sm:gap-1 md:flex-col md:gap-2 lg:flex-row lg:gap-4"
            key={i}
          >
            <div className="relative w-full md:w-full lg:w-1/2">
              {/* fake image */}
              <div className="bg-custom-animation-1 size-40 sm:size-60 md:min-h-64 md:min-w-96 lg:min-h-72 lg:min-w-96"></div>

              <div className={`absolute bottom-2 left-1 lg:hidden`}>
                <div className="w-[9.5rem] rounded-full bg-white max-lg:bg-white max-sm:h-3 sm:h-4 sm:w-[14.5rem] md:h-5 md:w-[23.5rem]"></div>
              </div>
            </div>
            <div className="w-full md:w-full  lg:w-1/2">
              <div className="bg-custom-animation-2 mb-2 mt-1 hidden h-10 w-96 rounded-full lg:block"></div>
              <div className="bg-custom-animation-1 h-2 w-20 rounded-full max-sm:mt-1 sm:h-3 sm:w-24 md:h-4 md:w-44 lg:h-5 lg:w-52"></div>
              <div className="mt-3 sm:mt-4 md:mt-5 lg:mt-8">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-custom-animation-1 my-1 h-2 w-[9.5rem] rounded-full sm:h-3 sm:w-[14.5rem] md:h-4 md:w-[23.5rem] lg:h-5 lg:w-96"
                  ></div>
                ))}
              </div>
              <div className="bg-custom-animation-1 my-1 h-2 w-20 rounded-full sm:h-3 sm:w-24 md:h-4 md:w-44 lg:h-5 lg:w-44"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkeletonPostsPage;
