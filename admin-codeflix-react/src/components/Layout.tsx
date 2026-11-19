import { Box, CssBaseline, Toolbar } from "@mui/material"
import React, { useState } from "react"
import MenuDrawer from "./MenuDrawer"
import { AppThemeProvider } from "../shared/contexts/AppThemeProvider"
import Header from "./Header"

type LayoutProps = {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <AppThemeProvider>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          bgcolor: "background.default",
        }}
      >
        <Header handleDrawerClose={() => setDrawerOpen(true)} />
        <MenuDrawer
          mobileOpen={drawerOpen}
          handleDrawerClose={() => setDrawerOpen(false)}
        />
        <Box component="main" sx={{ flex: 1, minWidth: 0 }}>
          <Toolbar />
          <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>{children}</Box>
        </Box>
      </Box>
    </AppThemeProvider>
  )
}
