import { Grid, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";

export default function () {
    const { register, formState: { errors } } = useFormContext();

    return (        
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                    {...register("firstname", { required: "firstname is required" })}
                    label="Enter firstname"
                    fullWidth autoFocus
                    sx={{ mb: 2 }}
                    size="small"
                    error={!!errors.firstname}></TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                    {...register("lastname", { required: "lastname is required" })}
                    label="Enter Lastname"
                    fullWidth autoFocus
                    sx={{ mb: 2 }}
                    size="small"
                    error={!!errors.lastname}></TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                    {...register("phone", { required: "phone is required" })}
                    label="Enter phone"
                    fullWidth autoFocus
                    sx={{ mb: 2 }}
                    size="small"
                    error={!!errors.phone}></TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                    {...register("city", { required: "city is required" })}
                    label="Enter city"
                    fullWidth autoFocus
                    sx={{ mb: 2 }}
                    size="small"
                    error={!!errors.city}></TextField>
            </Grid>

            <Grid size={{ xs: 12 }}>
                <TextField
                    {...register("addressline", { required: "addressline is required" })}
                    label="Enter addressline"
                    fullWidth multiline
                    rows={4}
                    sx={{ mb: 2 }}
                    size="small"
                    error={!!errors.addressline}></TextField>
            </Grid>
        </Grid>
    );
}