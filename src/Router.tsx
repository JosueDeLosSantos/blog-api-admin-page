import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Index from ".";
import User from "./user";
import CreatePost from "./CreatePost";
import UpdatePost from "./UpdatePost";
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
		},
		{
			path: "posts/create",
			element: <CreatePost />
		},
		{
			path: "posts/update/:name",
			element: <UpdatePost />
		}
	]);
	return <RouterProvider router={router} />;
};

export default Router;
