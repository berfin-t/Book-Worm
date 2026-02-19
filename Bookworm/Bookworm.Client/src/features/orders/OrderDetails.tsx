import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import type { IOrder } from "../../model/IOrder";
import { currencyTRY } from "../../utils/formatCurrency";
import requests from "../../api/requests";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import CloseIcon from '@mui/icons-material/Close';

const orderStatus = ["Pending", "Approved", "PaymentFailed", "Complated"];

export default function OrderDetails() {

    const [orders, setOrders] = useState<IOrder[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

    const subTotal = selectedOrder?.orderItems.reduce((toplam, item) => toplam + (item.quantity * item.price), 0) ?? 0;
    const tax = subTotal * 0.2;
    const total = subTotal + tax;

     function handleDialogOpen(order: IOrder) {
        setOpen(true);
        setSelectedOrder(order);
    }

    const handleDialogClose = () => {
        setOpen(false);
    };
        
    useEffect(() => {
        requests.Order.list()
        .then(orders => setOrders(orders))
        .catch(error => console.log(error))
        .finally(() => setLoading(false));
    }, []);

    if (loading) return <CircularProgress />;
    
    return (
        <>
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Order Id:</TableCell>
                        <TableCell>Order Status:</TableCell>
                        <TableCell>Order Date:</TableCell>
                        <TableCell>Total:</TableCell>
                        <TableCell></TableCell>   
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders?.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell component="th" scope="row">{order.id}</TableCell>
                            <TableCell component="th" scope="row">{orderStatus[order.orderStatus]}</TableCell>
                            <TableCell component="th" scope="row">{new Date(order.orderDate).toLocaleString()}</TableCell>
                            <TableCell component="th" scope="row">{currencyTRY.format(order.subTotal)}</TableCell>
                            <TableCell component="th" scope="row" sx={{width: 100}}>
                                <Button 
                                onClick={() => handleDialogOpen(order)}
                                sx={{
                                    backgroundColor: "#F59E0B",
                                fontWeight: "bold",
                                "&:hover": {
                                        backgroundColor: "#D97706"
                                    },
                                }}
                                size="small" variant="contained" endIcon={<ArrowRightIcon />}>Details</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
            </Table>
        </TableContainer>

        <Dialog onClose={handleDialogClose} open={open} fullWidth maxWidth="lg"
        aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"> 
            <DialogTitle>
                Sipariş No: #{selectedOrder?.id}</DialogTitle>  
                <IconButton onClick={handleDialogClose} sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500], }}>
                    <CloseIcon/>
                </IconButton>
                <DialogContent dividers>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>Teslimat Bilgileri</Typography>
                        <Typography gutterBottom>{selectedOrder?.firstName} {selectedOrder?.lastName}</Typography>
                        <Typography gutterBottom>{selectedOrder?.phone}</Typography>
                        <Typography gutterBottom>{selectedOrder?.addresLine} / {selectedOrder?.city}</Typography>
                    </Paper>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                   <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell align="right">Fiyat</TableCell>
                                <TableCell align="right">Adet</TableCell>
                                <TableCell align="right">Toplam</TableCell>
                                </TableRow>
                            </TableHead> 
                            <TableBody>
                                {selectedOrder?.orderItems.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <img src={item.bookImage} style={{height: 60}}/>
                                        </TableCell>
                                        <TableCell align="right">{item.bookName}</TableCell>
                                        <TableCell align="right">{ currencyTRY.format(item.price)}</TableCell>
                                        <TableCell align="right">{ item.quantity}</TableCell>
                                        <TableCell align="right">{currencyTRY.format(item.price * item.quantity)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell align="right" colSpan={4}>Ara Toplam</TableCell>
                                    <TableCell align="right" colSpan={4}>{currencyTRY.format(subTotal)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right" colSpan={4}>Vergi</TableCell>
                                    <TableCell align="right" colSpan={4}>{currencyTRY.format(tax)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right" colSpan={4}>Toplam</TableCell>
                                    <TableCell align="right" colSpan={4}>{currencyTRY.format(total)}</TableCell>
                                </TableRow>
                            </TableBody>
                            </Table>
                        </TableContainer>
                    </DialogContent>  
                    <DialogActions>
                        <Button onClick={handleDialogClose}>Kapat</Button>
                        </DialogActions>                   
        </Dialog>
        </>
    );
}