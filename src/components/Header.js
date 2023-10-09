import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import axios from "axios";
import { config } from "../App";
import Products from '../components/Products';
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useHistory, Link } from "react-router-dom";

import "./Header.css";



const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
  const isLoggedIn = localStorage.getItem("token");
  const userName = localStorage.getItem("username");

  

if(!hasHiddenAuthButtons){
  return (
    <Box className="header">
      <Box className="header-title">
          <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {children}
    
      <Stack direction='row' spacing={1} alignItems='center'>
      {/* <TextField />
        */}
        {isLoggedIn ? 
        <>
          <Avatar
            src='avatar.png'
            alt={userName}></Avatar>
            <p class="username">{userName}</p>
            <><Button onClick={() => {
              localStorage.clear()
              window.location.reload()
            } }>Logout
            </Button></></>
            :<><Button
            variant="text"
            onClick={() => {
           history.push('/login');

        }}
      > 
      Login
      </Button>
      <Button
        className="explore-button2"
        variant='contained'
        onClick={() =>{
          history.push('/register');
        }}
      >
        Register
       </Button></>
      }
      </Stack>
    </Box>
  );

}

  
    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() =>{
            history.push('/');
          }}
        >
          Back to explore
          </Button>
      </Box>
    );
};

export default Header;
