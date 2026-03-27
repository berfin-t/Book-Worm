import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { IOrder } from "../../../model/IOrder";
import CloseIcon from "@mui/icons-material/Close";
import { currencyTRY } from "../../../utils/formatCurrency";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { updateOrderStatus } from "../../orders/orderSlice";

export const OrderStatusMap: Record<number, string> = {
  0: "Beklemede",
  1: "Onaylandı",
  2: "Kargoya Verildi",
  3: "Ödeme Başarısız",
  4: "Teslim Edildi",
  5: "İptal Edildi",
};

const statusColorMap: Record<
  number,
  "warning" | "info" | "success" | "error" | "default"
> = {
  0: "warning",
  1: "info",
  2: "default",
  3: "error",
  4: "success",
  5: "error",
};

const allowedTransitions: Record<number, number[]> = {
  0: [1, 5], // Beklemede → Onaylandı, İptal Edildi
  1: [2, 5], // Onaylandı → Kargoya Verildi, İptal Edildi
  2: [4, 5], // Kargoya Verildi → Teslim Edildi, İptal Edildi 
  3: [], // Ödeme Başarısız → hiçbiri
  4: [], // Teslim Edildi → hiçbiri
  5: [], // İptal Edildi → hiçbiri
};

interface Props {
  selectedOrder: IOrder | null;
  onClose: () => void;
}

export default function OrderDetailModal({ selectedOrder, onClose }: Props) {
  const [newStatus, setNewStatus] = useState<number>(0);
  const { status } = useAppSelector((state) => state.order);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (selectedOrder) setNewStatus(selectedOrder.orderStatus);
  }, [selectedOrder]);

  const handleUpdateStatus = () => {
    if (!selectedOrder) return;
    dispatch(
      updateOrderStatus({ id: selectedOrder.id, orderStatus: newStatus }),
    );
    onClose();
  };

  return (
    <Modal open={!!selectedOrder} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 560,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        {selectedOrder && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" fontWeight={700}>
                Sipariş #{selectedOrder.id}
              </Typography>
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              MÜŞTERİ BİLGİLERİ
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1,
                mb: 2,
              }}
            >
              {[
                [
                  "Ad Soyad",
                  `${selectedOrder.firstName} ${selectedOrder.lastName}`,
                ],
                ["Telefon", selectedOrder.phone],
                ["Şehir", selectedOrder.city],
                ["Adres", selectedOrder.addresLine],
              ].map(([label, value]) => (
                <Box key={label}>
                  <Typography variant="caption" color="text.secondary">
                    {label}
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {value}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              SİPARİŞ DETAYLARI
            </Typography>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2 }}
            >
              {selectedOrder.orderItems.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: "grey.50",
                  }}
                >
                  <Box
                    component="img"
                    src={item.bookImage}
                    alt={item.bookName}
                    sx={{
                      width: 48,
                      height: 64,
                      objectFit: "cover",
                      borderRadius: 1,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {item.bookName}
                    </Typography>
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

            {(selectedOrder.orderStatus === 2 ||
              selectedOrder.orderStatus === 4) && (
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: "grey.50",
                  border: "1px dashed #ccc",
                  mb: 2,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  KARGO TAKİP NUMARASI
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight={700}
                  letterSpacing={1.5}
                >
                  {selectedOrder.trackingNumber ?? "Henüz atanmadı"}
                </Typography>
              </Box>
            )}

            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              SİPARİŞ DURUMU GÜNCELLE
            </Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
              <Select
                size="small"
                value={newStatus}
                onChange={(e) => setNewStatus(Number(e.target.value))}
                sx={{ minWidth: 200 }}
              >
                {Object.entries(OrderStatusMap).map(([key, label]) => {
                  const keyNum = Number(key);
                  const isCurrentStatus = keyNum === selectedOrder.orderStatus;
                  const isAllowed =
                    allowedTransitions[selectedOrder.orderStatus]?.includes(
                      keyNum,
                    );
                  return (
                    <MenuItem
                      key={key}
                      value={Number(key)}
                      disabled={!isAllowed && !isCurrentStatus}
                    >
                      {label}
                    </MenuItem>
                  );
                })}
              </Select>
              <Button
                variant="contained"
                disabled={
                  newStatus === selectedOrder.orderStatus ||
                  status === "pendingUpdateOrderStatus"
                }
                onClick={handleUpdateStatus}
                sx={{
                  mt: 1,
                  backgroundColor: "#F59E0B",
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "#D97706" },
                }}
              >
                {status === "pendingUpdateOrderStatus"
                  ? "Güncelleniyor..."
                  : "Güncelle"}
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Chip
                label={
                  OrderStatusMap[selectedOrder.orderStatus] ?? "Bilinmiyor"
                }
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
  );
}
