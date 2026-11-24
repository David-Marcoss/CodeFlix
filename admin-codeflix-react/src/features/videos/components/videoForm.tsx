import { useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormGroup,
  Grid,
  Switch,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Video } from "../../../shared/types/videos";
import MultipleSelect from "../../../components/MultipleSelect";
import type { SelectOptions } from "../../../shared/types/selectoptions";
import {
  videoSchema,
  type VideoSchema,
  type VideoFormValues,
} from "../video.schema";
import { formatVideoDataToForm } from "../utils/formatVideosDataToForm";
import RattingInput from "./rattingInput";
import FileInput from "../../../components/FileInput";

export interface VideoFormProps {
  video?: Video;
  isLoading: boolean;
  isDisabled?: boolean;
  categories: SelectOptions;
  castMembers: SelectOptions;
  genres: SelectOptions;
  handleSubmitForm(data: VideoSchema): void;
}

export default function VideoForm({
  video,
  categories,
  castMembers,
  genres,
  isLoading,
  isDisabled,
  handleSubmitForm,
}: VideoFormProps) {
  const navigate = useNavigate();

  const formMethods = useForm<VideoFormValues, unknown, VideoSchema>({
    resolver: zodResolver(videoSchema),
    defaultValues: formatVideoDataToForm(video),
  });

  const { handleSubmit, control, reset } = formMethods;

  useEffect(() => {
    reset(formatVideoDataToForm(video));
  }, [video, reset]);

  return (
    <FormProvider {...formMethods}>
      <form noValidate onSubmit={handleSubmit(handleSubmitForm)}>
        <Grid container spacing={4}>
          <Grid size={12}>
            <Controller
              name="title"
              control={control}
              render={({ field: { ref, ...field }, fieldState: { error } }) => (
                <>
                  <TextField
                    {...field}
                    inputRef={ref}
                    label="Título"
                    required
                    fullWidth
                    disabled={isDisabled}
                    error={!!error}
                    helperText={error?.message ?? " "}
                    slotProps={{ htmlInput: { "data-testid": "title-input" } }}
                  />
                </>
              )}
            />
          </Grid>

          <Grid size={12}>
            <Controller
              name="description"
              control={control}
              render={({ field: { ref, ...field }, fieldState: { error } }) => (
                <TextField
                  {...field}
                  inputRef={ref}
                  label="Descrição"
                  type="text"
                  multiline
                  minRows={3}
                  fullWidth
                  disabled={isDisabled}
                  error={!!error}
                  helperText={error?.message ?? " "}
                  slotProps={{
                    htmlInput: { "data-testid": "description-input" },
                  }}
                />
              )}
            />
          </Grid>

          <Grid container spacing={2} size={12}>
            <Grid size={6}>
              <Controller
                name="year_launched"
                control={control}
                render={({
                  field: { ref, ...field },
                  fieldState: { error },
                }) => (
                  <TextField
                    {...field}
                    inputRef={ref}
                    label="Ano de lançamento"
                    type="number"
                    fullWidth
                    disabled={isDisabled}
                    error={!!error}
                    helperText={error?.message}
                    slotProps={{
                      inputLabel: { shrink: true },
                      htmlInput: {
                        min: 1000,
                        max: 9999,
                        step: 1,
                        "data-testid": "year_launched-input",
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={6}>
              <Controller
                name="duration"
                control={control}
                render={({
                  field: { ref, ...field },
                  fieldState: { error },
                }) => (
                  <TextField
                    {...field}
                    inputRef={ref}
                    label="Duração"
                    type="time"
                    fullWidth
                    disabled={isDisabled}
                    error={!!error}
                    helperText={error?.message}
                    slotProps={{
                      inputLabel: { shrink: true },
                      htmlInput: { "data-testid": "duration-input" },
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Grid size={12}>
            <Controller
              name="categories_id"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth disabled={isDisabled} error={!!error}>
                  <MultipleSelect
                    label="Categorias"
                    values={categories}
                    selectedValues={field.value}
                    onValuesChange={field.onChange}
                    disabled={isDisabled}
                  />
                  <FormHelperText error={!!error}>
                    {error?.message ?? " "}
                  </FormHelperText>
                </FormControl>
              )}
            />
          </Grid>

          <Grid size={12}>
            <Controller
              name="genres_id"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth disabled={isDisabled} error={!!error}>
                  <MultipleSelect
                    label="Gêneros"
                    values={genres}
                    selectedValues={field.value}
                    onValuesChange={field.onChange}
                    disabled={isDisabled}
                  />
                  <FormHelperText error={!!error}>
                    {error?.message ?? " "}
                  </FormHelperText>
                </FormControl>
              )}
            />
          </Grid>

          <Grid size={12}>
            <Controller
              name="cast_members_id"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth disabled={isDisabled} error={!!error}>
                  <MultipleSelect
                    label="Membros do elenco"
                    values={castMembers}
                    selectedValues={field.value}
                    onValuesChange={field.onChange}
                    disabled={isDisabled}
                  />
                  <FormHelperText error={!!error}>
                    {error?.message ?? " "}
                  </FormHelperText>
                </FormControl>
              )}
            />
          </Grid>

          <Grid size={12}>
            <Controller
              name="rating"
              control={control}
              render={({ field: { ref, ...field }, fieldState: { error } }) => (
                <RattingInput
                  {...field}
                  inputRef={ref}
                  disabled={isDisabled}
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>

          {video && (
            <>
              <Grid size={12}>
                <FormGroup>
                  <Controller
                    name="is_opened"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        label="Active"
                        control={
                          <Switch
                            name={field.name}
                            checked={field.value}
                            onChange={(_, checked) => field.onChange(checked)}
                            onBlur={field.onBlur}
                            slotProps={{ input: { ref: field.ref } }}
                            color="secondary"
                            data-testid="is_opened"
                            disabled={isDisabled}
                          />
                        }
                      />
                    )}
                  />
                </FormGroup>
              </Grid>

              <Grid size={12}>
                <FormGroup>
                  <Controller
                    name="is_published"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        label="Publicado"
                        control={
                          <Switch
                            name={field.name}
                            checked={field.value}
                            onChange={(_, checked) => field.onChange(checked)}
                            onBlur={field.onBlur}
                            slotProps={{ input: { ref: field.ref } }}
                            color="secondary"
                            data-testid="is_published"
                            disabled={isDisabled}
                          />
                        }
                      />
                    )}
                  />
                </FormGroup>
              </Grid>

            </>
          )}

          {([
            { name: "video", label: "Vídeo", accept: "video/*" },
            { name: "trailer", label: "Trailer", accept: "video/*" },
            { name: "banner", label: "Banner", accept: "image/jpeg,image/png,image/gif" },
            { name: "thumbnail", label: "Thumbnail", accept: "image/*" },
            { name: "thumbnail_half", label: "Thumbnail half", accept: "image/*" },
          ] as const).map(({ name, label, accept }) => (
            <Grid size={12} key={name}>
              <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FileInput
                    name={field.name}
                    label={label}
                    accept={accept}
                    value={field.value ?? undefined}
                    existingUrl={field.value === null ? undefined : video?.[name] ?? undefined}
                    onRemoveUploaded={() => field.onChange(null)}
                    onAddFiles={files => field.onChange(files?.[0])}
                    onBlur={field.onBlur}
                    inputRef={field.ref}
                    disabled={isDisabled || isLoading}
                    error={!!error}
                    helperText={error?.message ?? (field.value === null ? "O arquivo será removido ao salvar." : name === "banner" ? "JPEG, PNG ou GIF. Máximo de 2 MB." : undefined)}
                  />
                )}
              />
            </Grid>
          ))}

          <Grid size={12}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="contained" onClick={() => navigate("/videos")}>
                Voltar
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={isDisabled || isLoading}
                data-testid="submit-button"
              >
                {isLoading ? "Loading..." : "Salvar"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
}
