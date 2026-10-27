import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectCategories } from "./categorySlice";
import CategoryTable from "./components/categoriesTable";

export default function CategoriesList() {
  const categories = useAppSelector(selectCategories);
  return (
    <Box
      component={"div"}
      sx={{ display: "flex", flexDirection: "column", gap: 2, justifyContent: "center", alignItems: "center", width: "100%" }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography variant="h3" sx={{ color: "text.primary" }}>
          Categorias
        </Typography>

        <Button variant="contained" color="secondary" component={Link} to="/categories/create">
          Criar Categoria
        </Button>
      </Box>

      <CategoryTable categories={categories} />
    </Box>
  );
}
