import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateCastMemberMutation } from "./castMemberSlice";
import CastMembersForm from "./components/CastMemberForm";
import { enqueueSnackbar } from "notistack";
import type { CastMember, CastMemberType } from "../../shared/types/castMember";

export default function CastMembersCreate() {
  const navigate = useNavigate();

  const [createCastMember, result] = useCreateCastMemberMutation();

  const [isLoading, setIsLoading] = useState(false);

  const [castMemberData, setCastMemberData] = useState<CastMember>({
    cast_member_id: "",
    name: "",
    type: "actor",
    created_at: new Date().toISOString(),
  });

  function handleCastMemberTypeChange(type: CastMemberType) {
    setCastMemberData((prevData) => ({
      ...prevData,
      type,
    }));
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setCastMemberData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const { name, type } = castMemberData;
    setIsLoading(true);

    await createCastMember({ name, type });
  }

  useEffect(() => {
    if (result.isSuccess) {
      enqueueSnackbar("Membro da equipe criado com sucesso!", {
        variant: "success",
      });

      navigate("/cast-members");
      setIsLoading(false);
    }

    if (result.isError) {
      enqueueSnackbar("Erro ao criar membro da equipe!", {
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
        <Typography variant="h4">Criar Membro da Equipe</Typography>

        <CastMembersForm
          castMember={castMemberData}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
          handleCastMemberTypeChange={handleCastMemberTypeChange}
          handleSubmit={handleSubmit}
        />
      </Paper>
    </Box>
  );
}
