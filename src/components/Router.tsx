import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Index from "./Index";
import LogIn from "./log-in";
import SignUp from "./sign-up";

const Router = () => {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Index />,
		},
		{
			path: "user/sign-up",
			element: <SignUp />,
		},
		{
			path: "user/log-in",
			element: <LogIn />,
		},
	]);
	return <RouterProvider router={router} />;
};

export default Router;
