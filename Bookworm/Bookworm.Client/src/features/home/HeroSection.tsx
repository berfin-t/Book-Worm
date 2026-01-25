import { Box, Button, Container, Typography } from "@mui/material";
import heroSection from "../../assets/images/HeroSection.svg";
import { Link } from "react-router-dom";

export default function HeroSection() {
    return(
        <>
        <Box sx={{mt:"auto", minHeight:500, display:"flex", alignItems:"center"}}>
            <Container>
                <Box display="grid"
                 alignItems="center"
                 gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
                 gap={2}>
                    <Box>
                        <Typography variant="h3" gutterBottom fontWeight="bold">
                            Discover Your Next <br /> Great Read
                        </Typography>
                        <Typography color="text-secondary" mb={3}>
                            Thousands of books, one perfect story for you.
                        </Typography>
                        <Button variant="contained" component={Link} to="/books"
                        sx={{
                            backgroundColor: "#F59E0B",
                                fontWeight: "bold",
                                "&:hover": {
                                        backgroundColor: "#D97706"
                                    }
                        }}>Discover Books</Button>
                    </Box>
                    <Box display="flex" justifyContent="center">
                        <Box  component="img" src={heroSection} alt="Books" width="100%" maxWidth={420}/>
                    </Box>
                </Box>
            </Container>
        </Box>
        </>
    );
}