import { useParams } from "react-router-dom";
import LogIn from "./log-in";
import SignUp from "./sign-up";
import Posts from "./posts";
import ErrorPage from "./ErrorPage";

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
