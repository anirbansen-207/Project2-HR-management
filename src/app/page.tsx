"use client";

import { login, signup } from "../app/login/actions";
import { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (
    formAction: (formData: FormData) => Promise<void>
  ) => {
    setLoading(true);
    setError("");

    try {
      // Create FormData from state variables
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      await formAction(formData);
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(
        err?.message || "Authentication failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f6f8",
      }}
    >
      <Card sx={{ width: 400, p: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            HR Management - Login
          </Typography>

          {error && (
            <Typography color="error" sx={{ textAlign: "center", mb: 2 }}>
              {error}
            </Typography>
          )}

          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
            onClick={() => handleSubmit(login)}
          >
            {loading ? <CircularProgress size={24} /> : "Log in"}
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
            onClick={() => handleSubmit(signup)}
          >
            Sign up
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

