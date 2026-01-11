import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ICart } from "../../model/ICart";
import requests from "../../api/requests";

interface CartState {
    cart:ICart | null;
    status:string;
}

const initialState: CartState = {
    cart:null,
    status:"idle"
}

export const addItemToCart = createAsyncThunk<ICart, {bookId:number, quantity?:number}>(
    "cart/addItemToCart",
    async({bookId,quantity=1}) => {
        try{
            return await requests.Cart.addItem(bookId, quantity);
        }
        catch(error) {
            console.log(error);
        }
    }
);

export const deleteItemFromCart = createAsyncThunk<ICart, { bookId: number, quantity?: number, key?: string }>(
    "cart/deleteItemFromCart",
    async ({ bookId, quantity = 1 }) => {
        try {
            return await requests.Cart.deleteItem(bookId, quantity);
        }
        catch (error) {
            console.log(error);
        }
    }
);

export const getCart = createAsyncThunk<ICart>(
    "cart/getcart",
    async (_, thunkAPI) => {
        try {
            return await requests.Cart.get();
        }
        catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)

export const cartSlice = createSlice({
    name:"cart",
    initialState,
    reducers:{
        setCart:(state,action) => {
            state.cart=action.payload
        }
    },

    extraReducers:(builder) => {
        builder.addCase(addItemToCart.pending,(state,action) => {
            console.log(action);
            state.status = "pendingAddItem" + action.meta.arg.bookId;
        });

        builder.addCase(addItemToCart.fulfilled,(state,action) => {
            state.cart = action.payload;
            state.status = "idle";
        });

        builder.addCase(addItemToCart.rejected, (state) => {
            state.status = "idle";
        });

        builder.addCase(deleteItemFromCart.pending, (state, action) => {
            console.log(action);
            state.status = "pendingDeleteItem" + action.meta.arg.bookId + action.meta.arg.key;
        });

        builder.addCase(deleteItemFromCart.fulfilled, (state, action) => {
            state.cart = action.payload;
            state.status = "idle";
        });

        builder.addCase(deleteItemFromCart.rejected, (state) => {
            state.status = "idle";
        });
    }
})

export const {setCart}=cartSlice.actions;