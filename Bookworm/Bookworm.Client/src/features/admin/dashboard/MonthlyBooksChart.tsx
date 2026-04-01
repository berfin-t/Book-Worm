import { useMemo, useEffect } from "react";
import { BarChart } from "@mui/x-charts";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { fetchOrders } from "../../orders/orderSlice";
import { selectAllOrders } from "../../orders/orderSlice";


const MONTH_NAMES = [
  "Oca", "Şub", "Mar", "Nis", "May", "Haz",
  "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara",
];

export default function MonthlyBooksChart() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectAllOrders);
  const status = useAppSelector((state) => state.order.status);
  const isLoaded = useAppSelector((state) => state.order.isLoaded);

  useEffect(() => {
    if (!isLoaded) {
      dispatch(fetchOrders());
    }
  }, [dispatch, isLoaded]);

  const dataset = useMemo(() => {
    const monthlySales: Record<number, number> = {};
    for (let i = 0; i < 12; i++) monthlySales[i] = 0;

    orders.forEach((order) => {
      const dateStr = order.orderDate ?? order.createdAt;
      if (!dateStr) return;
      const month = new Date(dateStr).getMonth();
      const totalQty = order.orderItems?.reduce(
        (sum, item) => sum + item.quantity, 0
      ) ?? 0;
      monthlySales[month] += totalQty;
    });

    return Array.from({ length: 12 }, (_, i) => ({
      month: MONTH_NAMES[i],
      quantity: monthlySales[i],
    }));
  }, [orders]);

  const totalSold = dataset.reduce((s, d) => s + d.quantity, 0);
  const peakMonth = dataset.reduce((a, b) => (a.quantity > b.quantity ? a : b));
  const avgPerMonth = Math.round(totalSold / 12);

  if (status === "pendingFetchOrders") {
    return <div style={{ padding: 24, color: "#888" }}>Yükleniyor...</div>;
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <StatCard label="Toplam kitap" value={totalSold} />
        <StatCard label="En yüksek ay" value={peakMonth.month} />
        <StatCard label="Aylık ort." value={avgPerMonth} />
      </div>

      <BarChart
        dataset={dataset}
        xAxis={[{ scaleType: "band", dataKey: "month" }]}
        series={[
          {
            dataKey: "quantity",
            label: "Aylık kitap satış adedi",
            color: "#378ADD",
          },
        ]}
        height={300}
        margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
      />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ flex: 1, background: "#f5f5f5", borderRadius: 8, padding: "12px 16px" }}>
      <p style={{ fontSize: 13, color: "#888", margin: "0 0 4px" }}>{label}</p>
      <p style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>{value}</p>
    </div>
  );
}