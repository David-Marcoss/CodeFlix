import Box from "@mui/material/Box";
import type {
  GridCellParams,
  GridColDef,
  GridFilterModel,
  GridPaginationModel,
} from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { Chip, IconButton, Tooltip, Typography } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  ratingValues,
  type RatingValues,
  type Video,
} from "../../../shared/types/videos";

export interface VideoTableProps {
  data: Video[];
  rowCount: number;
  isFetching: boolean;
  page: number;
  perPage: number;
  pageSizeOptions: number[];
  onFilterModelChange: (filter: GridFilterModel) => void;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  handleDeleteVideo: (id: string) => void;
}

export default function VideoTable({
  perPage,
  rowCount,
  page,
  data,
  pageSizeOptions,
  isFetching,
  onFilterModelChange,
  onPaginationModelChange,
  handleDeleteVideo,
}: VideoTableProps) {
  const navigate = useNavigate();

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: "id", headerName: "ID", flex: 1 },
    {
      field: "title",
      headerName: "Título",
      flex: 1,
    },
    {
      field: "genres",
      headerName: "Gêneros",
      flex: 1,
      renderCell: renderChipItems,
    },
    {
      field: "categories",
      headerName: "Categorias",
      flex: 1,
      renderCell: renderChipItems,
    },
    {
      field: "rating",
      headerName: "Classificação",
      flex: 1,
      renderCell: renderRatingCell,
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

  const rows = data.map((video) => ({
    id: video.id,
    title: video.title,
    categories: video.categories?.map((c) => c.name) || [],
    genres: video.genres?.map((c) => c.name) || [],
    status: video.is_published,
    rating: video.rating,
    created_at: video.created_at
      ? new Date(video.created_at).toLocaleDateString("pt-BR")
      : "-",
  }));

  function renderChipItems(params: GridCellParams) {
    const data = params.value as string[];
    const twoItems = data.slice(0, 2);
    const restItems = data.length - twoItems.length;

    return (
      <Box sx={{ display: "flex" }}>
        {twoItems.map((i, index) => (
          <Chip key={index} label={i} sx={{ marginX: "2px", marginY: 1 }} />
        ))}

        {restItems > 0 && (
          <Tooltip title={data.slice(2, data.length).join(" ,")}>
            <Chip label={`${restItems}+`} sx={{ marginX: "2px", marginY: 1 }} />
          </Tooltip>
        )}
      </Box>
    );
  }

  function renderActionsCell(params: GridCellParams) {
    return (
      <Box sx={{ display: "flex", gap: 1 }}>
        <IconButton onClick={() => navigate(`/videos/edit/${params.row.id}`)}>
          <Edit />
        </IconButton>
        <IconButton
          onClick={() => {
            handleDeleteVideo(params.row.id);
          }}
          data-testid={`delete-video-${params.row.id}`}
        >
          <Delete color="secondary" />
        </IconButton>
      </Box>
    );
  }

  function renderRatingCell(params: GridCellParams) {
    const rating = params.value as RatingValues;
    const item = Object.entries(ratingValues).find((item) => {
      const [_, value] = item;
      return value === rating;
    });

    const value = item ? item[0] : "";

    return <Typography sx={{ margin: 1 }}>{value}</Typography>;
  }

  function renderActiveCell(params: GridCellParams) {
    return (
      <Typography color={params.value ? "success" : "error"} sx={{ margin: 1 }}>
        {params.value ? "Publicado" : "Pendente"}
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
