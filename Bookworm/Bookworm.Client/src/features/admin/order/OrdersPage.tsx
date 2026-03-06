import { Box, CircularProgress } from "@mui/material";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { useEffect } from "react";
import { fetchPendingOrders, selectPendingOrders } from "../../orders/orderSlice";
import type { IOrder } from "../../../model/IOrder";
import { currencyTRY } from "../../../utils/formatCurrency";

export const OrderStatusMap: Record<number, string> = {
  0: "Beklemede"
};

export default function Grids() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectPendingOrders);
  const { status, isLoaded } = useAppSelector(state => state.order);

  useEffect(() => {
    if (!isLoaded) dispatch(fetchPendingOrders());
  }, [dispatch, isLoaded]);

  if (status === "pendingFetchPendingOrders") {
    return <CircularProgress />;
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 80 },
    {
        field: "orderStatus",
        headerName: "Sipariş Durumu",
        flex: 1,
        renderCell: (params: GridRenderCellParams<IOrder>) => {
            const status = params.value ?? -1;
            return <span>{OrderStatusMap[status] ?? "Bilinmiyor"}</span>;
    }
    },
    {
        field: "orderDate",
        headerName: "Sipariş Tarihi",
        width: 180,
        renderCell: (params: GridRenderCellParams<IOrder>) => {
            const date = params.value;
            return <span>{date ? new Date(date).toLocaleDateString("tr-TR") : "-"}</span>;
        }
    },
    { field: "firstName", headerName: "Müşteri Adı", width: 150 },
{ field: "lastName", headerName: "Müşteri Soyadı", width: 150 },
    { field: "subTotal", headerName: "Toplam Tutar", width: 150, renderCell: (params) => {
        const value = params.value;
        return <span>{currencyTRY.format(value)}</span>;
    } },
    {field: "phone", headerName: "Telefon", width: 150},
    {field: "city", headerName: "Şehir", width: 150}
  ];

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
      <DataGrid
        rows={orders ?? []}
        columns={columns}
        pageSizeOptions={[5, 10, 20]}
        sx={{ border: 0 }}
        getRowId={(row) => row.id} 
      />
    </Box>
  );
}