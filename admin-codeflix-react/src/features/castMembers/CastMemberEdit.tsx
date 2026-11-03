import { Box, Paper, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  useGetCastMemberByIdQuery,
  useUpdateCastMemberMutation,
} from "./castMemberSlice";
import CastMembersForm from "./components/CastMemberForm";
import type { CastMember, CastMemberType } from "../../shared/types/castMember";

export default function CastMembersEdit() {
  const params = useParams();
  const id = params.id ?? "";

  const navigate = useNavigate();

  const {
    data: resultGetCastMember,
    isError,
    isFetching,
  } = useGetCastMemberByIdQuery(id);
  const [updateCastMember, resultUpdateCastMember] =
    useUpdateCastMemberMutation();

  const [isDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(isFetching);

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

    await updateCastMember({
      cast_member_id: id,
      name,
      type,
    });
  }

  useEffect(() => {
    if (resultGetCastMember && resultGetCastMember.data) {
      setCastMemberData(resultGetCastMember.data);
    }

    if (isError) {
      enqueueSnackbar("Erro ao buscar dados do membro da equipe!", {
        variant: "error",
      });
    }

    setIsLoading(false);
  }, [resultGetCastMember, isError]);

  useEffect(() => {
    if (resultUpdateCastMember.isSuccess) {
      enqueueSnackbar("Membro da equipe atualizado com sucesso!", {
        variant: "success",
      });

      navigate("/cast-members");
      setIsLoading(false);
    }

    if (resultUpdateCastMember.isError) {
      enqueueSnackbar("Erro ao atualizar membro da equipe!", {
        variant: "error",
      });
      setIsLoading(false);
    }
  }, [resultUpdateCastMember]);

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
        <Typography variant="h4">Editar Membro da Equipe</Typography>

        <CastMembersForm
          castMember={castMemberData}
          isDisabled={isDisabled}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
          handleCastMemberTypeChange={handleCastMemberTypeChange}
          handleSubmit={handleSubmit}
        />
      </Paper>
    </Box>
  );
}
