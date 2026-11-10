import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useDeleteGenreMutation, useGetGenresQuery } from "./genreSlice";
import GenreTable from "./components/genreTable";
import { useEffect, useState } from "react";
import type { GridFilterModel, GridPaginationModel } from "@mui/x-data-grid";
import { enqueueSnackbar } from "notistack";

export default function GenreList() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [pageSizeOptions] = useState([6, 10, 15, 20]);

  const {
    data: result,
    isError,
    isFetching,
  } = useGetGenresQuery({
    search,
    page: page + 1,
    perPage,
  });

  const [deleteGenre, deleteResult] = useDeleteGenreMutation();

  // const { current_page, per_page, total } = result?.meta;

  const genres = result?.data ?? [];

  const onFilterChange = (filter: GridFilterModel) => {
    if (filter.quickFilterValues && filter.quickFilterValues.length > 0) {

      console.log(filter.quickFilterValues.join(" "));

      setSearch(filter.quickFilterValues.join(" "));
      return;
    }
    setSearch("");
  };

  const onPaginationChange = (model: GridPaginationModel) => {
    setPage(model.pageSize !== perPage ? 0 : model.page);
    setPerPage(model.pageSize);
  };

  useEffect(() => {
    if (isError) {
      enqueueSnackbar("Erro ao buscar dados!", { variant: "error" });
    }
  }, [isError]);

  const handleDeleteGenre = (id: string) => {
    deleteGenre({ genre_id: id });
  };

  useEffect(() => {
    if (deleteResult.isSuccess) {
      enqueueSnackbar("Gênero removido com sucesso!", {
        variant: "success",
      });
    } else if (deleteResult.isError) {
      enqueueSnackbar("Erro ao remover gênero!", {
        variant: "error",
      });
    }
  }, [deleteResult]);

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
          Gêneros
        </Typography>

        <Button
          variant="contained"
          color="secondary"
          component={Link}
          to="/genres/create"
        >
          Criar Gênero
        </Button>
      </Box>

      <GenreTable
        data={genres}
        isFetching={isFetching}
        page={page}
        perPage={perPage}
        rowCount={result?.meta?.total ?? 0}
        pageSizeOptions={pageSizeOptions}
        onFilterModelChange={onFilterChange}
        onPaginationModelChange={onPaginationChange}
        handleDeleteGenre={handleDeleteGenre}
      />
    </Box>
  );
}
