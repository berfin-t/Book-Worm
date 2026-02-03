import { AppBar,Badge,Box,Button,Container,IconButton,MenuItem,Stack,Toolbar,Menu, Typography} from "@mui/material";
import { NavLink } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { logout } from "../../features/account/accountSlice";
import { useAppSelector, useAppDispatch } from "../../store/store";
import { clearCart } from "../../features/cart/cartSlice";
import { useState } from "react";
import { KeyboardArrowDown } from "@mui/icons-material";

const links = [
    { title: "Home", to: "/"},
    { title: "Books", to: "/books" },
    { title: "Authors", to: "/authors" },
];

const authedLinks = [
    { title: "Register", to: "/register" },
    { title: "Login", to: "/login" },
];

const buttonStyles = {
    color: "#FFF7ED", 
    textDecoration: "none",
    fontWeight: 500,
    "&:hover": {
        color: "#FEF3C7", 
        backgroundColor: "rgba(0,0,0,0.05)",
    },
    "&.active": {
        color: "#78350F", 
        fontWeight: "bold",
    },
};

export default function UserLayout() {
    const { cart } = useAppSelector(state => state.cart);
    const { user } = useAppSelector(state => state.account);
    const dispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const itemCount =
        cart?.cartItems.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

    function handleClick(event: React.MouseEvent<HTMLElement>) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    return (
        <AppBar
            position="static"
            sx={{
                width: "100%",
                backgroundColor: "#F59E0B" 
            }}
        >
            <Container maxWidth="lg">
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "#FFF7ED" }}
                    >
                        Bookworm
                    </Typography>

                    <Stack direction="row">
                        {links.map((link) => (
                            <Button
                                key={link.to}
                                component={NavLink}
                                to={link.to}
                                sx={buttonStyles}
                            >
                                {link.title}
                            </Button>
                        ))}
                    </Stack>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton component={NavLink} to="/cart" color="inherit">
                        <Badge
                            badgeContent={itemCount}
                            sx={{
                                "& .MuiBadge-badge": {
                                    backgroundColor: "#78350F", 
                                    color: "#FFF7ED",
                                },
                            }}
                        >
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton>

                    {
                        user ? (
                            <>
                                <Button id="user-button" onClick={handleClick} endIcon={<KeyboardArrowDown />} sx={buttonStyles}>{user.name}</Button>

                                <Menu id="user-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
                                    <MenuItem component={NavLink} to="/orders" onClick={handleClose}>
                                        Orders
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => {
                                            handleClose();
                                            dispatch(logout());
                                            dispatch(clearCart());
                                        }}
                                    >
                                        Logout
                                    </MenuItem>
                                </Menu>
                                        
                            </>
                        ) : (
                                <Stack direction="row">
                                    {authedLinks.map(link =>
                                        <Button key={link.to} component={NavLink} to={link.to} sx={buttonStyles}>{link.title}</Button>
                                    )}
                                </Stack>
                        )
                    }

                </Box>
            </Toolbar>
            </Container>
        </AppBar>
    );
}
