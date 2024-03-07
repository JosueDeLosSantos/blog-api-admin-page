import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Index from ".";
import User from "./user";
import ErrorPage from "./ErrorPage";

const Router = () => {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Index />,
			errorElement: <ErrorPage />
		},
		{
			path: ":name",
			element: <User />
		}
	]);
	return <RouterProvider router={router} />;
};

export default Router;
