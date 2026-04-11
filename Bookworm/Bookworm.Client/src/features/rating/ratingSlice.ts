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

export const addRating = createAsyncThunk(
    "rating/add",
    async (data: { bookId: number; score: number }, { dispatch }) => {
        await requests.Rating.add(data.bookId, data.score);
        dispatch(fetchRatingsByBook(data.bookId));
    }
);

export const updateRating = createAsyncThunk(
    "rating/update",
    async(data: {ratingId:number, score:number})=>{
        return await requests.Rating.update(data.ratingId, data.score);
    }
);

export const deleteRating = createAsyncThunk(
    "rating/delete",
    async({ratingId}: {ratingId: number}) => {  
        return await requests.Rating.delete(ratingId);
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
            })
                .addCase(addRating.fulfilled, (state) => {
                    state.status = "idle";
                })
                .addCase(updateRating.fulfilled, (state, action) => {
                    const index = state.ratings.findIndex(r => r.id === action.payload.id);
                    if(index !== -1) {
                        state.ratings[index] = action.payload;
                    }
                })
                .addCase(deleteRating.fulfilled, (state, action) => {
                    state.ratings = state.ratings.filter(r => r.id !== action.meta.arg.ratingId);
                });
    },
});

export default ratingSlice.reducer;