"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { DUMMY_USERS } from "@/data/dummy-users";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate API delay
    await new Promise((res) => setTimeout(res, 1000));

    const user = DUMMY_USERS.find(
      (user) => user.email === email && user.password === password
    );
    if (user) {
      // Save user info in cookie (expires in 7 days)
      Cookies.set(
        "user-auth",
        JSON.stringify({
          id: user.id,
          name: user.name,
          role: user.role,
          email: user.email,
        }),
        { expires: 7 }
      );

      router.push("/board");
      router.refresh(); // Refresh to update middleware state
    } else {
      setError("Invalid email or password");
      setLoading(false);
    }
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
      <Paper elevation={3} sx={{ p: 4, width: 400, borderRadius: 2 }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="h5" fontWeight={700} color="primary">
            Ray Advertising
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Log in to your account
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            sx={{ mb: 2 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            sx={{ mb: 3 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            size="large"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Log In"
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
