import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { postTypes } from "./types";

const initialState: postTypes[] = [];

const postsSlice = createSlice({
	name: "posts",
	initialState,
	reducers: {
		postsList(_, action: PayloadAction<postTypes[]>) {
			return action.payload;
		},
		addPost(state, action: PayloadAction<postTypes>) {
			state.push(action.payload);
		},
		updatePost(state, action: PayloadAction<postTypes>) {
			// find index of element to be updated
			const indexToUpdate = state.findIndex((el) => el._id === action.payload._id);
			// update state
			state[indexToUpdate] = action.payload;
		},
		deletePost(state, action: PayloadAction<string>) {
			// find index of element to be deleted
			const indexToRemove = state.findIndex((el) => el._id === action.payload);
			// delete post
			state.splice(indexToRemove, 1);
		}
	}
});

export const { postsList, addPost, updatePost, deletePost } = postsSlice.actions;

export default postsSlice.reducer;
