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

export const addComment = createAsyncThunk(
    "comment/add",
    async (data: { bookId: number; content: string }) => {
        return await requests.Comment.add(data.bookId, data.content);
    }
);

export const updateComment = createAsyncThunk(
    "comment/update",
    async (data: { commentId: number; content: string }) => {
        return await requests.Comment.update(data.commentId, data.content);
    }
);

export const deleteComment = createAsyncThunk(
    "comment/delete",
    async({commentId}: {commentId: number}) => {
        return await requests.Comment.delete(commentId);
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
            })
            .addCase(addComment.fulfilled, (state, action) => {
                state.comments.push(action.payload);
            })
             .addCase(updateComment.fulfilled, (state, action) => {
                const index = state.comments.findIndex(c => c.id === action.payload.id);
                if(index !== -1) {
                    state.comments[index] = action.payload;
                }
            })
             .addCase(deleteComment.fulfilled, (state, action) => {
                state.comments = state.comments.filter(c => c.id !== action.meta.arg.commentId);
             });
    },
});