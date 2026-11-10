import Box from "@mui/material/Box";
import type {
  GridCellParams,
  GridColDef,
  GridFilterModel,
  GridPaginationModel,
} from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { useDeleteGenreMutation } from "../genreSlice";
import { IconButton, Typography } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import type { Genre } from "../../../shared/types/genre";

export interface GenreTableProps {
  data: Genre[];
  rowCount: number;
  isFetching: boolean;
  page: number;
  perPage: number;
  pageSizeOptions: number[];
  onFilterModelChange: (filter: GridFilterModel) => void;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  handleDeleteGenre: (id: string) => void;
}

export default function GenreTable({
  perPage,
  rowCount,
  page,
  data,
  pageSizeOptions,
  isFetching,
  onFilterModelChange,
  onPaginationModelChange,
  handleDeleteGenre,
}: GenreTableProps) {
  const navigate = useNavigate();

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: "id", headerName: "ID", flex: 1 },
    {
      field: "name",
      headerName: "Categoria",
      flex: 1,
    },
    {
      field: "categories",
      headerName: "Categorias",
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ whiteSpace: "normal", wordWrap: "break-word" }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: renderActiveCell,
    },
    {
      field: "created_at",
      headerName: "Criado em",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Ações",
      flex: 1,
      renderCell: renderActionsCell,
    },
  ];

  const rows = data.map((genre) => ({
    id: genre.genre_id,
    name: genre.name,
    categories: genre.categories?.map((c) => c.name).join(", ") || "-",
    status: genre.is_active,
    created_at: genre.created_at
      ? new Date(genre.created_at).toLocaleDateString("pt-BR")
      : "-",
  }));



  function renderActionsCell(params: GridCellParams) {
    return (
      <Box sx={{ display: "flex", gap: 1 }}>
        <IconButton onClick={() => navigate(`/genres/edit/${params.row.id}`)}>
          <Edit />
        </IconButton>
        <IconButton
          onClick={() => {
            handleDeleteGenre(params.row.id);
          }}
          data-testid={`delete-genre-${params.row.id}`}
        >
          <Delete color="secondary" />
        </IconButton>
      </Box>
    );
  }

  function renderActiveCell(params: GridCellParams) {
    return (
      <Typography color={params.value ? "success" : "error"}>
        {params.value ? "Ativo" : "Inativo"}
      </Typography>
    );
  }



  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={rows}
        rowCount={rowCount}
        columns={columns}
        paginationModel={{ page, pageSize: perPage }}
        loading={isFetching}
        pageSizeOptions={pageSizeOptions}
        showToolbar
        disableColumnFilter
        filterMode="server"
        paginationMode="server"
        onFilterModelChange={onFilterModelChange}
        onPaginationModelChange={onPaginationModelChange}
      />
    </Box>
  );
}
