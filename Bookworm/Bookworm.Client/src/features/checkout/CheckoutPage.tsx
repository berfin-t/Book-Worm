import { Box, Button, Grid, Paper, Step, StepLabel, Stepper } from "@mui/material";
import Info from "./Info";
import { useState } from "react";
import { ChevronLeftRounded, ChevronRightRounded } from "@mui/icons-material";
import { useForm, type FieldValues, FormProvider } from "react-hook-form";
import AddressForm from "./AddressForm";

const steps = ["Teslimat Bilgileri", "Ödeme", "Sipariş Özeti"];

function getStepContent(step: number) {
    switch (step) {
        case 0:
            return <AddressForm />;
        case 1:
            return
        case 2:
            return
        default:
            throw new Error("Bilinmeyen bir step");
    }
}
export default function CheckoutPage() {
    const [activeStep, setActiveStep] = useState(0);
    const methods = useForm();
    function handleNext(data: FieldValues) {
        console.log(data);
        setActiveStep(activeStep + 1);
    }
    function handlePrevious() {
        setActiveStep(activeStep - 1);
    }

    return (
        <FormProvider {...methods }>
            <Paper sx={{ mx: "auto", mt: 4 }}>
                <Grid container sx={{ p: 4 }} spacing={2 }>
                    <Grid size={4 }>
                    <Info />
                    </Grid>
                    <Grid size={8 }>
                        <Box>
                            <Stepper activeStep={activeStep} sx={{height:40} }>
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                        </Step>
                                )) }
                            </Stepper>
                        </Box>
                        <Box>
                            {activeStep === steps.length ? (
                                <h2>Sipariş tamamlandı.</h2>
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
                                                        onClick={handlePrevious}>Geri</Button>
                                                }

                                                <Button startIcon={<ChevronRightRounded />} variant="contained"
                                                    onClick={handleNext}>İleri</Button>
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