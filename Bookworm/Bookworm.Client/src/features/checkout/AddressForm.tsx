import { Grid, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";

export default function () {
    const { register, formState: { errors } } = useFormContext();

    return (        
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                    {...register("firstName", { required: "firstname is required" })}
                    label="Enter firstname"
                    fullWidth autoFocus
                    sx={{ mb: 2 }}
                    size="small"
                    error={!!errors.firstName}></TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                    {...register("lastName", { required: "lastname is required" })}
                    label="Enter Lastname"
                    fullWidth autoFocus
                    sx={{ mb: 2 }}
                    size="small"
                    error={!!errors.lastName}></TextField>
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
                    {...register("addresLine", { required: "addresline is required" })}
                    label="Enter addresline"
                    fullWidth multiline
                    rows={4}
                    sx={{ mb: 2 }}
                    size="small"
                    error={!!errors.addresLine}></TextField>
            </Grid>
        </Grid>
    );
}