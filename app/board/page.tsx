/* eslint-disable react-hooks/set-state-in-effect */
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
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export default function BoardPage() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#0052CC" }, // Jira Blue
          background: {
            default: mode === "light" ? "#FFFFFF" : "#091E42",
            paper: mode === "light" ? "#F4F5F7" : "#161B22",
          },
        },
        shape: { borderRadius: 3 }, // Jira uses slightly rounded corners
        components: {
          MuiButton: {
            styleOverrides: {
              root: { textTransform: "none", fontWeight: 500 },
            },
          },
          MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
        },
      }),
    [mode]
  );

  if (!mounted) return null;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Fix for Modal z-index: Ensure no parent has 'transform' when modal is open */}
      <GlobalStyles styles={{ ".MuiDialog-root": { zIndex: 9999 } }} />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          bgcolor: "background.default",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 3,
            py: 1.5,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" fontWeight={700} color="text.primary">
            Kanban Project
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              onClick={() => setMode(mode === "light" ? "dark" : "light")}
            >
              {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <AddTaskModal />
          </Box>
        </Box>

        {/* Board Area */}
        <Box sx={{ flex: 1, overflow: "hidden" }}>
          <Board />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
