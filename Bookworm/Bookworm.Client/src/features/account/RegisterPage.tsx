import { LoadingButton } from "@mui/lab";
import { Box, Card, CardContent, TextField, Typography } from "@mui/material";
import { motion } from "framer-motion";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useForm, type FieldValues } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import requests from "../../api/requests";
import { toast } from "react-toastify";

export default function RegisterPage() {

    const navigate = useNavigate();

    const { register, handleSubmit, setError, formState: { isSubmitting, errors } } = useForm({
        defaultValues: {
            username: '',
            name: '',
            email:'',
            password: ''
        }
    });

    async function submitForm(data: FieldValues) {
        requests.Account.register(data)
            .then(() => {
                toast.success("user created.");
                navigate("/login")
            }).catch(result => {
                const { data: errors } = result;

                errors.forEach((error: any) => {
                    if (error.code == "DuplicateUserName") {
                        setError("username", { message: error.description });
                    }
                    else if (error.code == "DuplicateEmail") {
                        setError("email", { message: error.description })
                    }
                });
            });
    }

    return (
        <Box sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}>

                <Card sx={{
                    width: 380,
                    borderRadius: 4,
                    boxShadow: 6
                }}>

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

                        <Box component="form" onSubmit={handleSubmit(submitForm)}
                            sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

                            <TextField
                                {...register("username", { required: "username is required" })}
                                label="Enter User Name"
                                type="username"
                                fullWidth
                                error={!!errors.username}
                                helperText={errors.username?.message}>
                            </TextField>

                            <TextField
                                {...register("name", { required: "name is required" })}
                                autoFocus
                                label="Enter Name"
                                type="name"
                                fullWidth
                                error={!!errors.name}
                                helperText={errors.name?.message}>
                            </TextField>

                            <TextField
                                {...register("email", {
                                    required: "email is required",
                                    pattern: {
                                        value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                        message: "email is not valid"
                                    }
                                })}
                                label="Enter E-mail"
                                type="email"                                
                                fullWidth
                                error={!!errors.email}
                                helperText={errors.email?.message}>
                            </TextField>

                            <TextField
                                {...register("password", {
                                    required: "password is required", minLength: {
                                        value: 6,
                                        message: "Min length is 6 characters"
                                    }
                                })}
                                label="Enter Password"
                                type="password"
                                fullWidth
                                error={!!errors.password}
                                helperText={errors.password?.message }>
                            </TextField>

                            <LoadingButton
                                loading={isSubmitting}
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{
                                    mt: 1,
                                    backgroundColor: "#F59E0B",
                                    fontWeight: "bold",
                                    "&:hover": {
                                        backgroundColor: "#D97706"
                                    },
                                }}>Register

                            </LoadingButton>

                        </Box>                       

                    </CardContent>

                </Card>

            </motion.div>

        </Box>
    );
}