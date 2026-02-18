import { AddShoppingCart, ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Card, CardActions, CardContent, CardMedia, IconButton, Link, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { addItemToCart } from "../cart/cartSlice";
import SearchIcon from '@mui/icons-material/Search';
import { currencyTRY } from "../../utils/formatCurrency";
import type { IBook } from "../../model/IBook";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";

interface Props {
    books: IBook[];
}

export default function RecentlyAdded({books}: Props) {

    const {status} = useAppSelector(state=> state.cart);
    const dispatch=useAppDispatch(); 
    const [index, setIndex] = useState(0);

    const visibleCount = 5;
    const next=()=>{
        if(index < books.length ) {
            setIndex(index + 1);
        }
    };

    const prev=()=>{
        if(index > 0) {
            setIndex(index - 1);
        }
    }

    return(
        <>
        {/* Header */}
        <Box sx={{p:3, mt:2, maxWidth:1300, mx:"auto", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <Typography variant="h6" fontWeight="bold">Son Eklenenler</Typography>
            <Link href="/books" underline="hover" sx={{cursor:"pointer"}} color="#F59E0B"
            >Tümünü Göster</Link>
        </Box>

        {/* Slider */}
        <Box sx={{position:"relative", mb:5}}>
            <IconButton
            onClick={prev}
            disabled={index === 0}
            sx={{
                position:"absolute",
                left: -20,
                top: "40%",
                zIndex: 2,
                bgcolor: "white",
                boxShadow: 2,
                "&:hover": {bgcolor: "grey.100"}}}>
                {/* Left Arrow */}
                <ArrowBackIosNew />
            </IconButton>

            {/* Books */}
            <Box sx={{overflow:"hidden"}}>
                <Box sx={{
                    display: "flex",
                    transform: `translateX(-${index * 220}px)`,
                    transition: "transform 0.4s ease"}}>
                    {books.map(book => (
                <Card
                    key={book.id}
                    sx={{
                    width: 220,
                    height: 340,
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6}}}>
            <CardMedia
                sx={{ height: 160, backgroundSize: "contain" }}
                image={book.imgUrl} />

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
                        WebkitBoxOrient: 'vertical'}}>
                    {book.title}
                </Typography>
                <Typography variant="body2" color="secondary">
                    {currencyTRY.format(book.price)} 
                </Typography>
            </CardContent>
            <CardActions  sx={{ justifyContent: "space-between" }}>
                <LoadingButton
                    size="small"
                    variant="outlined"
                    loadingPosition="start"
                    startIcon={<AddShoppingCart />}
                    loading={status === "pendingAddItem" + book.id}
                    onClick={() => dispatch(addItemToCart({bookId:book.id}))}
                    color="success"
                    sx={{
                        minWidth: 0,
                        px: 1,        
                        py: 0.5,      
                        fontSize: "0.75rem"}}>Sepete Ekle</LoadingButton>
                    <Button component={RouterLink} to={`/book/${book.id}`} variant="outlined" size="small" startIcon={<SearchIcon />}>View</Button>
            </CardActions>
        </Card>))}
                </Box>
            </Box>

            {/* Right Arrow */}
            <IconButton
                onClick={next}
                disabled={index >= books.length - visibleCount}
                sx={{
                    position: "absolute",
                    right: -20,
                    top: "40%",
                    zIndex: 2,
                    bgcolor: "white",
                    boxShadow: 2,
                    '&:hover': { bgcolor: 'grey.100' }}}>
                <ArrowForwardIos/>
            </IconButton>
        </Box>
        </>
    );
}