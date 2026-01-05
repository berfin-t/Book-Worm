import { configureStore } from "@reduxjs/toolkit"
import { cartSlice } from "../features/cart/cartSlice"
import { bookSlice } from "../features/book/bookSlice"

export const store = configureStore({
    reducer: {
        cart: cartSlice.reducer,
        book: bookSlice.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch