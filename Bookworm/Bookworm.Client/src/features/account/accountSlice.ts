import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { IUser } from "../../model/IUser";
import requests from "../../api/requests";
import type { FieldValues } from "react-hook-form";
import { router } from "../../router/Router";

interface AccountState {
    user: IUser | null;
}

const initialState: AccountState = {
    user:null
}

export const loginUser = createAsyncThunk<IUser, FieldValues>(
    "account/login",
    async (data, { rejectWithValue }) => {
        try {
            const user = await requests.Account.login(data);
            localStorage.setItem("user", JSON.stringify(user));
            return user;
        }
        catch (error: any) {
            return rejectWithValue({ error: error.data });
        }
    }
)

export const getUser = createAsyncThunk<IUser>(
    "account/getUser",
    async (_, thunkAPI) => {
        thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem("user")!)));
        try {
            const user = await requests.Account.getUser();
            localStorage.setItem("user", JSON.stringify(user));
            return user;
        }
        catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    },
    {
        condition: () => {
            if (!localStorage.getItem("user")) return false;
        }
    }
);

export const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            localStorage.removeItem("user");
            router.navigate("/books");
        },
        setUser: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder => {
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.user = action.payload;
        })
    })
})

export const { logout, setUser } = accountSlice.actions;