import Box from "@mui/material/Box";
import Boxes from "./Boxes";
import LowStockBooks from "./LowStockBooks";
import PendingOrders from "./PendingOrders";

export default function DashboardPage() {
    return(
      <>
      <Boxes/>
      <Box
        sx={{
          display: "flex",
          gap: 3,
          mt: 3
        }}
      >
        <Box sx={{ flex: 1 }}>
          <PendingOrders />
        </Box>

        <Box sx={{ flex: 1 }}>
          <LowStockBooks />
        </Box>
      </Box>
      </>
    );
}