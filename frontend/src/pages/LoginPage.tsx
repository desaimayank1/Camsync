import React, { useState } from "react";
import { TextField, Button, Alert, Card, CardContent } from "@mui/material";
import { VideoCameraFrontRounded } from "@mui/icons-material";

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState(false);

    const handleLogin = () => {
        if (username && password) setSuccess(true);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="w-[90%] max-w-lg shadow-lg h-[400px] !rounded-2xl">
                <CardContent className="flex flex-col gap-6 p-8 mx-8">
                    <div className="text-center">
                        <div className="flex justify-center mb-3 text-blue-600 text-4xl">
                           <VideoCameraFrontRounded className="!w-10 !h-10"/>
                        </div>
                        <h2 className="text-2xl font-semibold">Sign in</h2>
                        <p className="text-sm text-gray-500">to continue to Camera System</p>
                    </div>

                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        value={username}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "14px",
                            },
                        }}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={password}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "14px",
                            },
                        }}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        className="!rounded-lg !py-3"
                        onClick={handleLogin}
                    >
                        Login
                    </Button>

                    {success && (
                        <Alert severity="success">Authentication successful</Alert>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;
