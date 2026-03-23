import { useEffect } from "react";
import { Avatar, CircularProgress, Divider, Grid, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from "@mui/material";
import { Comment as CommentIcon } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { fetchCommentsByBook } from "./commentSlice";

interface Props {
    bookId: number;
}

export default function Comments({ bookId }: Props) {

    const dispatch = useAppDispatch();
    const { comments, status } = useAppSelector(state => state.comment);

    useEffect(() => {
        if (bookId) dispatch(fetchCommentsByBook(bookId));
    }, [bookId, dispatch]);

    if (status === "pendingFetchComments") return <CircularProgress />;

    return (
        <Grid size={{ xs: 12 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2 }}>
                Yorumlar ({comments?.length ?? 0})
            </Typography>

            {comments && comments.length > 0 ? (
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <List>
                        {comments.map((comment, index) => (
                            <>
                                <ListItem key={comment.id} alignItems="flex-start">
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
                            </>
                        ))}
                    </List>
                </Paper>
            ) : (
                <Typography color="text.secondary">Henüz yorum yapılmamış.</Typography>
            )}
        </Grid>
    );
}