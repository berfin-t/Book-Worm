import { Card, Typography } from "@mui/material";

export default function DashboardPage() {
    return(
        <Card sx={{ p: 3}}>
      <Typography variant="h5" gutterBottom>
        Bugünkü Sipariş Sayısı: 0
      </Typography>
      </Card>
    );
}