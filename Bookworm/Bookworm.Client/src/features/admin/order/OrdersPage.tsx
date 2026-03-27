import { Box, CircularProgress, Chip, Select, MenuItem, Button } from "@mui/material";
import {
    DataGrid,
    type GridColDef,
    type GridRenderCellParams,
    getGridStringOperators,
    getGridNumericOperators,
    getGridDateOperators,
    type GridFilterOperator,
    type GridFilterItem,
    GridToolbar,
} from "@mui/x-data-grid";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { useEffect, useState } from "react";
import type { IOrder } from "../../../model/IOrder";
import { currencyTRY } from "../../../utils/formatCurrency";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { fetchOrders, selectAllOrders } from "../../orders/orderSlice";
import OrderDetailModal from "../modals/OrderDetailModal";

const statusColorMap: Record<number, "warning" | "info" | "success" | "error" | "default"> = {
    0: "warning",  
    1: "info",     
    2: "default",  
    3: "error",    
    4: "success",  
    5: "error"     
};

export const OrderStatusMap: Record<number, string> = {
    0: "Beklemede",
    1: "Onaylandı",
    2: "Kargoya Verildi",
    3: "Ödeme Başarısız",
    4: "Teslim Edildi",
    5: "İptal Edildi"
};

const statusFilterOperators: GridFilterOperator[] = [
    {
        label: "eşittir",
        value: "statusEquals",
        getApplyFilterFn: (filterItem: GridFilterItem) => {
            if (filterItem.value === undefined || filterItem.value === "") return null;
            return (value: number) => value === Number(filterItem.value);
        },
        InputComponent: ({ item, applyValue }) => (
            <Select
                size="small"
                value={item.value ?? ""}
                onChange={(e) => applyValue({ ...item, value: e.target.value })}
                displayEmpty
                sx={{ minWidth: 150, mt: 1.5 }}
            >
                <MenuItem value="">Tümü</MenuItem>
                {Object.entries(OrderStatusMap).map(([key, label]) => (
                    <MenuItem key={key} value={key}>{label}</MenuItem>
                ))}
            </Select>
        ),
    },
];

export default function OrdersPage() {
    
    const orders = useAppSelector(selectAllOrders);
    const { status } = useAppSelector(state => state.order);
    const dispatch = useAppDispatch();
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    
    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    if (status === "pendingFetchOrders") {
        return <CircularProgress />;
    }

    const handleOpenDetail = (order: IOrder) => {
        setSelectedOrder(order);
    };   

    const rows = (orders ?? []).map((o) => ({
        ...o,
        orderDate: o.orderDate ? new Date(o.orderDate) : null,
    }));

    const columns: GridColDef[] = [
        {
            field: "id",
            headerName: "ID",
            width: 80,
            filterOperators: getGridNumericOperators().filter(op =>
                ["=", "!=", ">", "<"].includes(op.value)
            ),
        },
        {
            field: "orderStatus",
            headerName: "Sipariş Durumu",
            width: 160,
            type: "number",
            filterOperators: statusFilterOperators,
            renderCell: (params: GridRenderCellParams<IOrder>) => {
                const s = params.value ?? -1;
                return (
                    <Chip
                        label={OrderStatusMap[s] ?? "Bilinmiyor"}
                        color={statusColorMap[s] ?? "default"}
                        size="small"
                    />
                );
            }
        },
        {
            field: "orderDate",
            headerName: "Sipariş Tarihi",
            width: 160,
            type: "date",
            filterOperators: getGridDateOperators().filter(op =>
                ["is", "after", "before", "onOrAfter", "onOrBefore"].includes(op.value)
            ),
            renderCell: (params: GridRenderCellParams) => (
                <span>{params.value ? new Date(params.value).toLocaleDateString("tr-TR") : "-"}</span>
            ),
        },
        {
            field: "firstName",
            headerName: "Ad",
            width: 130,
            filterOperators: getGridStringOperators().filter(op => op.value === "contains"),
        },
        {
            field: "lastName",
            headerName: "Soyad",
            width: 130,
            filterOperators: getGridStringOperators().filter(op => op.value === "contains"),
        },
        {
            field: "subTotal",
            headerName: "Toplam Tutar",
            width: 150,
            filterOperators: getGridNumericOperators().filter(op =>
                ["=", ">", "<", ">=", "<="].includes(op.value)
            ),
            renderCell: (params) => <span>{currencyTRY.format(params.value)}</span>,
        },
        {
            field: "phone",
            headerName: "Telefon",
            width: 150,
            filterOperators: getGridStringOperators().filter(op => op.value === "contains"),
        },
        {
            field: "city",
            headerName: "Şehir",
            width: 130,
            filterOperators: getGridStringOperators().filter(op => op.value === "contains"),
        },
        {
            field: "actions",
            headerName: "İşlemler",
            width: 120,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params: GridRenderCellParams<IOrder>) => (
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<VisibilityIcon fontSize="small" />}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetail(params.row as IOrder);
                    }}
                    sx={{
                        mt: 1,
                        backgroundColor: "#F59E0B",
                        color: "#fff",
                        fontWeight: "bold",
                        "&:hover": { backgroundColor: "#D97706" },
                    }}
                >
                    Detay
                </Button>
            )
        }
    ];

    return (
        <Box sx={{ width: "100%", p: 2 }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSizeOptions={[5, 10, 20]}
                initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                sx={{ border: 0 }}
                getRowId={(row) => row.id}

                slots={{ toolbar: GridToolbar }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,          
                        quickFilterProps: { debounceMs: 300 },
                        printOptions: { disableToolbarButton: true },
                    },
                }}
                filterMode="client"
            />
            <OrderDetailModal selectedOrder={selectedOrder}
            onClose={() => setSelectedOrder(null)} />          
        </Box>
    );
}