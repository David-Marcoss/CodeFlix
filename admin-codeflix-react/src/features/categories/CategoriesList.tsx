import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useGetCategoriesQuery } from "./categorySlice";
import CategoryTable from "./components/categoriesTable";
import { useEffect, useState } from "react";
import type { GridFilterModel, GridPaginationModel } from "@mui/x-data-grid";
import { enqueueSnackbar } from "notistack";

export default function CategoriesList() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [pageSizeOptions] = useState([6, 10, 15, 20]);

  const {
    data: result,
    isError,
    isFetching,
  } = useGetCategoriesQuery({
    search,
    page,
    perPage,
  });

  // const { current_page, per_page, total } = result?.meta;

  const categories = result?.data ?? [];

  const onFilterChange = (filter: GridFilterModel) => {
    if (filter.quickFilterValues && filter.quickFilterValues.length > 0) {
      setSearch(filter.quickFilterValues.join(" "));
      return;
    }
    setSearch("");
  };

  const onPaginationChange = (model: GridPaginationModel) => {
    if (model.page) {
      setPage(model.page);
    }

    if (model.pageSize) {
      setPerPage(model.pageSize);
    }
  };

  useEffect(() => {
    if (isError) {
      enqueueSnackbar("Erro ao buscar dados!", { variant: "error" });
    }
  }, [isError]);

  return (
    <Box
      component={"div"}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
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

        <Button
          variant="contained"
          color="secondary"
          component={Link}
          to="/categories/create"
        >
          Criar Categoria
        </Button>
      </Box>

      <CategoryTable
        categories={categories}
        isFetching={isFetching}
        page={page}
        perPage={perPage}
        pageSizeOptions={pageSizeOptions}
        onFilterModelChange={onFilterChange}
        onPaginationModelChange={onPaginationChange}
      />
    </Box>
  );
}
