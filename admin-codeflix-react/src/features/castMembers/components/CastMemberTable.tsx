import Box from "@mui/material/Box";
import type {
  GridCellParams,
  GridColDef,
  GridFilterModel,
  GridPaginationModel,
} from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { useDeleteCastMemberMutation } from "../castMemberSlice";
import { IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import type { CastMember } from "../../../shared/types/castMember";

interface CastMemberTableProps {
  castMembers: CastMember[];
  rowCount: number;
  isFetching: boolean;
  page: number;
  perPage: number;
  pageSizeOptions: number[];
  onFilterModelChange: (filter: GridFilterModel) => void;
  onPaginationModelChange: (model: GridPaginationModel) => void;
}

export function CastMemberTable({
  perPage,
  rowCount,
  page,
  castMembers,
  pageSizeOptions,
  isFetching,
  onFilterModelChange,
  onPaginationModelChange,
}: CastMemberTableProps) {
  const navigate = useNavigate();
  const [deleteCastMember, result] = useDeleteCastMemberMutation();

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: "id", headerName: "ID", flex: 1 },
    {
      field: "name",
      headerName: "Nome",
      flex: 1,
    },
    {
      field: "type",
      headerName: "Tipo",
      flex: 1,
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

  const rows = castMembers.map((castMember) => ({
    id: castMember.cast_member_id,
    name: castMember.name,
    type: castMember.type === "director" ? "Diretor" : "Ator",
    created_at: castMember.created_at
      ? new Date(castMember.created_at).toLocaleDateString("pt-BR")
      : "-",
  }));

  const handleDeleteCastMember = (id: string) => {
    deleteCastMember({ cast_member_id: id });
  };

  function renderActionsCell(params: GridCellParams) {
    return (
      <Box sx={{ display: "flex", gap: 1 }}>
        <IconButton
          onClick={() => navigate(`/cast-members/edit/${params.row.id}`)}
        >
          <Edit />
        </IconButton>
        <IconButton
          onClick={() => {
            handleDeleteCastMember(params.row.id);
          }}
        >
          <Delete color="secondary" />
        </IconButton>
      </Box>
    );
  }

  useEffect(() => {
    if (result.isSuccess) {
      enqueueSnackbar("Membro da equipe removido com sucesso!", {
        variant: "success",
      });
    }
  }, [result]);

  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={rows}
        rowCount={rowCount}
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
