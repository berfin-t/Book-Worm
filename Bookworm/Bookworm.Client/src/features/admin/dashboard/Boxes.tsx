import { Box, Card, Grid, Typography } from "@mui/material";

export default function Boxes() {
    return(
      <>
      <Box sx={{ flexGrow: 1, p: 3 }}>
    <Grid container spacing={5}>
  <Grid sx={{xs:12, sm:6, md:3}}>
    <Card sx={{ p: 2 }}>
      <Typography variant="subtitle1">
        Toplam Satış Sayısı: 0
      </Typography>
    </Card>
  </Grid>

  <Grid sx={{xs:12, sm:6, md:3}}>
    <Card sx={{ p: 2 }}>
      <Typography variant="subtitle1">
        Bugünkü Sipariş Sayısı: 0
      </Typography>
    </Card>
  </Grid>

  <Grid sx={{xs:12, sm:6, md:3}}>
    <Card sx={{ p: 2 }}>
      <Typography variant="subtitle1">
        Toplam Kullanıcı Sayısı: 0
      </Typography>
    </Card>
  </Grid>

  <Grid sx={{xs:12, sm:6, md:3}}>
    <Card sx={{ p: 2 }}>
      <Typography variant="subtitle1">
        Bekleyen Sipariş Sayısı: 0
      </Typography>
    </Card>
  </Grid>  
</Grid>
</Box>
      </>
    );
}