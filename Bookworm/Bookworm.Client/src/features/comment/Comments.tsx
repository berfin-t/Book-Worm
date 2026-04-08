import { Fragment, useEffect, useState } from "react";
import { Avatar, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, List, ListItem, ListItemAvatar, ListItemText, Paper, Rating, TextField, Typography } from "@mui/material";
import { AddComment as AddCommentIcon, Comment as CommentIcon } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { addComment, deleteComment, fetchCommentsByBook, updateComment } from "./commentSlice";
import { useNavigate } from "react-router-dom";
import type { IComment } from "../../model/IComment";

interface Props {
    bookId: number;
}

export default function Comments({ bookId }: Props) {

    const dispatch = useAppDispatch();
    const { comments, status } = useAppSelector(state => state.comment);
    const { ratings } = useAppSelector(state => state.rating);

    const navigate = useNavigate();
    const user = useAppSelector(state => state.account?.user ?? null);

    const [open, setOpen] = useState(false);
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [editTarget, setEditTarget] = useState<IComment | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<IComment | null>(null);    

    useEffect(() => {
        if (bookId) dispatch(fetchCommentsByBook(bookId));
    }, [bookId, dispatch]);

    // Add Commment Handlers
    const handleAddCommentClick = () => {
        if(!user) {
            navigate("/login");
            return;
        }
        setOpen(true);
    };

    // Edit Comment Handlers
    const handleEditComment = (comment: IComment) => {
        setEditTarget(comment);
        setContent(comment.content);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setContent("");
    };

    const handleSubmit = async () => {
        if (!content.trim()) return;
        setSubmitting(true);
        try {
            if(editTarget) {
                await dispatch(updateComment({ commentId: editTarget.id, content })).unwrap();
            } else {
                await dispatch(addComment({ bookId, content })).unwrap();
            }            
            dispatch(fetchCommentsByBook(bookId));
            setContent("");
            handleClose();
        } catch (error) {
            console.error("Yorum eklenirken hata oluştu:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteComment = async () => {
        if(deleteTarget === null) return;;
        try {
            await dispatch(deleteComment({ commentId: deleteTarget.id })).unwrap();
        } catch (error) {
            console.error("Yorum silinirken hata oluştu:", error);
        } finally {
            setDeleteTarget(null);
        }
    };

    if (status === "pendingFetchComments") return <CircularProgress />;

    return (
        <Grid size={{ xs: 12 }}>
            <Divider sx={{ mb: 2 }} />

            {/* Başlık + Buton */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                Yorumlar ({comments?.length ?? 0})
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddCommentIcon />}
                    onClick={handleAddCommentClick}
                    size="small"
                    sx={{
                                    mt: 1,
                                    backgroundColor: "#F59E0B",
                                    fontWeight: "bold",
                                    "&:hover": {
                                        backgroundColor: "#D97706"
                                    },
                                }}
                >
                    Yorum Yap
                </Button>
            </Box>   

            {/* Yorum Listesi */}
            {comments && comments.length > 0 ? (
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <List>
                        {comments.map((comment, index) => {
                            const userRating = ratings.find(r => r.userName === comment.userName);
                            return (
                                <Fragment key={comment.id}>
                                    <ListItem alignItems="flex-start">
                                        {comment.userFullName === user?.name && (
                                            <Box sx={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 1 }}>
                                                <Button size="small" onClick={() => handleEditComment(comment)}>Düzenle</Button>
                                                <Button size="small" color="error" onClick={() => setDeleteTarget(comment)}>Sil</Button>
                                            </Box>
                                        )}
                                        <ListItemAvatar>
                                            <Avatar>
                                                <CommentIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography variant="subtitle2" fontWeight="bold" color="primary">
                                                    {comment.userFullName ?? comment.userName}
                                                </Typography>
                                            }
                                            secondary={
                                                <>
                                                    {userRating ? (
                                                        <Rating
                                                            value={userRating.score}
                                                            readOnly
                                                            size="small"
                                                            sx={{ mb: 0.5 }}
                                                        />
                                                    ) : (
                                                        <Typography variant="caption" color="text.disabled" display="block" sx={{ mb: 0.5 }}>
                                                            Puan verilmemiş
                                                        </Typography>
                                                    )}
                                                    <Typography variant="body2" color="text.primary">
                                                        {comment.content}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {new Date(comment.createdAt).toLocaleDateString("tr-TR")}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    {index < comments.length - 1 && <Divider variant="inset" component="li" />}
                                </Fragment>
                            );
                        })}
                    </List>
                </Paper>
            ) : (
                <Typography color="text.secondary">Henüz yorum yapılmamış.</Typography>
            )}

            {/* Yorum Ekleme Dialogu */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Yorum Ekle</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        multiline
                        rows={4}
                        fullWidth
                        label="Yorumunuz"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={submitting}>İptal</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={!content.trim() || submitting}
                    >
                        {submitting ? <CircularProgress size={20} /> : "Gönder"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Silme Onay Dialog */}
            <Dialog open={deleteTarget !== null} onClose={() => setDeleteTarget(null)}>
                <DialogTitle>Yorumu Sil</DialogTitle>
                <DialogContent>
                    <Typography>Bu yorumu silmek istediğinizden emin misiniz?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteTarget(null)}>İptal</Button>
                    <Button onClick={handleDeleteComment} color="error" variant="contained">
                        Sil
                    </Button>
                </DialogActions>
            </Dialog>

        </Grid>
    );
}