import { combineReducers } from "@reduxjs/toolkit";
import posts from "../utils/postsSlice";
import privilege from "../utils/privilegeSlice";

const rootReducer = combineReducers({
  posts,
  privilege,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
