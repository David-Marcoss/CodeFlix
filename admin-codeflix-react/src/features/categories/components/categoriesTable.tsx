import Box from "@mui/material/Box";
import type { GridCellParams, GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import type { Category } from "../categorySlice";
import { IconButton, Typography } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";

interface CategoryTableProps {
  categories: Category[];
}

export default function CategoryTable({ categories }: CategoryTableProps) {
  const navigate = useNavigate();
  const dispash = useAppDispatch();

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
            dispash({
              type: "category/deleteCategory",
              payload: params.row.id,
            });
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

  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        showToolbar
        disableColumnFilter
      />
    </Box>
  );
}
