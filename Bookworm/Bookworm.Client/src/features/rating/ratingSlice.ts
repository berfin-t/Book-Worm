import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import requests from "../../api/requests";
import type { IRating } from "../../model/IRating";

interface RatingState {
    ratings: IRating[];
    status: string;
}

const initialState: RatingState = {
    ratings: [],
    status: "idle",
};

export const fetchRatingsByBook = createAsyncThunk<IRating[], number>(
    "rating/fetchByBook",
    async (bookId) => {
        return await requests.Rating.listByBook(bookId) as IRating[];
    }
);

export const ratingSlice = createSlice({
    name: "rating",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRatingsByBook.pending, (state) => {
                state.status = "pendingFetchRatings";
            })
            .addCase(fetchRatingsByBook.fulfilled, (state, action) => {
                state.ratings = action.payload;
                state.status = "idle";
            })
            .addCase(fetchRatingsByBook.rejected, (state) => {
                state.status = "idle";
            });
    },
});

export default ratingSlice.reducer;