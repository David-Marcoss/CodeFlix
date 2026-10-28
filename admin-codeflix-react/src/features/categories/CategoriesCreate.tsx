import { Box, Paper, Typography } from "@mui/material";
import { nanoid } from "@reduxjs/toolkit";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { createCategory, type Category } from "./categorySlice";
import CategoriesForm from "./components/cayegoriesForm";
import { enqueueSnackbar } from "notistack";

export default function CategoriesCreate() {

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const [isDisabled, setIsDisabled] = useState(false);
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch(createCategory({ ...categoryData, category_id: nanoid() }));

    enqueueSnackbar("Categoria criada com sucesso!", { variant: "success" });

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
        <Typography variant="h4">Criar Categoria</Typography>

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
