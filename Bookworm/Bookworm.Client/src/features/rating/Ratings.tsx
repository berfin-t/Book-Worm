import { useEffect, useState } from "react";
import {
    Alert, Box, CircularProgress, Dialog, DialogActions, DialogContent,
    DialogTitle, Divider, Grid, IconButton, Button, Rating as MuiRating,
    Snackbar, Typography
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { addRating, deleteRating, fetchRatingsByBook, updateRating } from "./ratingSlice";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from "react-router";

interface Props {
    bookId: number;
}

const scoreLabels: Record<number, string> = {
    1: "Çok Kötü", 2: "Kötü", 3: "Orta", 4: "İyi", 5: "Çok İyi"
};

export default function Rating({ bookId }: Props) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { ratings, status } = useAppSelector(state => state.rating);
    const currentUser = useAppSelector(state => state.account?.user ?? null);  
    
    const [hoverScore, setHoverScore] = useState<number | null>(null);
    const [localScore, setLocalScore] = useState<number | null>(null);

    const myRating = ratings.find(r => r.userFullName === currentUser?.name) ?? null;
    const effectiveRating = myRating?.score ?? localScore ?? 0;

    // Edit dialog
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editScore, setEditScore] = useState<number>(0);
    const [editHover, setEditHover] = useState<number | null>(null);

    // Delete confirm
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // Snackbar
    const [snack, setSnack] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false, message: "", severity: "success"
    });

    useEffect(() => {
    if (!bookId) {
        navigate("/login");
        return;
    }
    dispatch(fetchRatingsByBook(bookId));
}, [bookId, dispatch]);

    const averageScore = ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length
        : 0;

    const handleInlineRate = async (val: number | null) => {
        if (!val || val <= 0) return;
        setLocalScore(val);
        try {
            await dispatch(addRating({ bookId, score: val })).unwrap();
            dispatch(fetchRatingsByBook(bookId)); 
            setSnack({ open: true, message: "Puan eklendi.", severity: "success" });
        } catch {
            setSnack({ open: true, message: "Bir hata oluştu.", severity: "error" });

            setLocalScore(null);
        }
    };

    const openEdit = (id: number, currentScore: number) => {
        setEditingId(id);
        setEditScore(currentScore);
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setEditingId(null);
        setEditScore(0);
        setEditHover(null);
        dispatch(fetchRatingsByBook(bookId));
    };

    const handleUpdate = async () => {
        if (!editScore || editingId === null) return;
        try {
            await dispatch(updateRating({ ratingId: editingId, score: editScore })).unwrap();
            setSnack({ open: true, message: "Puan güncellendi.", severity: "success" });
            closeDialog();
        } catch {
            setSnack({ open: true, message: "Bir hata oluştu.", severity: "error" });
        }
    };

    const openConfirmDelete = (id: number) => {
        setDeletingId(id);
        setConfirmOpen(true);
    };

    const handleDelete = async () => {
        if (deletingId === null) return;
        try {
            await dispatch(deleteRating({ ratingId: deletingId })).unwrap();
            setSnack({ open: true, message: "Puan silindi.", severity: "success" });
        } catch {
            setSnack({ open: true, message: "Silme başarısız.", severity: "error" });
        } finally {
            setConfirmOpen(false);
            setDeletingId(null);
        }
    };

    const displayInline = hoverScore ?? 0;

    if (status === "pendingFetchRatings") return <CircularProgress />;

    return (
        <>
            <Grid size={{ xs: 12 }}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Puanlar ({ratings.length})
                </Typography>

                <Box display="flex" flexDirection="column" gap={1}>
                    {/* Ortalama puan */}
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

                    {/* Kendi puanı varsa göster / yoksa inline puan ver */}
                    {effectiveRating != null ? (
                        <Box display="flex" alignItems="center" gap={1}>
                            <MuiRating value={effectiveRating ?? 0} readOnly size="small" />
                            <Typography variant="body2" color="text.secondary">
                                Sizin puanınız: {effectiveRating} / 5
                            </Typography>
                            {myRating && (
                                <>
                                <IconButton size="small" color="primary"
                                onClick={() => openEdit(myRating.id, myRating.score)}
                                disabled={status === "pendingUpdateRating"}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="error"
                                onClick={() => openConfirmDelete(myRating.id)}
                                disabled={status === "pendingDeleteRating"}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                                </>
                            )}                          
                            
                        </Box>
                    ) : (
                        <Box display="flex" alignItems="center" gap={1}>
                            <MuiRating
                                defaultValue={0}
                                onChange={(_e, val) => handleInlineRate(val)}
                                onChangeActive={(_e, val) => setHoverScore(val < 1 ? null : val)}
                                size="small"
                                disabled={status === "pendingAddRating"}
                                emptyIcon={<StarIcon style={{ opacity: 0.4 }} fontSize="inherit" />}
                            />
                            {status === "pendingAddRating"
                                ? <CircularProgress size={16} />
                                : <Typography variant="body2" color="text.secondary">
                                    {displayInline > 0 ? scoreLabels[displayInline] : "Puanlamak için tıklayın"}
                                  </Typography>
                            }
                        </Box>
                    )}
                </Box>
            </Grid>

            {/* Düzenle Dialog */}
            <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="xs" fullWidth>
                <DialogTitle>Puanı Düzenle</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" alignItems="center" gap={1} pt={1}>
                        <MuiRating
                            value={editScore}
                            onChange={(_e, val) => setEditScore(val ?? 0)}
                            onChangeActive={(_e, val) => setEditHover(val < 1 ? null : val)}
                            size="large"
                            emptyIcon={<StarIcon style={{ opacity: 0.4 }} fontSize="inherit" />}
                        />
                        {(editHover ?? editScore) > 0 && (
                            <Typography variant="body2" color="text.secondary">
                                {scoreLabels[editHover ?? editScore]}
                            </Typography>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>İptal</Button>
                    <Button variant="contained" onClick={handleUpdate}
                        disabled={editScore === 0 || status === "pendingUpdateRating"}>
                        Güncelle
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Silme Onayı */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Puanı Sil</DialogTitle>
                <DialogContent>
                    <Typography>Bu puanı silmek istediğinizden emin misiniz?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>İptal</Button>
                    <Button variant="contained" color="error" onClick={handleDelete}
                        disabled={status === "pendingDeleteRating"}>
                        Sil
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snack.open} autoHideDuration={3000}
                onClose={() => setSnack(s => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity={snack.severity} variant="filled"
                    onClose={() => setSnack(s => ({ ...s, open: false }))}>
                    {snack.message}
                </Alert>
            </Snackbar>
        </>
    );
}