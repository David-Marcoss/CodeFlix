import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdateGenreMutation, useGetGenreByIdQuery } from "./genreSlice";
import GenreForm from "./components/genreForm";
import { enqueueSnackbar } from "notistack";
import type { Genre } from "../../shared/types/genre";
import { useGetCategoriesQuery } from "../categories/categorySlice";

export default function GenreEdit() {
  const params = useParams();
  const id = params.id ?? "";

  const navigate = useNavigate();

  const [updateGenre, result] = useUpdateGenreMutation();
  const {
    data: resultGetGenre,
    isError: isErrorGetGenre,
    isFetching,
  } = useGetGenreByIdQuery(id);

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
        })),
      );
    }
  }, [categoriesResult, isError]);

  useEffect(() => {
    if (!isErrorGetGenre && resultGetGenre?.data) {
      setGenreData(resultGetGenre.data);
    }
  }, [resultGetGenre, isErrorGetGenre]);

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

    await updateGenre({ genre_id: id, name, categories_id, is_active });
  }

  useEffect(() => {
    if (result.isSuccess) {
      enqueueSnackbar("Genero atualizado com sucesso!", {
        variant: "success",
      });

      navigate("/genres");
    }

    if (result.isError) {
      enqueueSnackbar("Erro ao atualizar genero!", {
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
        <Typography variant="h4">Atualizar Genero</Typography>

        <GenreForm
          genre={genreData}
          isLoading={isFetching}
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
