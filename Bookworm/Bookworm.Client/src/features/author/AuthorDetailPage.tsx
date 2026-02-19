import { Card, CardContent, CardMedia, CircularProgress, Divider, Grid, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { fetchAuthorById, selectAuthorById } from "./authorSlice";
import { useEffect } from "react";
import { currencyTRY } from "../../utils/formatCurrency";

export default function AuthorDetailPage() {

    const {id} = useParams<{id: string}>();
    const author = useAppSelector(state =>id ? selectAuthorById(state, Number(id)) : undefined);
    const { status: loading } = useAppSelector(state => state.author);
    const dispatch = useAppDispatch();
    const baseUrl = "http://localhost:5141";    

    useEffect(() => {
    if (id) {dispatch(fetchAuthorById(parseInt(id)));
        }
    }, [id, dispatch]);
 

    if (loading === "pendingFetchAuthorById") 
        return <CircularProgress />

    if (!author) 
        return <div>Book not found</div>

    const books = author.books?? [];

    return (
    <Grid container spacing={6} sx={{ pt: 5, maxWidth: 1200, mx: "auto" }}>

        {/* AUTHOR INFO */}
        <Grid size={{ xl: 3, lg: 4, md: 5, sm: 6, xs: 12 }}>
            <img
                src={baseUrl + author.imgUrl}
                alt={author.name}
                style={{
                    width: "100%",
                    borderRadius: 8,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}
            />
        </Grid>

        <Grid size={{ xl: 9, lg: 8, md: 7, sm: 6, xs: 12 }}>
            <Typography variant="h3" gutterBottom>
                {author.name}
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Typography variant="body1" color="text.secondary">
                {author.bio}
            </Typography>
        </Grid>

        {/* BOOK SECTION */}
        <Grid size={{ xs: 12 }}>
            <Divider sx={{ mt: 2, mb: 5 }} />

            <Typography variant="h5" gutterBottom>
                Books by {author.name}
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
                {books.map((book) => (
                    <Grid key={book.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <Card
                            component={Link}
                            to={`/catalog/${book.id}`}
                            sx={{
                                height: "100%",
                                textDecoration: "none",
                                transition: "0.3s",
                                "&:hover": {
                                    boxShadow: 6,
                                    transform: "scale(1.03)"
                                }
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="200"
                                image={book.imgUrl}
                                sx={{ objectFit: "contain", p: 2 }}
                            />

                            <CardContent>
                                <Typography variant="subtitle1" gutterBottom>
                                    {book.title}
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    {currencyTRY.format(book.price)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    </Grid>
);

}