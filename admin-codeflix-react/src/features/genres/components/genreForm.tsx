import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Switch,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Genre } from "../../../shared/types/genre";
import MultipleSelect from "../../../components/MultipleSelect";

export interface GenreFormProps {
  genre: Genre;
  isLoading: boolean;
  isDisabled?: boolean;
  categories: { value: string; label: string }[];
  handleSubmit(event: React.FormEvent<HTMLFormElement>): void;
  handleCategoriesChange(values: string[]): void;
  handleInputChange(event: React.ChangeEvent<HTMLInputElement, Element>): void;
  handleInputToggleChange(
    event: React.ChangeEvent<HTMLInputElement, Element>,
  ): void;
}

export default function GenreForm({
  genre,
  categories,
  isLoading,
  isDisabled,
  handleSubmit,
  handleInputChange,
  handleInputToggleChange,
  handleCategoriesChange,
}: GenreFormProps) {
  const navigate = useNavigate();

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={4}>
        <Grid size={12}>
          <FormControl fullWidth>
            <TextField
              required
              name="name"
              label="Nome"
              value={genre?.name || ""}
              disabled={isDisabled}
              onChange={handleInputChange}
              slotProps={{ htmlInput: { "data-testid": "name-input" } }}
            />
          </FormControl>
        </Grid>

        <Grid size={12}>
          <FormControl fullWidth>
            <MultipleSelect
              label="Categorias"
              values={categories}
              selectedValues={genre?.categories_id || []}
              onValuesChange={handleCategoriesChange}
            />
          </FormControl>
        </Grid>

        <Grid size={12}>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  name="is_active"
                  color="secondary"
                  onChange={handleInputToggleChange}
                  checked={genre?.is_active || false}
                  data-testid="is_active"
                  disabled={isDisabled}
                />
              }
              label="Active"
            />
          </FormGroup>
        </Grid>

        <Grid size={12}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="contained" onClick={() => navigate("/categories")}>
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
  );
}
