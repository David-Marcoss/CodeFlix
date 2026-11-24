import { Box, Paper, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetVideoByIdQuery, useUpdateVideoMutation } from "./videoSlice";
import VideoForm from "./components/videoForm";
import { enqueueSnackbar } from "notistack";
import { useGetvideosAgregatesOptions } from "./hooks/useGetvideosAgregatesOptions";
import type { VideoSchema } from "./video.schema";
import { nanoid } from "nanoid";
import { useAppDispatch } from "../../app/hooks";
import { addVideoFile } from "../uploads/uploadSlice";

export default function VideoEdit() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const id = params.id!;

  const [updateVideo, result] = useUpdateVideoMutation();
  const {
    data: getVideoResult,
    isFetching: isFetchingVideo,
    isError: getVideoIsError,
  } = useGetVideoByIdQuery(id);

  const { castMemberOptions, categorieOptions, genreOptions } =
    useGetvideosAgregatesOptions();

  function addFilesToUpload(field: string, videoId: string, file: File) {
    const payload = { id: nanoid(), file, videoId, field };
    dispatch(addVideoFile(payload));
  }

  async function handleSubmit(data: VideoSchema) {
    const { banner, video, trailer, thumbnail, thumbnail_half, ...metadata } = data;
    const removals = Object.fromEntries(
      Object.entries({ banner, thumbnail, thumbnail_half, video, trailer }).filter(([, value]) => value === null),
    );
    const result = await updateVideo({ ...metadata, ...removals, id }).unwrap();

    if (result.data) {
      const { id: videoId } = result.data;
      banner && addFilesToUpload("banner", videoId, banner);
      video && addFilesToUpload("video", videoId, video);
      trailer && addFilesToUpload("trailer", videoId, trailer);
      thumbnail && addFilesToUpload("thumbnail", videoId, thumbnail);
      thumbnail_half && addFilesToUpload("thumbnail_half", videoId, thumbnail_half);
    }
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
          isLoading={result.isLoading || isFetchingVideo}
          handleSubmitForm={handleSubmit}
          categories={categorieOptions}
          castMembers={castMemberOptions}
          genres={genreOptions}
        />
      </Paper>
    </Box>
  );
}
