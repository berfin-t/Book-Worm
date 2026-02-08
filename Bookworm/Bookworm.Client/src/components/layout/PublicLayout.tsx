import { Outlet } from "react-router-dom";
import UserLayout from "./UserLayout";
import { Container } from "@mui/material";

export default function PublicLayout() {
  return (
    <>
      <UserLayout />   
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Outlet />
      </Container>      
    </>
  );
}