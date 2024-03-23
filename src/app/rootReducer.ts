import { combineReducers } from "@reduxjs/toolkit";
import posts from "../features/posts/postsSlice";

const rootReducer = combineReducers({
	posts
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
