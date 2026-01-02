import { CircularProgress, Divider, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import type { IBook } from "../../model/IBook";
import { useParams } from "react-router-dom";
import requests from "../../api/requests";
import { toast } from "react-toastify";
import { useCartContext } from "../../context/CartContext";
import { LoadingButton } from "@mui/lab";
import { AddShoppingCart } from "@mui/icons-material";
import { currencyTRY } from "../../utils/formatCurrency";

export default function BookDetailPage() {

    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<IBook | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdded, setIsAdded] = useState(false);
    const { cart, setCart } = useCartContext();

    const item = cart?.cartItems.find(i => i.bookId === book?.id);

    useEffect(() => {
        id && requests.Book.details(parseInt(id))
            .then(data => setBook(data))
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    }, [id]);

    function handleAddItem(id: number) {
        setIsAdded(true);

        requests.Cart.addItem(id)
            .then(cart => {
                setCart(cart);
                toast.success("Sepetinize ürün eklendi.");
            })
            .catch(error => console.log(error))
            .finally(() => setIsAdded(false));
    }

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
                <Typography variant="h5" color="secondary">{currencyTRY.format(book.price)}</Typography>
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

                <Stack direction="row" spacing={2} sx={{ mt: 3 }} alignItems="center" >
                    <LoadingButton
                        variant="outlined"
                        loadingPosition="start"
                        startIcon={<AddShoppingCart />}
                        loading={isAdded}
                        onClick={()=>handleAddItem(book.id) }>
                    Sepete Ekle
                    </LoadingButton>
                    {
                        item?.quantity! > 0 && (
                            <Typography>Sepetinize {item?.quantity} ürün eklendi</Typography>

                        )
                    }
                </Stack>
            </Grid>
        </Grid>
    );
}