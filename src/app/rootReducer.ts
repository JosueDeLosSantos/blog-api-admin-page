import { combineReducers } from "@reduxjs/toolkit";
import posts from "../features/posts/postsSlice";
import privilege from "../features/posts/privilegeSlice";

const rootReducer = combineReducers({
	posts,
	privilege
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
