import { Box, Paper, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetVideoByIdQuery, useUpdateVideoMutation } from "./videoSlice";
import VideoForm from "./components/videoForm";
import { enqueueSnackbar } from "notistack";
import { useGetvideosAgregatesOptions } from "./hooks/useGetvideosAgregatesOptions";
import type { VideoSchema } from "./video.schema";

export default function VideoEdit() {
  const params = useParams();
  const id = params.id!;
  const navigate = useNavigate();

  const [updateVideo, result] = useUpdateVideoMutation();
  const {
    data: getVideoResult,
    isFetching: isFetchingVideo,
    isError: getVideoIsError,
  } = useGetVideoByIdQuery(id);

  const { castMemberOptions, categorieOptions, genreOptions } =
    useGetvideosAgregatesOptions();

  async function handleSubmit(data: VideoSchema) {
    await updateVideo({ ...data, id });
  }

  useEffect(() => {
    if (getVideoIsError && !getVideoResult?.data) {
      enqueueSnackbar("Erro ao carregar dados do video!", {
        variant: "error",
      });
    }
  }, [result]);

  useEffect(() => {
    if (result.isSuccess) {
      enqueueSnackbar("Video atualizado com sucesso!", {
        variant: "success",
      });

      navigate("/videos");
    }

    if (result.isError) {
      enqueueSnackbar("Erro ao atualizar video!", {
        variant: "error",
      });
    }
  }, [result]);

  return (
    <Box
      component={"div"}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "60%",
        }}
      >
        <Typography variant="h4">Editar Video</Typography>

        <VideoForm
          video={getVideoResult?.data}
          isLoading={result.isLoading ?? isFetchingVideo}
          handleSubmitForm={handleSubmit}
          categories={categorieOptions}
          castMembers={castMemberOptions}
          genres={genreOptions}
        />
      </Paper>
    </Box>
  );
}
