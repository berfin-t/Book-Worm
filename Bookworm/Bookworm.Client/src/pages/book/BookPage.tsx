import { useEffect, useState } from "react";
import type { IBook } from "../../model/IBook";
import BookList from "./BookList";
import requests from "../../api/requests";
import { CircularProgress } from "@mui/material";

export default function BookPage() {
    const [books, setBooks] = useState<IBook[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        requests.Catalog.list()
            .then(data => setBooks(data))
            .finally(() => setLoading(false));

    }, []);

    if (loading) return <CircularProgress />

return (
    <BookList book={books} />
    );
}