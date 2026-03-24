import { useEffect } from "react";
import {
    Box, CircularProgress, Divider, Grid, Rating as MuiRating,
    Typography
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { fetchRatingsByBook } from "./ratingSlice";

interface Props {
    bookId: number;
}

export default function Rating({ bookId }: Props) {

    const dispatch = useAppDispatch();
    const { ratings, status } = useAppSelector(state => state.rating);

    useEffect(() => {
        if (bookId) dispatch(fetchRatingsByBook(bookId));
    }, [bookId, dispatch]);

    const averageScore = ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length
        : 0;

    if (status === "pendingFetchRatings") return <CircularProgress />;

    return (
        <Grid size={{ xs: 12 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2 }}>
                Puanlar ({ratings.length})
            </Typography>

            {ratings.length > 0 ? (
                <Box display="flex" alignItems="center" gap={1}>
                    <MuiRating value={averageScore} precision={0.5} readOnly />
                    <Typography variant="body1" color="text.secondary">
                        {averageScore.toFixed(1)} / 5
                    </Typography>
                </Box>
            ) : (
                <Typography color="text.secondary">Henüz puanlama yapılmamış.</Typography>
            )}
        </Grid>
    );
}