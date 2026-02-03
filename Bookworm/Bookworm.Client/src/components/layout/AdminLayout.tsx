import { AppBar, Box, Button, Container, Menu, MenuItem, Stack, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { KeyboardArrowDown } from "@mui/icons-material";
import { useState } from "react";
import { logout } from "../../features/account/accountSlice";

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

export default function AdminLayout() {

    const {user} =useAppSelector(state => state.account);
    const isAdmin = user?.roles?.includes("Admin"); 
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const dispatch = useAppDispatch();   
    

    function handleClick(event: React.MouseEvent<HTMLElement>) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    return(
        <AppBar position="static"
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
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center" }}>                           
                                                {
                                                    isAdmin ? (
                                                        <>
                                                            <Button id="user-button" onClick={handleClick} endIcon={<KeyboardArrowDown />} sx={buttonStyles}>{user?.name}</Button>
                            
                                                            <Menu id="user-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
                                                                
                                                                <MenuItem
                                                                    onClick={() => {
                                                                        handleClose();
                                                                        dispatch(logout());                                                                        
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