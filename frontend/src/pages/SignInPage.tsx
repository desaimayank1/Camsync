import React, { useState } from "react";
import { TextField, Button, Card, CardContent, InputAdornment, IconButton } from "@mui/material";
import { VideoCameraFrontRounded, Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const SignupPage: React.FC = () => {
    const [userEmail, setUserEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useUserStore();

    const handleToggle = () => setShowPassword((prev) => !prev);

    const handleSignup = async () => {
        if (userEmail && password) {
            console.log(userEmail, password)
            try {
                const response = await axios.post(`${BACKEND_URL}/auth/signin`, {
                    email: userEmail,
                    password: password
                },{
                    withCredentials:true,
                }
                );

                const data = response.data;
                console.log(data)
                if (data.success) {
                    const user = {
                        email: data.email as string,
                        id: data.id as number,
                    }
                    setUser(user);
                    navigate("/dashboard")
                }

                setError(data.message);
            } catch (error) {
                console.log("error fetching user login", error);
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="w-[90%] max-w-lg shadow-lg h-[440px] !rounded-2xl">
                <CardContent className="flex flex-col gap-6 p-8 mx-8">
                    <div className="text-center">
                        <div className="flex justify-center mb-3 text-blue-600 text-4xl">
                            <VideoCameraFrontRounded className="!w-10 !h-10" />
                        </div>
                        <h2 className="text-2xl font-semibold">Sign in</h2>
                        <p className="text-sm text-gray-500">to continue to Camera System</p>
                    </div>

                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        value={userEmail}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "14px",
                            },
                        }}
                        onChange={(e) => setUserEmail(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        fullWidth
                        value={password}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "14px",
                            },
                        }}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleToggle} edge="end">
                                            {showPassword ?  <Visibility />:<VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="">
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            className="!rounded-lg !py-3"
                            onClick={handleSignup}
                        >
                            Signup
                        </Button>
                        {error && <span className="text-red-400 mx-auto">{error}</span>}
                    </div>

                    <div className=" mx-auto">Already have account? <span className="text-blue-500 hover:cursor-pointer hover:underline" onClick={() => navigate('/')}>Log in</span></div>
                </CardContent>

            </Card>
        </div>
    );
};

export default SignupPage;
