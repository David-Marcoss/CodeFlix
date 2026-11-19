import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material"
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined"
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined"
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined"
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutlined"
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutlined"
import { NavLink } from "react-router-dom"

const routes = [
  { name: "Videos", path: "/videos", icon: MovieOutlinedIcon },
  { name: "Categorias", path: "/categories", icon: CategoryOutlinedIcon },
  { name: "Gêneros", path: "/genres", icon: LocalOfferOutlinedIcon },
  { name: "Membros do Elenco", path: "/cast-members", icon: PeopleOutlineIcon },
]

export const drawerWidth = 256

type MenuDrawerProps = {
  mobileOpen: boolean
  handleDrawerClose: () => void
}

export default function MenuDrawer({
  mobileOpen,
  handleDrawerClose,
}: MenuDrawerProps) {
  const drawer = (
    <Box sx={{ height: "100%", bgcolor: "background.paper" }}>
      <Toolbar sx={{ gap: 1.5, px: 3 }}>
        <PlayCircleOutlineIcon color="secondary" sx={{ fontSize: 32 }} />
        <Typography
          variant="h6"
          sx={{ fontWeight: 800, letterSpacing: "-0.5px" }}
        >
          CodeFlix
        </Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ px: 3, pt: 3, pb: 1 }}>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ fontWeight: 600, letterSpacing: 1.5 }}
        >
          Catálogo
        </Typography>
      </Box>
      <List sx={{ px: 1.5 }}>
        {routes.map(({ name, path, icon: Icon }) => (
          <ListItem key={path} disablePadding sx={{ mb: 0.75 }}>
            <ListItemButton
              component={NavLink}
              to={path}
              onClick={handleDrawerClose}
              sx={{
                borderRadius: 2,
                px: 2,
                minHeight: 48,
                color: "text.secondary",
                "&.active": {
                  bgcolor: "action.selected",
                  color: "secondary.main",
                  "& .MuiListItemText-primary": { fontWeight: 700 },
                },
                "&.active:hover": { bgcolor: "action.selected" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 38, color: "inherit" }}>
                <Icon />
              </ListItemIcon>
              <ListItemText
                primary={name}
                slotProps={{
                  primary: { variant: "body2", sx: { fontWeight: 500 } },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  const paperStyles = { boxSizing: "border-box", width: drawerWidth } as const

  return (
    <Box
      component="nav"
      aria-label="Navegação principal"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerClose}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": paperStyles,
        }}
        slotProps={{ root: { keepMounted: true } }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": paperStyles,
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  )
}
