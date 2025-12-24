import { CircularProgress, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import type { IBook } from "../../model/IBook";
import { useParams } from "react-router-dom";
import requests from "../../api/requests";

export default function BookDetailPage() {

    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<IBook | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        id && requests.Book.details(parseInt(id))
            .then(data => setBook(data))
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <CircularProgress />
    if (!book) return <div>Book not found</div>

    return (
        <Grid container spacing={6} sx={{pt:5}}>
            <Grid size={{ xl: 3, lg: 4, md: 5, sm: 6, xs: 12 }}>
                <img src={`http://localhost:5141/images/${book.imgUrl}`} style={{ width: '100%' }} />
            </Grid>
            <Grid size={{xl:9, lg:8, md:7, sm:6, xs:12}}>
                <Typography variant="h3">{book.title}</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h5" color="secondary">{book.price.toFixed(2)} TL</Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell variant="head">Yazar</TableCell>
                                <TableCell>{book.author}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">ISBN</TableCell>
                                <TableCell>{book.isbn}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">Açıklama</TableCell>
                                <TableCell>{book.description}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell variant="head">Stock</TableCell>
                                <TableCell>{book.stock}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    );
}