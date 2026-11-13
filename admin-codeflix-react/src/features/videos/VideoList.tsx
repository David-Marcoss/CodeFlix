import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useDeleteVideoMutation, useGetVideosQuery } from "./videoSlice";
import VideoTable from "./components/videoTable";
import { useEffect, useState } from "react";
import type { GridFilterModel, GridPaginationModel } from "@mui/x-data-grid";
import { enqueueSnackbar } from "notistack";

export default function VideoList() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [pageSizeOptions] = useState([6, 10, 15, 20]);

  const {
    data: result,
    isError,
    isFetching,
  } = useGetVideosQuery({
    search,
    page: page + 1,
    perPage,
  });

  const [deleteVideo, deleteResult] = useDeleteVideoMutation();

  // const { current_page, per_page, total } = result?.meta;

  const videos = result?.data ?? [];

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

  const handleDeleteVideo = (id: string) => {
    deleteVideo({ id });
  };

  useEffect(() => {
    if (deleteResult.isSuccess) {
      enqueueSnackbar("Video removido com sucesso!", {
        variant: "success",
      });
    } else if (deleteResult.isError) {
      enqueueSnackbar("Erro ao remover video!", {
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
          Videos
        </Typography>

        <Button
          variant="contained"
          color="secondary"
          component={Link}
          to="/videos/create"
        >
          Criar Video
        </Button>
      </Box>

      <VideoTable
        data={videos}
        isFetching={isFetching}
        page={page}
        perPage={perPage}
        rowCount={result?.meta?.total ?? 0}
        pageSizeOptions={pageSizeOptions}
        onFilterModelChange={onFilterChange}
        onPaginationModelChange={onPaginationChange}
        handleDeleteVideo={handleDeleteVideo}
      />
    </Box>
  );
}
