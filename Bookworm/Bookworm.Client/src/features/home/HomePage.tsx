import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import HeroSection from "./HeroSection";
import RecentlyAdded from "./RecentlyAdded";
import { CircularProgress } from "@mui/material";
import { fetchBooks, selectAllBooks } from "../book/bookSlice";

export default function HomePage() {

  const dispatch = useAppDispatch();
  const books = useAppSelector(selectAllBooks);
  const isLoaded = useAppSelector(state => state.book.isLoaded);

  useEffect(() => {
    if (!isLoaded) {
      dispatch(fetchBooks());
    }
  }, [dispatch, isLoaded]);

  if (!isLoaded) {
    return <CircularProgress />;
  }

  const recentBooks = books.slice(-5);

  return (
    <>
    <HeroSection />    
    <RecentlyAdded books={recentBooks} />    
    </>
  );
}
