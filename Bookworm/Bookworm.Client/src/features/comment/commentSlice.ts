import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import requests from "../../api/requests";

export interface Comment {
    id: number;
    content: string;
    createdAt: string;
    userName: string;
    userFullName: string;
}

interface CommentState {
    comments: Comment[];
    status: string;
}

const initialState: CommentState = {
    comments: [],
    status: "idle",
};

export const fetchCommentsByBook = createAsyncThunk<Comment[], number>(
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
                state.comments = action.payload;
                state.status = "idle";
            })
            .addCase(fetchCommentsByBook.rejected, (state) => {
                state.status = "idle";
            });
    },
});