import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateGenreMutation } from "./genreSlice";
import GenreForm from "./components/genreForm";
import { enqueueSnackbar } from "notistack";
import type { Genre } from "../../shared/types/genre";
import { useGetCategoriesQuery } from "../categories/categorySlice";

export default function GenreCreate() {
  const navigate = useNavigate();

  const [createGenre, result] = useCreateGenreMutation();

  const [isLoading, setIsLoading] = useState(false);

  const [genreData, setGenreData] = useState<Genre>({
    genre_id: "",
    name: "",
    categories: [],
    categories_id: [],
    is_active: false,
    created_at: new Date().toISOString(),
  });

  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]);

  const { data: categoriesResult, isError } = useGetCategoriesQuery({
    perPage: 100,
  });

  useEffect(() => {
    if (!isError && categoriesResult?.data) {
      setCategories(
        categoriesResult.data.map((cat) => ({
          value: cat.category_id,
          label: cat.name,
        }))
      );
    }
  }, [categoriesResult, isError]);

  function handleInputToggleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = event.target;
    setGenreData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setGenreData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleCategoriesChange(values: string[]) {
    setGenreData((prevData) => ({
      ...prevData,
      categories_id: values,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const { name, categories_id, is_active } = genreData;
    setIsLoading(true);

    await createGenre({ name, categories_id, is_active });
  }

  useEffect(() => {
    if (result.isSuccess) {
      enqueueSnackbar("Genero criada com sucesso!", {
        variant: "success",
      });

      navigate("/genres");
      setIsLoading(false);
    }

    if (result.isError) {
      enqueueSnackbar("Erro ao criar genero!", {
        variant: "error",
      });
      setIsLoading(false);
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
        <Typography variant="h4">Criar Genero</Typography>

        <GenreForm
          genre={genreData}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
          handleInputToggleChange={handleInputToggleChange}
          handleSubmit={handleSubmit}
          categories={categories}
          
          handleCategoriesChange={handleCategoriesChange}
        />
      </Paper>
    </Box>
  );
}
