import { Box, Card, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import requests from "../../../api/requests";

interface DashboardStats {
    totalOrders: number;
    todaysOrders: number;
    totalUsers: number;
    pendingOrders: number;
    totalRevenue: number;
}

export default function Boxes() {

  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    requests.Order.stats()
        .then((data) => {
            console.log("Gelen veri:", data);
            setStats(data);
        })
        .catch((err) => console.error("Fetch hatası:", err));
}, []);

    return(
      <>
      <Box sx={{ flexGrow: 1, p: 3 }}>
    <Grid container spacing={4}>
  <Grid size={{xs:12, sm:6, md:3}}>
    <Card sx={{ p: 2 }}>
      <Typography variant="subtitle1">
        Toplam Sipariş Sayısı: {stats?.totalOrders ?? 0}
      </Typography>
    </Card>
  </Grid>

  <Grid size={{xs:12, sm:6, md:3}}>
    <Card sx={{ p: 2 }}>
      <Typography variant="subtitle1">
        Bugünkü Sipariş Sayısı: {stats?.todaysOrders ?? 0}
      </Typography>
    </Card>
  </Grid>

  <Grid size={{xs:12, sm:6, md:3}}>
    <Card sx={{ p: 2 }}>
      <Typography variant="subtitle1">
        Toplam Kullanıcı Sayısı: {stats?.totalUsers ?? 0}
      </Typography>
    </Card>
  </Grid>

  <Grid size={{xs:12, sm:6, md:3}}>
    <Card sx={{ p: 2 }}>
      <Typography variant="subtitle1">
        Bekleyen Sipariş Sayısı: {stats?.pendingOrders ?? 0}
      </Typography>
    </Card>
  </Grid>  

  <Grid size={{xs:12, sm:6, md:3}}>
    <Card sx={{ p: 2 }}>
      <Typography variant="subtitle1">
        Toplam Gelir Miktarı: {stats?.totalRevenue ?? 0} ₺
      </Typography>
    </Card>
  </Grid>

</Grid>
</Box>
      </>
    );
}