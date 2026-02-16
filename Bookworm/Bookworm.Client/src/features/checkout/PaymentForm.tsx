import { Grid, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";

export default function PaymentForm() {
    const {formState:{errors}, register} = useFormContext();
    return(
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                    {...register("cardname", { required: "Card name is required" })}
                    label="Enter card name"
                    fullWidth autoFocus
                    sx={{ mb: 2 }}
                    size="small"
                    error={!!errors.card_name}></TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                    {...register("cardnumber", { required: "Card number is required" })}
                    label="Enter card number"
                    fullWidth autoFocus
                    sx={{ mb: 2 }}
                    size="small"
                    error={!!errors.card_number}></TextField>
            </Grid>

            <Grid size={{xs: 6 , md: 4}}>
                 <TextField 
                    {...register("cardexpiremonth", {required: "Expiry month is required"})}
                    label="Enter expiry month" 
                    fullWidth 
                    sx={{mb: 2}} 
                    size="small"
                    error={!!errors.cardexpiremonth}></TextField>
            </Grid>

            <Grid size={{xs: 6 , md: 4}}>
                 <TextField 
                    {...register("cardexpireyear", {required: "Expiry year is required"})}
                    label="Enter expiry year" 
                    fullWidth 
                    sx={{mb: 2}} 
                    size="small"
                    error={!!errors.cardexpireyear}></TextField>
            </Grid>

            <Grid size={{ xs: 6, md: 4 }}>
                <TextField
                    {...register("cardcvv", { required: "Cvv is required" })}
                    label="Enter cvv"
                    fullWidth autoFocus
                    sx={{ mb: 2 }}
                    size="small"
                    error={!!errors.card_cvv}></TextField>
            </Grid>            
        </Grid>
    );
}