import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  Switch,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ratingValues } from "../../../shared/types/videos";
import type { Video } from "../../../shared/types/videos";
import MultipleSelect from "../../../components/MultipleSelect";
import type { SelectOptions } from "../../../shared/types/selectoptions";
import { videoSchema, type VideoSchema } from "../video.schema";
import { formatVideoDataToForm } from "../utils/formatVideosDataToForm";

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

  const formMethods = useForm<VideoSchema>({
    resolver: zodResolver(videoSchema),
    defaultValues: formatVideoDataToForm(video),
  });

  const { handleSubmit, control } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <Grid container spacing={4}>
          <Grid size={12}>
            <Controller
              name="title"
              control={control}
              render={({ field: { ref, ...field }, fieldState: { error } }) => (
                <TextField
                  {...field}
                  inputRef={ref}
                  label="Nome"
                  required
                  fullWidth
                  disabled={isDisabled}
                  error={!!error}
                  helperText={error?.message}
                  slotProps={{ htmlInput: { "data-testid": "name-input" } }}
                />
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
                  multiline
                  minRows={3}
                  fullWidth
                  disabled={isDisabled}
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>

          <Grid  container spacing={2} size={12}>
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
                    onChange={(event) =>
                      field.onChange(
                        event.target.value === ""
                          ? NaN
                          : Number(event.target.value),
                      )
                    }
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
                    type="number"
                    fullWidth
                    disabled={isDisabled}
                    error={!!error}
                    helperText={error?.message}
                    onChange={(event) =>
                      field.onChange(
                        event.target.value === ""
                          ? NaN
                          : Number(event.target.value),
                      )
                    }
                  />
                )}
              />
            </Grid>
          </Grid>

          <Grid size={12}>
            <Controller
              name="rating"
              control={control}
              render={({ field: { ref, ...field }, fieldState: { error } }) => (
                <TextField
                  {...field}
                  inputRef={ref}
                  select
                  label="Classificação indicativa"
                  fullWidth
                  disabled={isDisabled}
                  error={!!error}
                  helperText={error?.message}
                >
                  {Object.values(ratingValues).map((rating) => (
                    <MenuItem key={rating} value={rating}>
                      {rating}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
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
                </FormControl>
              )}
            />
          </Grid>

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
