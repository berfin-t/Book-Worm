import { useState } from "react";
import { motion } from "framer-motion";
import { Box, Button, Card, CardContent, TextField, Typography} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");    

    return (

        <Box sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"}}>
            <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}>

            <Card sx={{
                width: 380,
                borderRadius: 4,
                    boxShadow: 6}}>

                    <CardContent sx={{ p: 4 }}>

                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            mb: 3
                        }}>

                            <Box sx={{ backgroundColor: "#F59E0B", p: 1.5, borderRadius: "50%", mb: 1.5 }}>

                                <MenuBookIcon sx={{ color: "white" }} />

                            </Box>

                            <Typography variant="h5" fontWeight="bold">Bookworm</Typography>

                            <Typography variant="body2" color="text.secondary">Giriş Yap</Typography>

                        </Box>

                        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

                        <TextField label="E-posta"
                            type="email"
                            required
                            fullWidth>
                        </TextField>

                        <TextField label="Password"
                            type="password"
                            required
                            fullWidth>
                        </TextField>

                        <Button type="submit"
                                variant="contained"
                                fullWidth
                                sx={{
                                mt: 1,
                                backgroundColor: "#F59E0B",
                                fontWeight: "bold",
                                "&:hover": {
                                        backgroundColor: "#D97706"
                                    },
                                }}>Gİrİş Yap

                            </Button>

                        </Box>

                        <Box sx={{ textAlign: "center", mt: 3 }}>

                                        <Typography
                                            component="a"
                                            href="/register"
                                            sx={{
                                                fontSize: 14,
                                                color: "#B45309",
                                                textDecoration: "none",
                                                "&:hover": { textDecoration: "underline" },
                                            }}
                                        >
                                            Hesabın yok mu? Kayıt ol
                            </Typography>

                        </Box>

                    </CardContent>

                </Card>

            </motion.div>

        </Box>        
    );
}
