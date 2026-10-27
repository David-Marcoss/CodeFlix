import { Box, useTheme} from "@mui/material";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const currentTheme = useTheme();

  return (
    <Box
      sx={{ p: 8, backgroundColor: currentTheme.palette.background.default, height: "100%" }}
    >
      {children}
    </Box>
  );
}
