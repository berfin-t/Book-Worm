import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid/DataGrid";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { fetchBooks, selectLowStockBooks } from "../../book/bookSlice";
import type { GridColDef } from "@mui/x-data-grid/models/colDef";
import { useEffect } from "react";

export default function LowStockBooks() {

    const dispatch = useAppDispatch();
    const books = useAppSelector(selectLowStockBooks);

    useEffect(() => {
        dispatch(fetchBooks());
    }, [dispatch]);
    
    const columns: GridColDef[] = [
        {field: "id", headerName: "ID", width:80},
        {field: "title", headerName: "Kitap Adı", width:200},
        {field: "authorName", headerName: "Yazar", width:150},
        {field: "stock", headerName: "Stok", width:100}
    ];

    return(
        <>
        <Box
        sx={{
                display: "flex",
                justifyContent: "flex-end",
                mb:2
            }}>
                <DataGrid
                rows={books ?? []}
                columns={columns}
                pageSizeOptions={[5,10,20]}
                sx={{border:0}}/>

        </Box>
        </>
    );  
}