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
import type { Category } from "../categorySlice";

interface CategoriesFormProps {
  category: Category;
  isLoading: boolean;
  isDisabled: boolean;
  handleSubmit(event: React.FormEvent<HTMLFormElement>): void;
  handleInputChange(event: React.ChangeEvent<HTMLInputElement, Element>): void;
  handleInputToggleChange(
    event: React.ChangeEvent<HTMLInputElement, Element>,
  ): void;
}

export default function CategoriesForm({
  category,
  isLoading,
  isDisabled,
  handleSubmit,
  handleInputChange,
  handleInputToggleChange,
}: CategoriesFormProps) {
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
              value={category?.name || ""}
              disabled={isDisabled}
              onChange={handleInputChange}
            />
          </FormControl>
        </Grid>

        <Grid size={12}>
          <FormControl fullWidth>
            <TextField
              required
              name="description"
              label="Descrição"
              value={category?.description || ""}
              disabled={isDisabled}
              onChange={handleInputChange}
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
                  checked={category?.is_active || false}
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
            >
              {isLoading ? "Loading..." : "Salvar"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
}
