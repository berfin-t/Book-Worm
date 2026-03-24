import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import requests from "../../api/requests";
import type { IComment } from "../../model/IComment";

interface CommentState {
    comments: IComment[];
    status: string;
}

const initialState: CommentState = {
    comments: [],
    status: "idle",
};

export const fetchCommentsByBook = createAsyncThunk<IComment[], number>(
    "comment/fetchByBook",
    async (bookId) => {
        return await requests.Comment.listByBook(bookId);
    }
);

export const commentSlice = createSlice({
    name: "comment",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCommentsByBook.pending, (state) => {
                state.status = "pendingFetchComments";
            })
            .addCase(fetchCommentsByBook.fulfilled, (state, action) => {
                state.status = "idle";
                state.comments = action.payload;
            })
            .addCase(fetchCommentsByBook.rejected, (state) => {
                state.status = "idle";
            });
    },
});