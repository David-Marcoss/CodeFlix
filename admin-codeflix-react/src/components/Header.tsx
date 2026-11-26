import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import MenuIcon from "@mui/icons-material/Menu"
import BrightnessHighIcon from "@mui/icons-material/BrightnessHigh"
import Brightness3Icon from "@mui/icons-material/Brightness3"
import { useToogleThreme } from "../shared/hooks/useToogleThreme"
import { drawerWidth } from "./MenuDrawer"
import { Box } from "@mui/material"
import { useAppSelector } from "../app/hooks"
import { selectAuth } from "../features/auth/authSlice"
import { logoutFromKeycloak } from "../shared/auth/keycloackConfig"

type HeaderProps = {
  handleDrawerClose?: () => void
}

export default function Header({ handleDrawerClose }: HeaderProps) {
  const { theme, onThremeChange } = useToogleThreme()

  const authState = useAppSelector(selectAuth)

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        bgcolor: "background.paper",
        color: "text.primary",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="Abrir menu"
          sx={{ display: { sm: "none" } }}
          onClick={handleDrawerClose}
        >
          <MenuIcon />
        </IconButton>
        {/* <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
          CodeFlix
        </Typography> */}

        <Box sx={{ flex: 1 }}></Box>
        <Box>
          <Tooltip
            title={
              theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"
            }
          >
            <IconButton
              color="inherit"
              aria-label="Alternar tema"
              onClick={() =>
                onThremeChange(theme === "dark" ? "light" : "dark")
              }
            >
              {theme === "dark" ? <BrightnessHighIcon /> : <Brightness3Icon />}
            </IconButton>
          </Tooltip>
          {authState.isAuthenticated && (
            <Button
              color="inherit"
              sx={{ textTransform: "none", fontWeight: 600 }}
              onClick={() => {
                void logoutFromKeycloak().catch(() =>
                  window.alert("Não foi possível sair. Tente novamente."),
                )
              }}
            >
              Sair
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
