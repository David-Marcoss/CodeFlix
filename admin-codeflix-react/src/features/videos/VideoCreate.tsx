import { Box, Paper, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateVideoMutation } from "./videoSlice";
import VideoForm from "./components/videoForm";
import { enqueueSnackbar } from "notistack";
import { useGetvideosAgregatesOptions } from "./hooks/useGetvideosAgregatesOptions";
import type { VideoSchema } from "./video.schema";
import { useAppDispatch } from "../../app/hooks";
import { nanoid } from "nanoid";
import { addVideoFile } from "../uploads/uploadSlice";
import type { GetVideoById } from "../../shared/types/videos";

export default function VideoCreate() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [createVideo, result] = useCreateVideoMutation();

  const { castMemberOptions, categorieOptions, genreOptions } =
    useGetvideosAgregatesOptions();

  function addFilesToUpload(field: string, videoId: string, file: File) {
    const payload = { id: nanoid(), file, videoId, field };
    dispatch(addVideoFile(payload));
  }

  async function handleSubmit(data: VideoSchema) {
    const { banner, video, trailer, thumbnail, thumbnail_half, ...metadata } =
      data;
    const result: GetVideoById = await createVideo(metadata).unwrap();

    if (result.data) {
      const { id: videoId } = result.data;
      banner && addFilesToUpload("banner", videoId, banner);
      video && addFilesToUpload("video", videoId, video);
      trailer && addFilesToUpload("trailer", videoId, trailer);
      thumbnail && addFilesToUpload("thumbnail", videoId, thumbnail);
      thumbnail_half &&
        addFilesToUpload("thumbnail_half", videoId, thumbnail_half);
    }
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
