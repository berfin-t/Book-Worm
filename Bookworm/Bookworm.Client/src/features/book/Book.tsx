import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import type { IBook } from "../../model/IBook";
import { LoadingButton } from "@mui/lab";
import { AddShoppingCart } from "@mui/icons-material";
import { Link } from "react-router";
import SearchIcon from '@mui/icons-material/Search';
import { currencyTRY } from "../../utils/formatCurrency";
import { addItemToCart } from "../cart/cartSlice";
import { useAppSelector, useAppDispatch } from "../../store/store";

interface Props {
    book: IBook
}

export default function Book({ book }: Props) {

    const {status} = useAppSelector(state=> state.cart);
    const dispatch=useAppDispatch();    

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
                sx={{ height: 160, backgroundSize: "contain" }}
                image={book.imgUrl}/>

            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom
                    variant="h6"
                    component="h2"
                    color="textSecondary"
                sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2, 
                    WebkitBoxOrient: 'vertical',
                }}                >
                    {book.title}
                </Typography>
                <Typography variant="body2" color="secondary">
                    {currencyTRY.format(book.price)} 
                </Typography>
            </CardContent>

            <CardActions>
                {book.isActive && book.stock > 0 ? (
    <LoadingButton
        size="small"
        variant="outlined"
        loadingPosition="start"
        startIcon={<AddShoppingCart />}
        loading={status === `pendingAddItem${book.id}`}
        onClick={() => dispatch(addItemToCart({ bookId: book.id }))}
        color="success"
    >
        Ekle
    </LoadingButton>
) : (
    <Button
        size="small"
        variant="outlined"
        disabled
        color="error"
    >
        Tükendi
    </Button>
)}
                    <Button component={Link} to={`/book/${book.id}`} variant="outlined" size="small" startIcon={<SearchIcon />}>View</Button>
            </CardActions>
        </Card>
    );
}