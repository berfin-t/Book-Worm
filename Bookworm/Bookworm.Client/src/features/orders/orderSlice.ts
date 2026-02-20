import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import requests from "../../api/requests";
import type { IOrder } from "../../model/IOrder";
import type { RootState } from "../../store/store";

export const fetchOrders = createAsyncThunk<IOrder[]>(
    "order/fetchOrders",
    async () => {
        return await requests.Order.listByAdmin();
    }
)

const orderAdapter = createEntityAdapter<IOrder>();

const initialState = orderAdapter.getInitialState({
    status: "idle",
    isLoaded: false
});

export const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {},
    extraReducers: (builder => {
        // List
        builder.addCase(fetchOrders.pending, (state) => {
            state.status = "pendingFetchOrders";
        });
        builder.addCase(fetchOrders.fulfilled, (state, action) => {
            orderAdapter.setAll(state, action.payload);
            state.status = "idle";
            state.isLoaded = true;
        });
        builder.addCase(fetchOrders.rejected, (state) => {
            state.status = "idle";
            state.isLoaded = false;
        });
    })
})

export const {
    selectAll: selectAllOrders
} = orderAdapter.getSelectors((state: RootState) => state.order);