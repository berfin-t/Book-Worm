import { Grid, Paper } from "@mui/material";
import Info from "./Info";

export default function CheckoutPage() {
    return (
        <>
            <Paper sx={{mx:"auto", mt:4}}>
            <Grid>
                <Grid>
                        <Info />
                    </Grid>
            </Grid>
        </Paper >
        </>
    );
}