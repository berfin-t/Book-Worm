import { Grid } from "@mui/material";
import type { IBook } from "../../model/IBook";
import Book from "./Book";

interface Props {
    book: IBook[];
}

export default function BookList({ book }: Props) {
    if (book.length === 0) return null;   

    return (
        <Grid container spacing={2} sx={{pt:4, mb:5} }>
            {book.map((b) => (
                <Grid key={b.id} size={{ xs: 6, md: 8, lg:3 }}>
                    <Book book={b} />
                </Grid>
            ))}
        </Grid>
    );
}
