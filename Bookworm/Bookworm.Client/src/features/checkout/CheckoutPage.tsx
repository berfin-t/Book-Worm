import { Box, Button, Grid, Paper, Stack, Step, StepLabel, Stepper, Typography } from "@mui/material";
import Info from "./Info";
import { useState } from "react";
import { ChevronLeftRounded, ChevronRightRounded } from "@mui/icons-material";
import { useForm, type FieldValues, FormProvider } from "react-hook-form";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import Review from "./Review";
import { useAppDispatch } from "../../store/store";
import requests from "../../api/requests";
import { clearCart } from "../cart/cartSlice";
import { LoadingButton } from "@mui/lab";
import { Link } from "react-router-dom";

const steps = ["Teslimat Bilgileri", "Ödeme", "Sipariş Özeti"];

function getStepContent(step: number) {
    switch (step) {
        case 0:
            return <AddressForm />;
        case 1:
            return <PaymentForm/>;
        case 2:
            return <Review/>;
        default:
            throw new Error("Bilinmeyen bir step");
    }
}
export default function CheckoutPage() {

    const [activeStep, setActiveStep] = useState(0);
    const methods = useForm();
    const [orderId, setOrderId] = useState(0);
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();

    async function handleNext(data: FieldValues) {
        if(activeStep === 2) {
        setLoading(true);
        try {
                setOrderId(await requests.Order.create(data));
                setActiveStep(activeStep + 1);
                dispatch(clearCart());
                setLoading(false);
            }
            catch(error:any) {
            console.log(error);
            setLoading(false);
            }
        } else {
            setActiveStep(activeStep + 1);
        }
    }

    function handlePrevious() {
        setActiveStep(activeStep - 1);
    }

    return (
        <FormProvider {...methods }>
            <Paper sx={{ mx: "auto", mt: 4 }}>
                <Grid container sx={{ p: 4 }} spacing={2 }>
                    {activeStep !== steps.length && (
                    <Grid size={4 }>
                    <Info />
                    </Grid>
                    ) }
                    <Grid size={activeStep !== steps.length ? 8: 12 } sx={{p:3}}>
                        <Box>
                            <Stepper activeStep={activeStep} 
                            sx={{height:40} }>
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                        </Step>
                                )) }
                            </Stepper>
                        </Box>
                        <Box>
                            {activeStep === steps.length ? (
                                <Stack spacing={2}>
                                    <Typography variant="h1">📦</Typography>
                                    <Typography variant="h5">Teşekkür ederiz. Siparişinizi aldık</Typography>
                                    <Typography variant="body1" sx={{color: "text.secondary"}}>
                                        Sipariş numaranız <strong>#{orderId}</strong>. Siparişiniz onaylandığında size bir eposta göndereceğiz.
                                    </Typography>
                                    <Button 
                                    component={Link} to="/orders"
                                    sx={{alignSelf: "start", 
                                        width: {xs: "100%", sm: "auto"},
                                    backgroundColor: "#F59E0B",
                                                        fontWeight: "bold",
                                                        "&:hover": {
                                                        backgroundColor: "#D97706"
                                                            }}}                                    
                                    variant="contained">Siparişleri Listele</Button>
                                </Stack>                                 
                            ) : (                                
                                    <form onSubmit={methods.handleSubmit(handleNext)}>
                                        {getStepContent(activeStep)}
                                        <Box>

                                            <Box sx={
                                                [
                                                    {
                                                        display: "flex",
                                                        mt:3
                                                    },
                                                    activeStep !== 0
                                                        ? { justifyContent: "space-between" }
                                                        : { justifyContent: "flex-end" }
                                                ]
                                            }>
                                                {
                                                    activeStep !== 0 &&
                                                    <Button startIcon={<ChevronLeftRounded />} variant="contained"
                                                        onClick={handlePrevious}
                                                        sx={{
                                                        backgroundColor: "#F59E0B",
                                                        fontWeight: "bold",
                                                        "&:hover": {
                                                        backgroundColor: "#D97706"
                                                            },  
                                                        }}>Geri</Button>
                                                }
                                                <LoadingButton
                                                type="submit" 
                                                loading={loading}
                                                sx={{
                                                    backgroundColor: "#F59E0B",
                                                        fontWeight: "bold",
                                                        "&:hover": {
                                                        backgroundColor: "#D97706"
                                                            }, 
                                                }}
                                                startIcon={<ChevronRightRounded />} variant="contained">
                                                    {activeStep === 2 ? "Siparişi Tamamla":"Devam"}
                                            </LoadingButton>
                                            </Box>
                                        </Box>
                                    </form>                               
                            )}
                            </Box>
                    </Grid>
            </Grid>
        </Paper >
        </FormProvider>
    );
}