    import { LockOutlined } from "@mui/icons-material";
    import { Alert, Avatar, Box, Button, Checkbox, Container, FormControlLabel, Grid2, Paper, Snackbar, TextField, Typography } from "@mui/material";
    import { useState } from "react";
import { useNavigate } from "react-router-dom";

    const SignupPage = () => {
        const [userEmail, setUserEmail] = useState("");
        const [pass1, setPass1] = useState("");
        const [pass2, setPass2] = useState("");
        const [error, setError] = useState<string|null>(null);
        const [open, setOpen] = useState(false);

        const navigate = useNavigate();

        const handleFormSubmit = (e:React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if(userEmail.trim() === "" || !emailPattern.test(userEmail)){
                setError("Enter valid email!");
                setOpen(true);
                return;
            }
            if(pass1 !== pass2){
                setError("Passwords do not match!");
                setOpen(true);
                return;
            }

            const user = {
                email: userEmail,
                password: pass1,
            }

            fetch('http://127.0.0.1:8080/users/', {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(user),
            })
                .then(async (res) => {
                    if(!res.ok){
                        const errorData = await res.json();
                        throw new Error(errorData.message || "Failed to create user!");
                    }
                    return res.json();
                })
                .then(data => {
                    localStorage.setItem("token", JSON.stringify(data));
                    setError(null);
                    setOpen(true);
                    setTimeout(() => {
                        navigate('/');
                    }, 500);
                })
                .catch((err) => {
                    // console.error("Signup Error:", err.message);
                    setError(err.message)
                    setOpen(true);
                })

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
                        <LockOutlined />
                    </Avatar>
                    <Typography component={"h1"} variant={"h5"} sx={{ textAlign: "center" }}>
                        Sign Up
                    </Typography>
                    <Box
                        component={"form"}
                        onSubmit={handleFormSubmit}
                        noValidate
                        sx={{ mt: 3 }}
                    >
                        <TextField
                            placeholder="Enter email"
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
                            value={pass1}
                            onChange={(e) => setPass1(e.target.value)}
                        />
                        <TextField
                            placeholder="Enter password again"
                            fullWidth
                            required
                            type="password"
                            sx={{ mb: 2 }}
                            value={pass2}
                            onChange={(e) => setPass2(e.target.value)}
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
                                    Sign Up
                                </Button>
                            </Grid2>
                            <Grid2 size={6}>
                                <Button
                                    href="/signin"
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                >
                                    Sign In
                                </Button>
                            </Grid2>
                        </Grid2>
                    </Box>
                </Paper>

                {/* MUI Snackbar Alert */}
                <Snackbar
                    open={open}
                    autoHideDuration={4000}
                    onClose={() => setOpen(false)}
                    anchorOrigin={{vertical: "top", horizontal: "center"}}
                >
                    <Alert severity={error ? "error" : "success"} onClose={() => setOpen(false)}>
                        {error ? error : "Signup Successful!"}
                    </Alert>
                </Snackbar>
            </Container>
        )
    }

    export default SignupPage