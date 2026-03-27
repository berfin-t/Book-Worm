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

export const fetchPendingOrders = createAsyncThunk<IOrder[]>(
    "order/fetchPendingOrders",
    async () => {
        return await requests.Order.pending();
    }
)

export const updateOrderStatus = createAsyncThunk(
    "order/updateStatus",
    async ({ id, orderStatus }: { id: number; orderStatus: number }, thunkAPI) => {
        try {
            const response = await requests.Order.updateStatus(id, { orderStatus });
            return { id, orderStatus, trackingNumber: response?.trackingNumber ?? null };
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

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

        // Pending Orders
        builder.addCase(fetchPendingOrders.pending, (state) => {
            state.status = "pendingFetchPendingOrders";
        });
        builder.addCase(fetchPendingOrders.fulfilled, (state, action) => {
            orderAdapter.setAll(state, action.payload);
            state.status = "idle";
            state.isLoaded = true;
        });
        builder.addCase(fetchPendingOrders.rejected, (state) => {
            state.status = "idle";
            state.isLoaded = false;
        });

        // Update Order Status
        builder.addCase(updateOrderStatus.pending, (state) => {
            state.status = "pendingUpdateOrderStatus";
        });
        builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
            orderAdapter.updateOne(state, {
            id: action.payload.id,
            changes: { 
                orderStatus: action.payload.orderStatus,
                trackingNumber: action.payload.trackingNumber  // ← ekle
            }
        });
        state.status = "idle";
    });
        builder.addCase(updateOrderStatus.rejected, (state) => {
            state.status = "idle";
        });
    })
})

export const {
    selectAll: selectAllOrders
} = orderAdapter.getSelectors((state: RootState) => state.order);

export const selectPendingOrders = (state: RootState) => 
    selectAllOrders(state).filter(order => order.orderStatus === 0);