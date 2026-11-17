import { Box, Typography } from "@mui/material";

export const Ratting = ({ label, color }: { label: string; color: string }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 2,
      backgroundColor: color,
      color: "white",
    }}
  >
    <Typography>{label}</Typography>
  </Box>
);
