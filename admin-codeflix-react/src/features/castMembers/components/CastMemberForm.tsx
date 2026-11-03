import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import type {
  CastMember,
  CastMemberType,
} from "../../../shared/types/castMember";

interface CastMembersFormProps {
  castMember: CastMember;
  isLoading: boolean;
  isDisabled?: boolean;
  handleSubmit(event: React.FormEvent<HTMLFormElement>): void;
  handleInputChange(event: React.ChangeEvent<HTMLInputElement, Element>): void;
  handleCastMemberTypeChange(value: CastMemberType): void;
}

const castMemberTypes = [
  { value: "director", label: "Diretor" },
  { value: "actor", label: "Ator" },
];

export default function CastMembersForm({
  castMember,
  isLoading,
  isDisabled,
  handleSubmit,
  handleInputChange,
  handleCastMemberTypeChange,
}: CastMembersFormProps) {
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
              value={castMember?.name || ""}
              disabled={isDisabled}
              onChange={handleInputChange}
            />
          </FormControl>
        </Grid>

        <Grid size={12}>
          <FormControl fullWidth>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={castMember?.type}
                label="Type"
                onChange={(e) =>
                  handleCastMemberTypeChange(e.target.value as CastMemberType)
                }
              >
                {castMemberTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </FormControl>
        </Grid>

        <Grid size={12}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="contained" onClick={() => navigate("/cast-members")}>
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
