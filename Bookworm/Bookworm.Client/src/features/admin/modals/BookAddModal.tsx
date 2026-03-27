import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useAppDispatch } from "../../../store/store";
import { createBook, updateBook } from "../../book/bookSlice";
import type { IBook } from "../../../model/IBook";

interface Props {
  open: boolean;
  onClose: () => void;
  book?: IBook | null;
}

export default function BookAddModal({ open, onClose, book }: Props) {
  const dispatch = useAppDispatch();
  const [authors, setAuthors] = useState<{ id: number; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  );

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
    imgUrl: "",
  });

  useEffect(() => {
    async function fetchAuthorsAndCategories() {
      const authorsRes = await fetch("/api/authors");
      const authorsData = await authorsRes.json();
      setAuthors(authorsData);

      const categoriesRes = await fetch("/api/categories");
      const categoriesData = await categoriesRes.json();
      setCategories(categoriesData);
    }

    fetchAuthorsAndCategories();
  }, []);

  useEffect(() => {
    if (book) {
      const author = authors.find((a) => a.id === book.authorId);
      const category = categories.find((c) => c.id === book.categoryId);

      setFormData({
        ...book,
        authorId: author ? author.id : 0,
        categoryId: category ? category.id : 0,
        authorName: author ? author.name : "",
        categoryName: category ? category.name : "",
      });
    } else {
      setFormData({
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
        imgUrl: "",
      });
    }
  }, [book, authors, categories, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "price" || name === "stock" || name.includes("Id")
          ? Number(value)
          : value,
    });
  };

  const handleSave = async () => {
    const payload = {
      ...formData,
      authorName: undefined,
      categoryName: undefined,
    };

    if (book) {
      await dispatch(updateBook(payload as any));
    } else {
      await dispatch(createBook(payload as any));
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{book ? "Kitap Düzenle" : "Yeni Kitap Ekle"}</DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        <TextField
          label="Kitap Adı"
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>Yazar</InputLabel>
          <Select
            name="authorId"
            value={formData.authorId || ""}
            label="Yazar"
            onChange={(e) =>
              setFormData({ ...formData, authorId: Number(e.target.value) })
            }
          >
            {authors.map((author) => (
              <MenuItem key={author.id} value={author.id}>
                {author.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Açıklama"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="ISBN"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>Kategori</InputLabel>
          <Select
            name="categoryId"
            value={formData.categoryId || ""}
            label="Kategori"
            onChange={(e) =>
              setFormData({ ...formData, categoryId: Number(e.target.value) })
            }
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Fiyat"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
        />
        <TextField
          label="Stok"
          name="stock"
          type="number"
          value={formData.stock}
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
          value={formData.imgUrl}
          onChange={handleChange}
          fullWidth
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>İptal</Button>
        <Button variant="contained" onClick={handleSave}>
          {book ? "Güncelle" : "Kaydet"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
