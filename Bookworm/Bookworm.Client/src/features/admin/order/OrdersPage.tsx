import { Box, CircularProgress, Chip, Modal, Typography, Divider, IconButton, Button, Select, MenuItem } from "@mui/material";
import {
    DataGrid,
    GridToolbar,
    type GridColDef,
    type GridRenderCellParams,
    getGridStringOperators,
    getGridNumericOperators,
    getGridDateOperators,
    type GridFilterOperator,
    type GridFilterItem,
} from "@mui/x-data-grid";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { useEffect, useState } from "react";
import type { IOrder } from "../../../model/IOrder";
import { currencyTRY } from "../../../utils/formatCurrency";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { fetchOrders, selectAllOrders, updateOrderStatus } from "../../orders/orderSlice";

export const OrderStatusMap: Record<number, string> = {
    0: "Beklemede",
    1: "Onaylandı",
    2: "Kargoya Verildi",
    3: "Tamamlandı",
    4: "İptal Edildi"
};

const statusColorMap: Record<number, "warning" | "info" | "success" | "error" | "default"> = {
    0: "warning",
    1: "info",
    2: "success",
    3: "error"
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

export default function Grids() {
    const dispatch = useAppDispatch();
    const orders = useAppSelector(selectAllOrders);
    const { status } = useAppSelector(state => state.order);

    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const [newStatus, setNewStatus] = useState<number>(0);

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    if (status === "pendingFetchOrders") {
        return <CircularProgress />;
    }

    const handleOpenDetail = (order: IOrder) => {
        setSelectedOrder(order);
        setNewStatus(order.orderStatus);
    };

    const handleClose = () => setSelectedOrder(null);

    const handleUpdateStatus = () => {
        if (!selectedOrder) return;
        dispatch(updateOrderStatus({ id: selectedOrder.id, orderStatus: newStatus }));
        handleClose();
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

            <Modal open={!!selectedOrder} onClose={handleClose}>
                <Box sx={{
                    position: "absolute", top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 560, bgcolor: "background.paper",
                    borderRadius: 2, boxShadow: 24, p: 4
                }}>
                    {selectedOrder && (
                        <>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                <Typography variant="h6" fontWeight={700}>Sipariş #{selectedOrder.id}</Typography>
                                <IconButton onClick={handleClose}><CloseIcon /></IconButton>
                            </Box>

                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>MÜŞTERİ BİLGİLERİ</Typography>
                            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, mb: 2 }}>
                                {[
                                    ["Ad Soyad", `${selectedOrder.firstName} ${selectedOrder.lastName}`],
                                    ["Telefon", selectedOrder.phone],
                                    ["Şehir", selectedOrder.city],
                                    ["Adres", selectedOrder.addresLine],
                                ].map(([label, value]) => (
                                    <Box key={label}>
                                        <Typography variant="caption" color="text.secondary">{label}</Typography>
                                        <Typography variant="body2" fontWeight={500}>{value}</Typography>
                                    </Box>
                                ))}
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>SİPARİŞ DETAYLARI</Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2 }}>
                                {selectedOrder.orderItems.map((item) => (
                                    <Box key={item.id} sx={{ display: "flex", alignItems: "center", gap: 2, p: 1.5, borderRadius: 1, bgcolor: "grey.50" }}>
                                        <Box component="img" src={item.bookImage} alt={item.bookName} sx={{ width: 48, height: 64, objectFit: "cover", borderRadius: 1 }} />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" fontWeight={600}>{item.bookName}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {item.quantity} adet × {currencyTRY.format(item.price)}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" fontWeight={700}>{currencyTRY.format(item.price * item.quantity)}</Typography>
                                    </Box>
                                ))}
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>SİPARİŞ DURUMU GÜNCELLE</Typography>
                            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
                                <Select size="small" value={newStatus} onChange={(e) => setNewStatus(Number(e.target.value))} sx={{ minWidth: 200 }}>
                                    {Object.entries(OrderStatusMap).map(([key, label]) => (
                                        <MenuItem key={key} value={Number(key)}>{label}</MenuItem>
                                    ))}
                                </Select>
                                <Button
                                    variant="contained"
                                    disabled={newStatus === selectedOrder.orderStatus || status === "pendingUpdateOrderStatus"}
                                    onClick={handleUpdateStatus}
                                    sx={{ mt: 1, backgroundColor: "#F59E0B", fontWeight: "bold", "&:hover": { backgroundColor: "#D97706" } }}
                                >
                                    {status === "pendingUpdateOrderStatus" ? "Güncelleniyor..." : "Güncelle"}
                                </Button>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Chip label={OrderStatusMap[selectedOrder.orderStatus] ?? "Bilinmiyor"} color={statusColorMap[selectedOrder.orderStatus] ?? "default"} />
                                <Typography variant="h6" fontWeight={700}>Toplam: {currencyTRY.format(selectedOrder.subTotal)}</Typography>
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
        </Box>
    );
}