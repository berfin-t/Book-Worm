import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import { useAppDispatch } from "../../../store/store";
import { createBook } from "../../book/bookSlice";
import type { IBook } from "../../../model/IBook";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function BookAddModal({ open, onClose }: Props) {
  const dispatch = useAppDispatch();

 const [formData, setFormData] = useState<IBook>({
  id: 0,
  title: "",
  authorId: 0,
  authorName: "",
  categoryId: 0,
  categoryName: "",
  isbn: "",
  price: 0,
  stock: 0,
  description: "",
  isActive: true,
  imgUrl: ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]:
        name === "price" ||
        name === "stock" ||
        name.includes("Id")
          ? Number(value)
          : value
    });
  };

  const handleSave = async () => {
    await dispatch(createBook(formData as any));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Yeni Kitap Ekle</DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        <TextField
          label="Kitap Adı"
          name="title"
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Yazar Id"
          name="authorId"
          type="number"
          onChange={handleChange}
        />
        <TextField
          label="Açıklama"
          name="description"
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="ISBN"
          name="isbn"
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Kategori Id"
          name="categoryId"
          type="number"
          onChange={handleChange}
        />
        <TextField
          label="Fiyat"
          name="price"
          type="number"
          onChange={handleChange}
        />
        <TextField
          label="Stok"
          name="stock"
          type="number"
          onChange={handleChange}
        />
        <FormControlLabel
  control={
    <Checkbox
      checked={formData.isActive}
      onChange={(e) =>
        setFormData({ ...formData, isActive: e.target.checked })
      }
    />
  }
  label="Aktif mi?"
/>
        <TextField
          label="Görsel URL"
          name="imgUrl"
          type="text"
          onChange={handleChange}
          fullWidth
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>İptal</Button>
        <Button variant="contained" onClick={handleSave}>
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
}