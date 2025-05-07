import { Alert, Avatar, Box, Button, Checkbox, Container, FormControlLabel, Grid2, Paper, Snackbar, TextField, Typography } from "@mui/material";
import { LockOpen } from "@mui/icons-material";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import MyContext from "../context/context";

const LoginPage = () => {
    const [userEmail, setUserEmail] = useState("");
    const [password, setPassword] = useState("");
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const { login } = useContext(MyContext)!;

    const navigate = useNavigate();

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (userEmail.trim() === "" || !emailPattern.test(userEmail)) {
            setError("Enter valid email!");
            setOpen(true);
            return;
        }

        const data = {
            email: userEmail,
            password: password
        }

        try {
            await login(data);
            setSuccess(true);
            setError(null);
            setOpen(true);
            // Redirect after successful login
            setTimeout(() => {
                navigate('/');
            }, 500);
        } catch (err) {
            setError("Login failed. " + err);
            setSuccess(false);
            setOpen(true);
        }
    }

    return (
        <Container
            maxWidth="xs"
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "80vh",
            }}
        >
            <Paper elevation={3} sx={{ marginTop: 8, padding: 4 }}>
                <Avatar sx={{
                    mx: "auto",
                    bgcolor: "secondary.main",
                    textAlign: "center",
                    mb: 1,
                }}>
                    <LockOpen />
                </Avatar>
                <Typography component={"h1"} variant={"h5"} sx={{ textAlign: "center" }}>
                    Sign In
                </Typography>
                <Box
                    component={"form"}
                    onSubmit={handleFormSubmit}
                    noValidate
                    sx={{ mt: 3 }}
                >
                    <TextField
                        placeholder="Enter username"
                        fullWidth
                        required
                        autoFocus
                        sx={{ mb: 2 }}
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                    />
                    <TextField
                        placeholder="Enter password"
                        fullWidth
                        required
                        type="password"
                        sx={{ mb: 2 }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <FormControlLabel control={<Checkbox value="remember" property="primary" />}
                        label="Remember me"
                    />
                    <Grid2 container spacing={2}>
                        <Grid2 size={6}>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                color="success"
                                sx={{ mt: 2 }}
                            >
                                Sign In
                            </Button>
                        </Grid2>
                        <Grid2 size={6}>
                            <Button
                                href="/signup"
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                Sign Up
                            </Button>
                        </Grid2>
                    </Grid2>
                </Box>
            </Paper>

            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={() => setOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert severity={error ? "error" : "success"} onClose={() => setOpen(false)}>
                    {error ? error : "Login Successful! Redirecting..."}
                </Alert>
            </Snackbar>
        </Container>
    )
}

export default LoginPage;