import { createSlice } from "@reduxjs/toolkit";
import type { ICart } from "../../model/ICart";

interface CartState {
    cart:ICart|null;
}

const initialState:CartState = {
    cart:null
}

export const cartSlice = createSlice({
    name:"cart",
    initialState,
    reducers:{
        setCart:(state,action) => {
            state.cart=action.payload
        }
    }
})

export const {setCart} =cartSlice.actions;

