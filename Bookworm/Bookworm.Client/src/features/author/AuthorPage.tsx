import { CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { fetchAuthors, selectAllAuthors } from "./authorSlice";
import { useEffect } from "react";
import AuthorList from "./AuthorList";

export default function AuthorPage() {

    const authors = useAppSelector(selectAllAuthors);
        const { status, isLoaded } = useAppSelector(state => state.author);
        const dispatch = useAppDispatch();
    
        useEffect(() => {
            if (!isLoaded) dispatch(fetchAuthors());
        }, [isLoaded, dispatch]);
    
        if (status === "pendingFetchAuthors") return <CircularProgress />
    
    return (
        <AuthorList author={authors} />
            
        );
}