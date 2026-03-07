import { createAsyncThunk, createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit";
import requests from "../../api/requests";
import type { IBook } from "../../model/IBook";
import type { RootState } from "../../store/store";
import type { ICategory } from "../../model/ICategory";
import axios from "axios";

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

export const createBook = createAsyncThunk<IBook, IBook>(
  "book/createBook",
  async (book) => {
    return await requests.Book.create(book);
  }
);

export const updateBook = createAsyncThunk(
  "book/updateBook",
  async (book: IBook) => {

    const response = await axios.put(`/book/${book.id}`, {
      title: book.title,
      isbn: book.isbn,
      price: book.price,
      stock: book.stock,
      description: book.description,
      isActive: book.isActive,
      imgUrl: book.imgUrl,
      authorId: book.authorId,
      categoryId: book.categoryId
    });

    return response.data;
  }
);

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

        // List
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
        // Details
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
        //Create
        builder.addCase(createBook.pending, (state) => {
            state.status = "pendingCreateBook";
        });
        builder.addCase(createBook.fulfilled, (state, action) => {
            booksAdapter.addOne(state, action.payload);
            state.status = "idle";
        });  
            builder.addCase(createBook.rejected, (state) => {
        state.status = "idle";
        });
        //Update
        builder.addCase(updateBook.pending, (state) => {
            state.status = "pendingUpdateBook";
        });
        builder.addCase(updateBook.fulfilled, (state, action) => {
            booksAdapter.upsertOne(state, action.payload);
            state.status = "idle";
        });
        builder.addCase(updateBook.rejected, (state) => {
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

export const selectAllCategories = (state: RootState): ICategory[] => {
  const categoryState = state.category; 
  return categoryState.ids.map(id => categoryState.entities[id]!);
};

export const selectLowStockBooks = createSelector(
    [selectAllBooks],
    (books) => books.filter(book => book.stock <= 5)
);