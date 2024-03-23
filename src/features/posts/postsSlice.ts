import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { postTypes } from "./types";

const initialState: postTypes[] = [];

const postsSlice = createSlice({
	name: "posts",
	initialState,
	reducers: {
		postsList(_, action: PayloadAction<postTypes[]>) {
			return action.payload;
		}
	}
});

export const { postsList } = postsSlice.actions;

export default postsSlice.reducer;
