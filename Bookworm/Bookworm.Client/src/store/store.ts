import { configureStore } from "@reduxjs/toolkit"
import { cartSlice } from "../features/cart/cartSlice"
import { bookSlice } from "../features/book/bookSlice"
import { accountSlice } from "../features/account/accountSlice"
import { useDispatch, useSelector } from "react-redux"
import { authorSlice } from "../features/author/authorSlice"
import categorySlice from "../features/category/categorySlice"
import { orderSlice } from "../features/orders/orderSlice"
import { commentSlice } from "../features/comment/commentSlice"  
import { ratingSlice } from "../features/rating/ratingSlice"

export const store = configureStore({
    reducer: {
        cart: cartSlice.reducer,
        book: bookSlice.reducer,
        account: accountSlice.reducer,
        author: authorSlice.reducer,
        category: categorySlice,
        order: orderSlice.reducer,
        comment: commentSlice.reducer,
        rating: ratingSlice.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();