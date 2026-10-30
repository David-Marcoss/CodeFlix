import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateCategoryMutation } from "./categorySlice";
import CategoriesForm from "./components/cayegoriesForm";
import { enqueueSnackbar } from "notistack";
import type { Category } from "../../types/category";

export default function CategoriesCreate() {
  const navigate = useNavigate();

  const [createCategory, result] = useCreateCategoryMutation();

  const [isLoading, setIsLoading] = useState(false);

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

    await createCategory({ name, description, is_active });
  }

  useEffect(() => {
    if (result.isSuccess) {
      enqueueSnackbar("Categoria criada com sucesso!", {
        variant: "success",
      });

      navigate("/categories");
      setIsLoading(false);
    }

    if (result.isError) {
      enqueueSnackbar("Erro ao criada categoria!", {
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
        <Typography variant="h4">Criar Categoria</Typography>

        <CategoriesForm
          category={categoryData}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
          handleInputToggleChange={handleInputToggleChange}
          handleSubmit={handleSubmit}
        />
      </Paper>
    </Box>
  );
}
