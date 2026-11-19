import { Box, Paper, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateVideoMutation } from "./videoSlice";
import VideoForm from "./components/videoForm";
import { enqueueSnackbar } from "notistack";
import { useGetvideosAgregatesOptions } from "./hooks/useGetvideosAgregatesOptions";
import type { VideoSchema } from "./video.schema";

export default function VideoCreate() {
  const navigate = useNavigate();

  const [createVideo, result] = useCreateVideoMutation();

  const { castMemberOptions, categorieOptions, genreOptions } =
    useGetvideosAgregatesOptions();

  async function handleSubmit(data: VideoSchema) {
    await createVideo(data);
  }

  useEffect(() => {
    if (result.isSuccess) {
      enqueueSnackbar("Video criado com sucesso!", {
        variant: "success",
      });

      navigate("/videos");
    }

    if (result.isError) {
      enqueueSnackbar("Erro ao criar video!", {
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
          marginBottom: 10,
        }}
      >
        <Typography variant="h4">Criar Video</Typography>

        <VideoForm
          isLoading={result.isLoading}
          handleSubmitForm={handleSubmit}
          categories={categorieOptions}
          castMembers={castMemberOptions}
          genres={genreOptions}
        />
      </Paper>
    </Box>
  );
}
