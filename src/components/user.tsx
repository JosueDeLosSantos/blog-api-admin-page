import { useParams } from "react-router-dom";
import LogIn from "../features/log-in";
import SignUp from "../features/sign-up";
import NotFound from "../features/NotFound";

function User() {
	const { name } = useParams();
	return name === "log-in" ? <LogIn /> : name === "sign-up" ? <SignUp /> : <NotFound />;
}

export default User;
