import { TableContainer, Paper, Table, TableBody, TableCell, TableHead, TableRow, Container } from "@mui/material";
import { AddCircleOutline, Delete, RemoveCircleOutline } from "@mui/icons-material";
import { useCartContext } from "../../context/CartContext";
import { useState } from "react";
import requests from "../../api/requests";
import { LoadingButton } from "@mui/lab";

export default function ShoppingCartPage() {

    const { cart, setCart } = useCartContext();   
    const [status, setStatus] = useState({ loading: false, id: "" });

    function handleAddItem(bookId: number, id: string) {
        setStatus({ loading: true, id: id });

        requests.Cart.addItem(bookId)
            .then(cart => setCart(cart))
            .catch(error => console.log(error))
            .finally(() => setStatus({ loading: false, id: "" }));
    }

    function handleDeleteItem(bookId: number, id: string, quantity = 1) {
        setStatus({ loading: true, id: id });

        requests.Cart.deleteItem(bookId, quantity)
            .then(cart => setCart(cart))
            .catch(error => console.log(error))
            .finally(() => setStatus({ loading: false, id: "" }));
    }


    if (!cart) return <div>Sepet boş</div>

    return (
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
                            <TableCell align="right">{item.price} ₺</TableCell>
                            <TableCell align="right">
                                <LoadingButton
                                    loading={status.loading && status.id === "add" + item.bookId}
                                    onClick={() => handleAddItem(item.bookId, "add" + item.bookId)}>
                                    <AddCircleOutline/>
                                </LoadingButton>
                                {item.quantity}
                                <LoadingButton
                                    loading={status.loading && status.id === "del" + item.bookId}
                                    onClick={() => handleDeleteItem(item.bookId, "del" + item.bookId)}>
                                    <RemoveCircleOutline />
                                </LoadingButton>
                            </TableCell>
                            <TableCell align="right">{item.price * item.quantity} ₺</TableCell>
                            <TableCell align="right">
                                <LoadingButton color="error"
                                    loading={status.loading && status.id === "del_all" + item.bookId}
                                    onClick={() => handleDeleteItem(item.bookId, "del_all" + item.bookId, item.quantity)}>
                                    <Delete />
                                </LoadingButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        </Container>
    );
}