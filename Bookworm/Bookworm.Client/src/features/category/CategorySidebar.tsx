import { Box, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { clearSelectedCategory, setSelectedCategory } from "../book/bookSlice";
import type { ICategory } from "../../model/ICategory";

interface Props {
  category: ICategory[];
}

export default function CategorySidebar({ category }: Props) {
  const dispatch = useAppDispatch();
  const selectedCategoryId = useAppSelector(
    state => state.book.selectedCategoryId
  );

  return (
    <Box
      sx={{
        borderLeft: "1px solid",
        borderColor: "divider",
        pl: 3,
        mt:4,
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 600, mb: 2 }}
      >
        Kategoriler
      </Typography>

      {/* Tümü */}
      <Box
        onClick={() => dispatch(clearSelectedCategory())}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          cursor: "pointer",
          mb: 1,
          fontWeight: !selectedCategoryId ? 600 : 400,
          color: !selectedCategoryId ? "primary.main" : "text.secondary",
          "&:hover": { color: "primary.main" }
        }}
      >
        <Typography>Tümü</Typography>
      </Box>

      {/* Category List */}
      {category.map(cat => {
        const isActive = selectedCategoryId === cat.id;

        return (
          <Box
            key={cat.id}
            onClick={() => dispatch(setSelectedCategory(cat.id))}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              mb: 1,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? "primary.main" : "text.secondary",
              "&:hover": { color: "primary.main" }
            }}
          >
            <Typography>{cat.name}</Typography>

            {/* Kitap sayısı */}
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.8rem",
                color: "text.disabled"
              }}
            >
              {cat.bookCount}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}