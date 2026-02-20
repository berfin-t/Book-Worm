import { Box, CircularProgress, Paper } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { useEffect } from "react";
import { fetchOrders, selectAllOrders } from "../../orders/orderSlice";

export const OrderStatusMap: Record<number, string> = {
  0: "Beklemede",
  1: "Ödeme Alındı",
  2: "Kargoya Verildi",
  3: "Teslim Edildi",
  4: "İptal Edildi"
}

export default function OrdersPage() {

    const dispatch = useAppDispatch();
    const orders = useAppSelector(selectAllOrders);
    const {status, isLoaded} = useAppSelector(state => state.order);

    useEffect(() => {
        if(!isLoaded) dispatch(fetchOrders());
    }, [dispatch, isLoaded]);

    if(status === "pendingFetchOrders") {
            return <CircularProgress/>;
        }

    const columns: GridColDef[] = [
            {field: "id", headerName: "ID", width:80},
            {
  field: "orderStatus",
  headerName: "Sipariş Durumu",
  flex: 1,
  renderCell: (params) => {
    const status = params.row.orderStatus as number

    return (
      <span>
        {OrderStatusMap[status]}
      </span>
    )
  }
},
            { field: "orderDate", headerName: "Sipariş Tarihi", width: 180 },
        ];

    return(
        <Paper sx={{ height: 650, width: "100%", p: 2 }}>
            <Box
            sx={{
                display: "flex",
                justifyContent: "flex-end",
                mb: 2
            }}
        >            
        </Box>
            <DataGrid
                rows={orders ?? []}
                columns={columns}
                pageSizeOptions={[5, 10, 20]}
                sx={{ border: 0 }}/>
            </Paper>
    );
}