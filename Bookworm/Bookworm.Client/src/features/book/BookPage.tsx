import { useEffect } from "react";
import { CircularProgress, Container, Grid } from "@mui/material";
import BookList from "./BookList";
import CategorySidebar from "../category/CategorySidebar";
import { fetchBooks, selectBooksByCategory } from "./bookSlice";
import { useAppSelector, useAppDispatch } from "../../store/store";
import { fetchCategories, selectAllCategories } from "../category/categorySlice";

export default function BookPage() {

    const dispatch = useAppDispatch();

    const books = useAppSelector(selectBooksByCategory);
    const categories = useAppSelector(selectAllCategories);
    const { status, isLoaded } = useAppSelector(state => state.book);

    useEffect(() => {
    if (!isLoaded) dispatch(fetchBooks());
    dispatch(fetchCategories());
}, [dispatch]);

    if (status === "pendingFetchBooks")
        return <CircularProgress />;

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
  <Grid container spacing={4} alignItems="flex-start">

    {/* Kitaplar */}
    <Grid size={{ xs: 12, md: 9 }}>
      <BookList book={books} />
    </Grid>

    {/* Sidebar */}
    <Grid size={{ xs: 12, md: 3 }}>
      <CategorySidebar category={categories} />
    </Grid>

  </Grid>
</Container>
    );
}