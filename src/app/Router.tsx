import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Index from "../components";
import User from "../components/user";
import CreatePost from "../components/CreatePost";
import UpdatePost from "../components/UpdatePost";
import ErrorPage from "../features/ErrorPage";
import Post from "../components/Post";

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
		},
		{
			path: "posts/post/:name",
			element: <Post />
		}
	]);
	return <RouterProvider router={router} />;
};

export default Router;
