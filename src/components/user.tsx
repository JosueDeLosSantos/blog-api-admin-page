import { useParams } from "react-router-dom";
import LogIn from "../features/log-in";
import SignUp from "../features/sign-up";
import Posts from "../features/posts/posts";
import ErrorPage from "../features/ErrorPage";

function User() {
	const { name } = useParams();
	return name === "log-in" ? (
		<LogIn />
	) : name === "sign-up" ? (
		<SignUp />
	) : name === "posts" ? (
		<Posts />
	) : (
		<ErrorPage />
	);
}

export default User;
