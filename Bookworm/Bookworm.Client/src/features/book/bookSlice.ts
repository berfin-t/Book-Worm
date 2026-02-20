import { createAsyncThunk, createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit";
import requests from "../../api/requests";
import type { IBook } from "../../model/IBook";
import type { RootState } from "../../store/store";

export const fetchBooks = createAsyncThunk<IBook[]>(
    "catalog/fetchBooks",
    async () => {
        return await requests.Book.list();
    }
)

export const fetchBookById = createAsyncThunk<IBook, number>(
    "book/fetchBookById",
    async (bookId) => {
        return await requests.Book.details(bookId);
    }
)

const booksAdapter = createEntityAdapter<IBook>();

const initialState = booksAdapter.getInitialState({
    status: "idle",
    isLoaded: false,
    selectedCategoryId: null as number | null
});

export const bookSlice = createSlice({
    name: "book",
    initialState,
    reducers: {
        setSelectedCategory: (state, action) => {
            state.selectedCategoryId = action.payload;
        },
        clearSelectedCategory: (state) => {
            state.selectedCategoryId = null;
        }
    },
    extraReducers: (builder => {
        builder.addCase(fetchBooks.pending, (state) => {
            state.status = "pendingFetchBooks";
        });
        builder.addCase(fetchBooks.fulfilled, (state, action) => {
            booksAdapter.setAll(state, action.payload);
            state.status = "idle";
            state.isLoaded = true;
        });
        builder.addCase(fetchBooks.rejected, (state) => {
            state.status = "idle";
            state.isLoaded = false;
        });
        builder.addCase(fetchBookById.pending, (state) => {
            state.status = "pendingFetchBookById";
        });
        builder.addCase(fetchBookById.fulfilled, (state, action) => {
            booksAdapter.upsertOne(state, action.payload);
            state.status = "idle";
        });
        builder.addCase(fetchBookById.rejected, (state) => {
            state.status = "idle";
        });
    })
})

export const {
    selectById: selectBookById,
    selectIds: selectBookIds,
    selectEntities: selectBookEntities,
    selectAll: selectAllBooks,
    selectTotal: selectTotalBooks
} = booksAdapter.getSelectors((state: RootState) => state.book);

export const selectBooksByAuthor = (state: RootState, authorId: number) => {
    return selectAllBooks(state).filter(
        (book) => book.authorId === authorId
    );
}
export const { setSelectedCategory, clearSelectedCategory } =
    bookSlice.actions;

export const selectBooksByCategory = createSelector(
    [selectAllBooks, (state: RootState) => state.book.selectedCategoryId],
    (books, selectedCategoryId) => {
        if (!selectedCategoryId) return books;
        return books.filter(
            (book) => book.categoryId === selectedCategoryId
        );
    }
);