import Paper from "@mui/material/Paper";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { fetchBooks, selectAllBooks } from "../../book/bookSlice";
import { useEffect, useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { DataGrid, GridActionsCellItem, type GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import BookAddModal from "../modals/ProductModal";
import type { IBook } from "../../../model/IBook";

export default function ProductsPage() {   

    const dispatch = useAppDispatch();
    const books = useAppSelector(selectAllBooks);
    const {status, isLoaded} = useAppSelector(state => state.book);
    const [openModal, setOpenModal] = useState(false);
    const [editBook, setEditBook] = useState<IBook | null>(null);

    const handleEdit = (id: number) => {
    const bookToEdit = books.find(b => b.id === id);
    if (!bookToEdit) {
        console.error("Kitap bulunamadı:", id);
        return;
    }
    setEditBook(bookToEdit); 
    setOpenModal(true);       
};
    const handleDelete = (id: number) => {
        console.log("Delete book:", id);
    };

    const handleAdd = () => {
    setEditBook(null);        
    setOpenModal(true);
};

    useEffect(() => {
        if(!isLoaded) dispatch(fetchBooks());
    }, [dispatch, isLoaded]);

    if(status === "pendingFetchBooks") {
        return <CircularProgress/>;
    }

    const columns: GridColDef[] = [
        {field: "id", headerName: "ID", width:80},
        { field: "title", headerName: "Kitap Adı", flex: 1 },
        { field: "authorName", headerName: "Yazar", width: 180 },
        { field: "categoryName", headerName: "Kategori", width: 180 },
        { field: "price", headerName: "Fiyat", width: 120, type: "number" },
        { field: "stock", headerName: "Stok", width: 120, type: "number" },
        {
            field: "actions",
            type:"actions",
            headerName: "İşlemler",
            width: 120,
            getActions: (params) => [
            <GridActionsCellItem
                icon={<EditIcon />}
                label="Düzenle"
                onClick={() => handleEdit(params.id as number)}
            />,
            <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Sil"
                onClick={() => handleDelete(params.id as number)}
                showInMenu
            />
        ]
        }
    ];

    return(
        <Paper sx={{ height: 650, width: "100%", p: 2 }}>
            <Box
            sx={{
                display: "flex",
                justifyContent: "flex-end",
                mb: 2
            }}
        >
            <Button                
                startIcon={<AddIcon />}
                onClick={handleAdd}
                sx={{
                                    color: "#78350F",
                                    "&:hover": {
                                        backgroundColor: "#FEF3C7"
                                    },
                                    "&.active": {
                                        backgroundColor: "#FDE68A",
                                        fontWeight: "bold"
                                    }
                                }}
            >
                Kitap Ekle
            </Button>
        </Box>
            <DataGrid
                rows={books}
                columns={columns}
                getRowId={(row) => row.id}
                pageSizeOptions={[5, 10, 20]}
                sx={{ border: 0 }}/>

                <BookAddModal
    open={openModal}
    onClose={() => setOpenModal(false)}
    book={editBook} 
/>
            </Paper>
    );
}