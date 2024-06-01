import { useParams } from "react-router-dom";
import LogIn from "./log-in";
import SignUp from "./sign-up";
import NotFound from "./NotFound";

function User() {
  const { name } = useParams();
  return name === "log-in" ? (
    <LogIn />
  ) : name === "sign-up" ? (
    <SignUp />
  ) : (
    <NotFound />
  );
}

export default User;
