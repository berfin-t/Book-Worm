import { AppBar,Badge,Box,Button,IconButton,Stack,Toolbar,Typography} from "@mui/material";
import { NavLink } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { logout } from "../../features/account/accountSlice";
import { useAppSelector, useAppDispatch } from "../../store/store";

const links = [
    { title: "Home", to: "/" },
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

export default function Navbar() {
    const { cart } = useAppSelector(state => state.cart);
    const { user } = useAppSelector(state => state.account);
    const dispatch = useAppDispatch();

    const itemCount =
        cart?.cartItems.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

    return (
        <AppBar
            position="static"
            sx={{
                width: "100%",
                backgroundColor: "#F59E0B" 
            }}
        >
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
                            <Stack direction="row">
                                <Button sx={buttonStyles}>{user.name}</Button>
                                <Button sx={buttonStyles} onClick={() => dispatch(logout())}>Log Out</Button>
                            </Stack>
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
        </AppBar>
    );
}
