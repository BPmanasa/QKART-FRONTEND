import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateInput = (data) => {
    const errors = {};

    if (!data.username) {
      enqueueSnackbar("Username is a required field", { variant: "error" });
      return false;
    }
    
    if (!data.password) {
      enqueueSnackbar("Password is a required field", { variant: "error" });
      return false;
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const login = async (formData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${config.endpoint}/auth/login`, formData);
      if (response.status === 201) {
        const { token, username, balance } = response.data;
        persistLogin(token, username, balance);
        enqueueSnackbar("Logged in successfully", { variant: "success" });
        history.push("/");
      }
      else {
        enqueueSnackbar("Something went wrong. Check that the backend is running, reachable, and returns valid JSON.", { variant: "error" });
      }
    } catch (e) {
      if(e.response && e.response.status === 400){
        enqueueSnackbar(e.response.data.message, {variant: "error"});
      }else{
        enqueueSnackbar("Something went. Check that the backend is running, reachable and return valid JSON.",
        {variant: "error"}
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const persistLogin = (token, username, balance) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("balance", balance);
  };

  const handleSubmit = () => {
    if (validateInput(formData)) {
      login(formData);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
        <h2 className="title">Login</h2>
          <TextField
            name="username"
            label="Username"
            variant="outlined"
            fullWidth
            value={formData.username}
            onChange={handleInputChange}
            error={errors.username ? true : false}
            helperText={errors.username}
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password ? true : false}
            helperText={errors.password}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Login to Qkart"}
          </Button>
          <p className="secondary-action">
            Don't have an account?{" "}
          <Link className="link" to='/register'>
              Register now
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
