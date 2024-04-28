import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Index from "../components";
import User from "../components/user";
import CreateUpdatePost from "../components/CreateUpdatePost";
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
			element: <CreateUpdatePost operation='create' />
		},
		{
			path: "posts/update/:name",
			element: <CreateUpdatePost operation='update' />
		},
		{
			path: "posts/post/:name",
			element: <Post />
		}
	]);
	return <RouterProvider router={router} />;
};

export default Router;
