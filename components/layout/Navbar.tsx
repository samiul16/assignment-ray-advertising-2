"use client";
import { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  IconButton,
  Breadcrumbs,
  Link,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Badge,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";

interface NavbarProps {
  mode: "light" | "dark";
  setMode: (mode: "light" | "dark") => void;
  user: {
    name: string;
    email: string;
    role: string;
  };
  onLogout: () => void;
}

export default function Navbar({ mode, setMode, user, onLogout }: NavbarProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <Box
      sx={{
        height: 56,
        px: 3,
        borderBottom: "1px solid",
        borderColor: "divider",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Breadcrumbs sx={{ fontSize: "0.85rem" }}>
        <Link underline="hover" color="inherit" href="#">
          Projects
        </Link>
        <Typography color="text.primary" sx={{ fontSize: "0.85rem" }}>
          Marketing
        </Typography>
      </Breadcrumbs>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TextField
          size="small"
          placeholder="Search"
          InputProps={{
            startAdornment: (
              <SearchIcon fontSize="small" sx={{ mr: 1, opacity: 0.5 }} />
            ),
          }}
          sx={{ width: 200, "& .MuiOutlinedInput-root": { height: 32 } }}
        />

        <IconButton
          size="small"
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
        >
          {mode === "dark" ? (
            <Brightness7Icon fontSize="small" />
          ) : (
            <Brightness4Icon fontSize="small" />
          )}
        </IconButton>

        <IconButton size="small">
          <Badge color="error" variant="dot">
            <NotificationsNoneIcon fontSize="small" />
          </Badge>
        </IconButton>

        <Divider
          orientation="vertical"
          flexItem
          sx={{ mx: 1, height: 24, my: "auto" }}
        />

        {/* User Info & Avatar */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, ml: 1 }}>
          <Box
            sx={{ textAlign: "right", display: { xs: "none", sm: "block" } }}
          >
            <Typography variant="body2" fontWeight={600} lineHeight={1}>
              {user?.name}
            </Typography>
            <Typography
              variant="caption"
              color="primary"
              sx={{ textTransform: "uppercase", fontSize: 9 }}
            >
              {user?.role}
            </Typography>
          </Box>

          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ p: 0 }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontSize: "0.8rem",
                bgcolor: "primary.main",
              }}
            >
              {user?.name?.charAt(0)}
            </Avatar>
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2">{user?.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => setAnchorEl(null)}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>{" "}
            Profile Settings
          </MenuItem>
          <MenuItem onClick={onLogout} sx={{ color: "error.main" }}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" color="error" />
            </ListItemIcon>{" "}
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
