import { Divider, Grid, List, ListItem, ListItemText, Typography } from "@mui/material";
import type { ICategory } from "../../model/ICategory";

interface Props {
    category: ICategory[];
}

export default function CategorySidebar({ category }: Props) {
    return (
        <>
            <Grid container spacing={2} sx={{pt:4} }>
                <Typography variant="h6" gutterBottom>
                    Kategoriler
                </Typography>
                <Divider />
                <List>
                    {category.map(cat => (
                        <ListItem key={cat.id}>
                            <ListItemText
                                primary={cat.name}
                                secondary={`${cat.bookCount} ürün`}
                            />
                        </ListItem>
                    ))}
                </List></Grid>
            
        </>
    );
}