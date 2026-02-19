import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import type { IAuthor } from "../../model/IAuthor";
import requests from "../../api/requests";
import type { RootState } from "../../store/store";

export const fetchAuthors = createAsyncThunk<IAuthor[]>(
    "author/fetchAuthors",
    async () => {
        return await requests.Author.list();
    }
);

export const fetchAuthorById = createAsyncThunk<IAuthor, number>(
    "author/fetchAuthorById",
    async (authorId) => {
        return await requests.Author.details(authorId);
    }
);

const authorsAdapter = createEntityAdapter<IAuthor>();

const initialState = authorsAdapter.getInitialState({
    status: "idle",
    isLoaded: false
});

export const authorSlice = createSlice({
    name: "author",
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        // 🔹 LIST
        builder.addCase(fetchAuthors.pending, (state) => {
            state.status = "pendingFetchAuthors";
        });

        builder.addCase(fetchAuthors.fulfilled, (state, action) => {
            authorsAdapter.setAll(state, action.payload);
            state.status = "idle";
            state.isLoaded = true;
        });

        builder.addCase(fetchAuthors.rejected, (state) => {
            state.status = "idle";
        });

        // 🔹 DETAIL
        builder.addCase(fetchAuthorById.pending, (state) => {
            state.status = "pendingFetchAuthorById";
        });

        builder.addCase(fetchAuthorById.fulfilled, (state, action) => {
            authorsAdapter.upsertOne(state, action.payload);
            state.status = "idle"; 
        });

        builder.addCase(fetchAuthorById.rejected, (state) => {
            state.status = "idle"; 
        });
    }
});

export const {
    selectAll: selectAllAuthors,
    selectById: selectAuthorById
} = authorsAdapter.getSelectors((state: RootState) => state.author);

