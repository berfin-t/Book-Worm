import {Box, Button, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, Typography} from "@mui/material";
import { NavLink, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { logout } from "../../features/account/accountSlice";

const drawerWidth = 240;

const links = [
  { title: "Dashboard", to: "dashboard" },
  { title: "ProductsPage", to: "products" }
];

export default function AdminLayout() {
    const { user } = useAppSelector(state => state.account);
    const isAdmin = user?.roles?.includes("Admin");
    const dispatch = useAppDispatch();

    if (!isAdmin) return null;

    return (
        <Box sx={{ display: "flex" }}>
            
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        backgroundColor: "#FFF7ED",
                        display: "flex",
                        flexDirection: "column",
                        borderRight: "1px solid #FDE68A"
                    }
                }}
            >
                
                <Box sx={{ p: 3 }}>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "#78350F" }}
                    >
                        Bookworm
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#78350F" }}>
                        Admin Panel
                    </Typography>
                </Box>

                <Divider sx={{ borderColor: "#FDE68A" }} />

                
                <List sx={{ flexGrow: 1 }}>
                    {links.map(link => (
                        <ListItem key={link.to} disablePadding>
                            <ListItemButton
                                component={NavLink}
                                to={link.to}
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
                                <ListItemText primary={link.title} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                <Divider sx={{ borderColor: "#FDE68A" }} />

                
                <Box sx={{ p: 2 }}>
                    <Typography
                        variant="body2"
                        sx={{ mb: 1, color: "#78350F", fontWeight: 500 }}
                    >
                        {user?.name}
                    </Typography>
                    <Button
                        fullWidth
                        variant="outlined"
                        sx={{
                            color: "#78350F",
                            borderColor: "#F59E0B",
                            "&:hover": {
                                backgroundColor: "#FEF3C7",
                                borderColor: "#F59E0B"
                            }
                        }}
                        onClick={() => dispatch(logout())}
                    >
                        Logout
                    </Button>
                </Box>
            </Drawer>
            
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    backgroundColor: "#FFF7ED",
                    minHeight: "100vh"
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}
