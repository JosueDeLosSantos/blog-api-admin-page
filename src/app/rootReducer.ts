import { combineReducers } from "@reduxjs/toolkit";
import posts from "../modules/posts/utils/postsSlice";
import privilege from "../modules/posts/utils/privilegeSlice";

const rootReducer = combineReducers({
  posts,
  privilege,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
