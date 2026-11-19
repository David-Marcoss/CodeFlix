import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import BrightnessHighIcon from "@mui/icons-material/BrightnessHigh";
import Brightness3Icon from "@mui/icons-material/Brightness3";
import { useToogleThreme } from "../shared/hooks/useToogleThreme";

export default function Header() {
  const { theme, onThremeChange } = useToogleThreme();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
          <Button
            color="inherit"
            aria-label="Alternar tema"
            onClick={() =>
              theme === "dark"
                ? onThremeChange("light")
                : onThremeChange("dark")
            }
          >
            {theme === "dark" ? <Brightness3Icon /> : <BrightnessHighIcon />}
          </Button>

          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
