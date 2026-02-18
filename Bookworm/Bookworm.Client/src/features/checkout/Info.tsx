import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { useAppSelector } from "../../store/store";
import { currencyTRY } from "../../utils/formatCurrency";

export default function Info() {
    const {cart } = useAppSelector(state=>state.cart)

    const subTotal = cart?.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) ?? 0;
    const tax = subTotal * 0.20;
    const total = subTotal + tax;

    return (
        <>
            <Typography variant="subtitle2">Toplam</Typography>
            <Typography variant="h5" gutterBottom>{currencyTRY.format(total)}</Typography> 
            <List>
                {cart?.cartItems.map((item) => (
                    <ListItem key={item.bookId}>
                        <ListItemAvatar>
                            <Avatar variant="square" src={item.imgUrl}></Avatar>
                        </ListItemAvatar>
                        <ListItemText sx={{ mr: 2 }} primary={item.name} secondary={`x ${item.quantity}`} />
                        <Typography variant="body1">
                            {currencyTRY.format(item.price)}
                        </Typography>
                    </ListItem>
                ))}
            </List>
        </>        
    );
}