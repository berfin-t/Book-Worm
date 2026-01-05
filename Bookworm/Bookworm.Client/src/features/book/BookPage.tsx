import { useEffect } from "react";
import BookList from "./BookList";
import { CircularProgress } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { selectAllBooks, fetchBooks } from "./bookSlice";

export default function BookPage() {

    const books = useAppSelector(selectAllBooks);
    const { status, isLoaded } = useAppSelector(state => state.book);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!isLoaded) dispatch(fetchBooks());
    }, [isLoaded]);

    if (status === "pendingFetchBooks") return <CircularProgress />

return (
    <BookList book={books} />
        
    );
}