import { createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import requests from "../../api/requests";
import type { ICategory } from "../../model/ICategory";
import type { RootState } from "../../store/store";

export const fetchCategories = createAsyncThunk<ICategory[]>(
    "category/fetchCategories",
    async () => {
        return await requests.Category.getCategoryWithCount();
    }
);

const categoryAdapter = createEntityAdapter<ICategory>();

const initialState = categoryAdapter.getInitialState({
    status: "idle"
});

export const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchCategories.fulfilled, (state, action) => {
            categoryAdapter.setAll(state, action.payload);
            state.status = "idle";
        });
    }
});

export const {
    selectAll: selectAllCategories
} = categoryAdapter.getSelectors(
    (state: RootState) => state.category
);

export default categorySlice.reducer;