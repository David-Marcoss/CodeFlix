import Box from "@mui/material/Box";
import type {
  GridCellParams,
  GridColDef,
  GridFilterModel,
  GridPaginationModel,
} from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { useDeleteCategoryMutation } from "../categorySlice";
import { IconButton, Typography } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import type { Category } from "../../../types/category";

interface CategoryTableProps {
  categories: Category[];
  isFetching: boolean;
  page: number;
  perPage: number;
  pageSizeOptions: number[];
  onFilterModelChange: (filter: GridFilterModel) => void;
  onPaginationModelChange: (model: GridPaginationModel) => void;
}

export default function CategoryTable({
  perPage,
  page,
  categories,
  pageSizeOptions,
  isFetching,
  onFilterModelChange,
  onPaginationModelChange,
}: CategoryTableProps) {
  const navigate = useNavigate();
  const [deleteCategory, result] = useDeleteCategoryMutation();

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: "id", headerName: "ID", flex: 1 },
    {
      field: "name",
      headerName: "Categoria",
      flex: 1,
    },
    {
      field: "description",
      headerName: "Descrição",
      flex: 1,
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

  const rows = categories.map((category) => ({
    id: category.category_id,
    name: category.name,
    description: category.description,
    status: category.is_active,
    created_at: category.created_at
      ? new Date(category.created_at).toLocaleDateString("pt-BR")
      : "-",
  }));

  const handleDeleteCategory = (id: string) => {
    deleteCategory({ category_id: id });
  };

  function renderActionsCell(params: GridCellParams) {
    return (
      <Box sx={{ display: "flex", gap: 1 }}>
        <IconButton
          onClick={() => navigate(`/categories/edit/${params.row.id}`)}
        >
          <Edit />
        </IconButton>
        <IconButton
          onClick={() => {
            handleDeleteCategory(params.row.id);
          }}
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

  useEffect(() => {
    if (result.isSuccess) {
      enqueueSnackbar("Categoria removida com sucesso!", {
        variant: "success",
      });
    }
  }, [result]);

  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: perPage,
              page: page,
            },
          },
        }}
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
