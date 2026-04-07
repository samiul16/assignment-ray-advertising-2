/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Typography,
  IconButton,
  GlobalStyles,
  Avatar,
  TextField,
  InputAdornment,
  Breadcrumbs,
  Link,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // MOCK AUTH CHECK (Replace with your actual auth logic)
  const isAuthenticated = true; // Set to false to test redirect

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#0052CC" },
          background: {
            default: mode === "light" ? "#FFFFFF" : "#0f172a",
            paper: mode === "light" ? "#F4F5F7" : "#1d2125",
          },
        },
        shape: { borderRadius: 3 },
      }),
    [mode]
  );

  if (!mounted || !isAuthenticated) return null;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={{ ".MuiDialog-root": { zIndex: 9999 } }} />

      <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        {/* SIDEBAR */}
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
                Marketing
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
            sx={{ mb: 1, px: 1 }}
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
                cursor: "pointer",
              }}
            >
              Kanban board
            </Box>
            <Box
              sx={{
                p: 1,
                color: "text.secondary",
                cursor: "pointer",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              Timeline
            </Box>
            <Box
              sx={{
                p: 1,
                color: "text.secondary",
                cursor: "pointer",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              Issues
            </Box>
          </Box>
        </Box>

        {/* MAIN AREA */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          {/* NAVBAR */}
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

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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
              <Avatar sx={{ width: 28, height: 28, cursor: "pointer" }} />
            </Box>
          </Box>

          {/* PAGE CONTENT (The Board) */}
          <Box
            sx={{
              flex: 1,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
