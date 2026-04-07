"use client";
import { Box, Typography } from "@mui/material";

interface SidebarProps {
  mode: "light" | "dark";
}

export default function Sidebar({ mode }: SidebarProps) {
  return (
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
        {["Timeline", "Issues", "Reports"].map((item) => (
          <Box
            key={item}
            sx={{
              p: 1,
              color: "text.secondary",
              cursor: "pointer",
              borderRadius: 1,
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            {item}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
