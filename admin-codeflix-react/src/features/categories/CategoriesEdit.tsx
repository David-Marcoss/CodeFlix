import { Box, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { RootState } from "../../app/store";
import { selectCategoryById, type Category } from "./categorySlice";
import CategoriesForm from "./components/cayegoriesForm";
import { useAppDispatch } from "../../app/hooks";
import { enqueueSnackbar } from "notistack";

export default function CategoriesEdit() {
  const params = useParams();
  const id = params.id ?? "";

  const navigate = useNavigate();

  const category = selectCategoryById(
    useSelector((state: RootState) => state),
    id,
  );

  const dispash = useAppDispatch();

  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [categoryData, setCategoryData] = useState<Category>({
    category_id: category?.category_id || "",
    name: category?.name || "",
    description: category?.description || "",
    is_active: category?.is_active || false,
    created_at: category?.created_at || new Date(),
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispash({
      type: "category/updateCategory",
      payload: categoryData,
    });

    enqueueSnackbar("Categoria atualizada com sucesso!", { variant: "success" });

    navigate("/categories");
  }

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
