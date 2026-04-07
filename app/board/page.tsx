/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useMemo, useEffect } from "react";
import Board from "@/components/Board/Board";
import AddTaskModal from "@/components/AddTaskModal";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Typography,
  IconButton,
  GlobalStyles,
  Avatar,
  AvatarGroup,
  Breadcrumbs,
  Link,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SettingsIcon from "@mui/icons-material/Settings";

export default function BoardPage() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#0052CC" },
          background: {
            default: mode === "light" ? "#FFFFFF" : "#091E42",
            paper: mode === "light" ? "#F4F5F7" : "#1d2125",
          },
          text: {
            primary: mode === "light" ? "#172B4D" : "#B8C7E0",
          },
        },
        typography: {
          fontFamily: "inherit",
          h5: { fontWeight: 600, fontSize: "1.5rem" },
          h6: { fontWeight: 600, fontSize: "1.1rem" },
        },
        shape: { borderRadius: 3 },
      }),
    [mode]
  );

  if (!mounted) return null;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={{ ".MuiDialog-root": { zIndex: 9999 } }} />

      <Box sx={{ display: "flex", height: "100vh" }}>
        {/* SIDEBAR (Mocking Jira Sidebar) */}
        <Box
          sx={{
            width: 240,
            borderRight: "1px solid",
            borderColor: "divider",
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            p: 2,
            bgcolor: mode === "light" ? "#F4F5F7" : "#161B22",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 4 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                bgcolor: "primary.main",
                borderRadius: 1,
              }}
            />
            <Box>
              <Typography variant="subtitle2" fontWeight={700}>
                Marketing Campaign
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Software project
              </Typography>
            </Box>
          </Box>
          <Typography
            variant="caption"
            fontWeight={700}
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            PLANNING
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Box
              sx={{
                p: 1,
                bgcolor: "action.selected",
                borderRadius: 1,
                color: "primary.main",
                fontWeight: 600,
              }}
            >
              Kanban board
            </Box>
            <Box sx={{ p: 1, color: "text.secondary" }}>Timeline</Box>
            <Box sx={{ p: 1, color: "text.secondary" }}>Issues</Box>
            <Box sx={{ p: 1, color: "text.secondary" }}>Reports</Box>
          </Box>
        </Box>

        {/* MAIN CONTENT */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          {/* TOP NAV */}
          <Box
            sx={{
              height: 56,
              borderBottom: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              px: 3,
              justifyContent: "space-between",
            }}
          >
            <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.85rem" }}>
              <Link underline="hover" color="inherit" href="#">
                Projects
              </Link>
              <Link underline="hover" color="inherit" href="#">
                Marketing Campaign
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
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
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
              <NotificationsNoneIcon
                fontSize="small"
                sx={{ color: "text.secondary" }}
              />
              <HelpOutlineIcon
                fontSize="small"
                sx={{ color: "text.secondary" }}
              />
              <SettingsIcon fontSize="small" sx={{ color: "text.secondary" }} />
              <Avatar
                sx={{ width: 28, height: 28 }}
                src="https://i.pravatar.cc/150?u=1"
              />
            </Box>
          </Box>

          {/* BOARD HEADER */}
          <Box sx={{ px: 3, pt: 3, pb: 2 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Marketing
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <AvatarGroup max={4}>
                <Avatar
                  sx={{ width: 32, height: 32 }}
                  src="https://i.pravatar.cc/150?u=2"
                />
                <Avatar
                  sx={{ width: 32, height: 32 }}
                  src="https://i.pravatar.cc/150?u=3"
                />
                <Avatar
                  sx={{ width: 32, height: 32 }}
                  src="https://i.pravatar.cc/150?u=4"
                />
                <Avatar
                  sx={{ width: 32, height: 32 }}
                  src="https://i.pravatar.cc/150?u=5"
                />
              </AvatarGroup>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Group by: <b>None</b>
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <AddTaskModal />
            </Box>
          </Box>

          {/* BOARD BODY */}
          <Box sx={{ flex: 1, overflow: "hidden" }}>
            <Board />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
