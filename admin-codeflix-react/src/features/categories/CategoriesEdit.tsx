import { Box, Paper, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Category } from "../../types/category";
import {
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} from "./categorySlice";
import CategoriesForm from "./components/cayegoriesForm";

export default function CategoriesEdit() {
  const params = useParams();
  const id = params.id ?? "";

  const navigate = useNavigate();

  const {
    data: resultGetCategory,
    isError,
    isFetching,
  } = useGetCategoryByIdQuery(id);
  const [updateCategory, resultUpdateCategory] = useUpdateCategoryMutation();

  const [isDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(isFetching);

  const [categoryData, setCategoryData] = useState<Category>({
    category_id: "",
    name: "",
    description: "",
    is_active: false,
    created_at: new Date(),
  });

  function handleInputToggleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = event.target;
    setCategoryData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setCategoryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { name, description, is_active } = categoryData;
    setIsLoading(true);

    await updateCategory({ category_id: id, name, description, is_active });
  }

  useEffect(() => {
    if (resultGetCategory && resultGetCategory.data) {
      setCategoryData(resultGetCategory.data);
    }

    if (isError) {
      enqueueSnackbar("Erro ao buscar dados da Categoria!", {
        variant: "error",
      });
    }

    setIsLoading(false);
  }, [resultGetCategory, isError]);

  useEffect(() => {
    if (resultUpdateCategory.isSuccess) {
      enqueueSnackbar("Categoria atualizada com sucesso!", {
        variant: "success",
      });

      navigate("/categories");
      setIsLoading(false);
    }

    if (resultUpdateCategory.isError) {
      enqueueSnackbar("Erro ao atualizar categoria!", {
        variant: "error",
      });
      setIsLoading(false);
    }
  }, [resultUpdateCategory]);

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
        <Typography variant="h4">Editar Categorias</Typography>

        <CategoriesForm
          category={categoryData}
          isDisabled={isDisabled}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
          handleInputToggleChange={handleInputToggleChange}
          handleSubmit={handleSubmit}
        />
      </Paper>
    </Box>
  );
}
