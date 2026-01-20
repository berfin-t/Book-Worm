import { Box, Button, TableContainer, Paper, Table, TableBody, TableCell, TableHead, TableRow, Container, Alert } from "@mui/material";
import { AddCircleOutline, Delete, RemoveCircleOutline } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import CartSummary from "./CartSummary";
import { currencyTRY } from "../../utils/formatCurrency";
import { addItemToCart, deleteItemFromCart } from "./cartSlice";
import { useAppSelector, useAppDispatch } from "../../store/store";
import { Link } from "react-router-dom";

export default function ShoppingCartPage() {

    const { cart, status } = useAppSelector(state=>state.cart);
    const dispatch = useAppDispatch();   

    if(cart?.cartItems.length === 0) return <Container sx={{pt:4}}><Alert severity="warning">Sepetinizde ürün yok!</Alert></Container>

    return (
        <>
        <Container sx={{pt:4} }>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell align="right">Fiyat</TableCell>
                        <TableCell align="right">Adet</TableCell>
                        <TableCell align="right">Toplam</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cart?.cartItems.map((item) => (
                        <TableRow
                            key={item.bookId}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                <img src={`http://localhost:5141/images/${item.imgUrl}`} style={{ height: 60 }} />
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {item.name}
                            </TableCell>
                            <TableCell align="right">{currencyTRY.format(item.price)}</TableCell>
                            <TableCell align="right">
                                <LoadingButton
                                    loading={status === "pendingAddItem" + item.bookId}
                                    onClick={() => dispatch(addItemToCart({bookId:item.bookId}))}>
                                    <AddCircleOutline/>
                                </LoadingButton>
                                {item.quantity}
                                <LoadingButton
                                    loading={status === "pendingDeleteItem" + item.bookId + "single"}
                                    onClick={() => dispatch(deleteItemFromCart({bookId:item.bookId, quantity:1, key:"single"}))}>
                                    <RemoveCircleOutline />
                                </LoadingButton>
                            </TableCell>
                            <TableCell align="right">{currencyTRY.format(item.price * item.quantity)}</TableCell>
                            <TableCell align="right">
                                <LoadingButton color="error"
                                    loading={status === "pendingDeleteItem" + item.bookId + "all"}
                                    onClick={() => {dispatch(deleteItemFromCart({bookId:item.bookId, quantity:item.quantity, key:"all"}))}}>
                                    <Delete />
                                </LoadingButton>
                            </TableCell>
                        </TableRow>
                    ))}
                        <CartSummary />
                </TableBody>
            </Table>
        </TableContainer>
            </Container>
            <Box display="flex" justifyContent="flex-end" sx={{mt:3} }>
                <Button component={Link} to="/checkout" variant="contained" 
                sx={{
                    backgroundColor: "#F59E0B",
                                fontWeight: "bold",
                                "&:hover": {
                                        backgroundColor: "#D97706"
                                    },
                }} >Checkout</Button>
        </Box>
        </>
    );
}