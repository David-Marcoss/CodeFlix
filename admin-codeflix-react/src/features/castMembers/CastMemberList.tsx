import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useGetCastMembersQuery } from "./castMemberSlice";
import { useEffect, useState } from "react";
import type { GridFilterModel, GridPaginationModel } from "@mui/x-data-grid";
import { enqueueSnackbar } from "notistack";
import { CastMemberTable } from "./components/CastMemberTable";

export default function CastMembersList() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [pageSizeOptions] = useState([6, 10, 15, 20]);

  const {
    data: result,
    isError,
    isFetching,
  } = useGetCastMembersQuery({
    search,
    page: page + 1,
    perPage,
  });

  // const { current_page, per_page, total } = result?.meta;

  const castMembers = result?.data ?? [];

  const onFilterChange = (filter: GridFilterModel) => {
    if (filter.quickFilterValues && filter.quickFilterValues.length > 0) {
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
          Membros do Elenco
        </Typography>

        <Button
          variant="contained"
          color="secondary"
          component={Link}
          to="/cast-members/create"
        >
          Criar Membro do Elenco
        </Button>
      </Box>

      <CastMemberTable
        castMembers={castMembers}
        isFetching={isFetching}
        page={page}
        perPage={perPage}
        rowCount={result?.meta?.total ?? 0}
        pageSizeOptions={pageSizeOptions}
        onFilterModelChange={onFilterChange}
        onPaginationModelChange={onPaginationChange}
      />
    </Box>
  );
}
