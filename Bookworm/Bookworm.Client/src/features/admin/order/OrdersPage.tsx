import { Box, CircularProgress, Chip, Modal, Typography, Divider, IconButton } from "@mui/material";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { useEffect, useState } from "react";
import { fetchPendingOrders, selectPendingOrders } from "../../orders/orderSlice";
import type { IOrder } from "../../../model/IOrder";
import { currencyTRY } from "../../../utils/formatCurrency";
import CloseIcon from "@mui/icons-material/Close";

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

export default function Grids() {
    const dispatch = useAppDispatch();
    const orders = useAppSelector(selectPendingOrders);
    const { status, isLoaded } = useAppSelector(state => state.order);

    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

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
            width: 160,
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
            renderCell: (params: GridRenderCellParams<IOrder>) => {
                const date = params.value;
                return <span>{date ? new Date(date).toLocaleDateString("tr-TR") : "-"}</span>;
            }
        },
        { field: "firstName", headerName: "Ad", width: 130 },
        { field: "lastName", headerName: "Soyad", width: 130 },
        { field: "subTotal", headerName: "Toplam Tutar", width: 150,
            renderCell: (params) => <span>{currencyTRY.format(params.value)}</span>
        },
        { field: "phone", headerName: "Telefon", width: 150 },
        { field: "city", headerName: "Şehir", width: 130 }
    ];

    return (
        <Box sx={{ width: "100%", p: 2 }}>
            <DataGrid
                rows={orders ?? []}
                columns={columns}
                pageSizeOptions={[5, 10, 20]}
                initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                sx={{ border: 0, cursor: "pointer" }}
                getRowId={(row) => row.id}
                onRowClick={(params) => setSelectedOrder(params.row as IOrder)}
            />

            {/* ── Detay Modal ── */}
            <Modal open={!!selectedOrder} onClose={() => setSelectedOrder(null)}>
                <Box sx={{
                    position: "absolute", top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 560, bgcolor: "background.paper",
                    borderRadius: 2, boxShadow: 24, p: 4
                }}>
                    {selectedOrder && (
                        <>
                            {/* Başlık */}
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                <Typography variant="h6" fontWeight={700}>
                                    Sipariş #{selectedOrder.id}
                                </Typography>
                                <IconButton onClick={() => setSelectedOrder(null)}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>

                            {/* Müşteri Bilgileri */}
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                MÜŞTERİ BİLGİLERİ
                            </Typography>
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

                            {/* Sipariş Detayları */}
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                SİPARİŞ DETAYLARI
                            </Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2 }}>
                                {selectedOrder.orderItems.map((item) => (
                                    <Box key={item.id} sx={{
                                        display: "flex", alignItems: "center", gap: 2,
                                        p: 1.5, borderRadius: 1, bgcolor: "grey.50"
                                    }}>
                                        <Box
                                            component="img"
                                            src={item.bookImage}
                                            alt={item.bookName}
                                            sx={{ width: 48, height: 64, objectFit: "cover", borderRadius: 1 }}
                                        />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" fontWeight={600}>{item.bookName}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {item.quantity} adet × {currencyTRY.format(item.price)}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" fontWeight={700}>
                                            {currencyTRY.format(item.price * item.quantity)}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {/* Özet */}
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Chip
                                    label={OrderStatusMap[selectedOrder.orderStatus] ?? "Bilinmiyor"}
                                    color={statusColorMap[selectedOrder.orderStatus] ?? "default"}
                                />
                                <Typography variant="h6" fontWeight={700}>
                                    Toplam: {currencyTRY.format(selectedOrder.subTotal)}
                                </Typography>
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
        </Box>
    );
}