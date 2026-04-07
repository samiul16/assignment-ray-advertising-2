"use client";
import { Button, Box, Typography, Paper, TextField } from "@mui/material";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    // Perform login logic...
    router.push("/board");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f4f5f7",
      }}
    >
      <Paper sx={{ p: 4, width: 400, textAlign: "center" }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
          Log in to Jira
        </Typography>
        <TextField fullWidth label="Email" sx={{ mb: 2 }} />
        <TextField fullWidth label="Password" type="password" sx={{ mb: 3 }} />
        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          size="large"
        >
          Log In
        </Button>
      </Paper>
    </Box>
  );
}
