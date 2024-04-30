import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: string = "user";

const privilegeSlice = createSlice({
	name: "privilege",
	initialState,
	reducers: {
		switchPrivilege(_, action: PayloadAction<string>) {
			return action.payload;
		}
	}
});

export const { switchPrivilege } = privilegeSlice.actions;

export default privilegeSlice.reducer;
