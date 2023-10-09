import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";


const Register = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegister = async () => {
    if(!validateInput(formData)) return;

      
      try {
        setLoading(true);
        await axios.post(`${config.endpoint}/auth/register`,{
          username: formData.username,
          password: formData.password,
        });
        setLoading(false);
        // setFormData({
        //   username:"",
        //   password:"",
        //   confirmPassword:""
        // });
        enqueueSnackbar("Registered Successfully", {variant: "success"});
        history.push("/login");
  
      }
      catch(e){
        setLoading(false);
        if(e.response && e.response.status === 400){
          enqueueSnackbar(e.response.data.message, {variant: "error"});
        }else{
          enqueueSnackbar("Something went. Check that the backend is running, reachable and return valid JSON.",
          {variant: "error"}
          );
        }
      }
  
      };
      
  const validateInput = (data) => {
    const { username, password, confirmPassword } = data;

    if (!username) {
      enqueueSnackbar("Username is a required field", { variant: "error" });
      return false;
    }

    if (username.length < 6) {
      enqueueSnackbar("Username must be at least 6 characters", { variant: "error" });
      return false;
    }

    if (!password) {
      enqueueSnackbar("Password is a required field", { variant: "error" });
      return false;
    }

    if (password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters", { variant: "error" });
      return false;
    }

    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "error" });
      return false;
    }

    return true;
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
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            value={formData.username}
            onChange={handleInputChange}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be at least 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            value={formData.password}
            onChange={handleInputChange}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
          <Button
            className="button"
            variant="contained"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Register Now"}
          </Button>
          <p className="secondary-action">
            Already have an account?{" "}
            <Link className="link" to='/login'>
              Login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
