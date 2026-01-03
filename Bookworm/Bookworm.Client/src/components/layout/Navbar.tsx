import { AppBar, Badge, Box, Button, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAppSelector } from "../../hooks/hooks";

const links = [
    { title: "Home", to: "/" },
    { title: "Books", to: "/books" },
    { title: "Authors", to: "/authors" },
]

const buttonStyles = {
    color: "inherit",
    textDecoration: "none",
    "&:hover": {
        color: "text.primary"
    },
    "&.active": {
        color: "warning.main"
    }
}
export default function Navbar() {

    const { cart } = useAppSelector(state => state.cart);
    const itemCount = cart?.cartItems.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

    return (
        <AppBar position="static" sx={{ width: "100%", backgroundColor: "#47008F" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h6">Book Worm</Typography>

                    <Stack direction="row">
                        {links.map(link =>
                            <Button key={link.to} component={NavLink} to={link.to} sx={buttonStyles}>{link.title}</Button>
                        )}
                            </Stack>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}> 
                    <IconButton component={NavLink} to="/cart"
                        size="large" edge="start" color="inherit">
                        <Badge badgeContent={itemCount} color="secondary">
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
