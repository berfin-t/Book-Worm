import { CircularProgress, Divider, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { AddShoppingCart } from "@mui/icons-material";
import { currencyTRY } from "../../utils/formatCurrency";
import { addItemToCart } from "../cart/cartSlice";
import { fetchBookById, selectBookById } from "./bookSlice";
import { useAppSelector, useAppDispatch } from "../../store/store";

export default function BookDetailPage() {

    const { id } = useParams<{ id: string }>();
    const book = useAppSelector(state => selectBookById(state, Number(id)));
    const { status: loading } = useAppSelector(state => state.book);
    const { cart, status } = useAppSelector(state => state.cart);
    const dispatch = useAppDispatch();

    const item = cart?.cartItems.find(i => i.bookId === book?.id);

  useEffect(() => {
    if(id) dispatch(fetchBookById(parseInt(id)));
}, [id, dispatch]);    

    if (loading === "pendingFetchBookById") return <CircularProgress />
    if (!book) return <div>Book not found</div>

    return (
        <Grid container spacing={6} sx={{pt:5}}>
            <Grid size={{ xl: 3, lg: 4, md: 5, sm: 6, xs: 12 }}>
                <img src={book.imgUrl} style={{ width: '100%' }} />
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
                                <TableCell>{book.authorName}</TableCell>
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
                        loading={status === "pendingAddItem" + book.id}
                        onClick={()=> dispatch(addItemToCart({bookId:book.id}))}>
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