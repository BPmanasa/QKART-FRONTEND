import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { Link } from 'react-router-dom';
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import { Avatar, Button, Stack,  Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ProductCard from '../components/ProductCard';
import "./Products.css"

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [productData, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  useEffect(() => {
    performAPICall();
  }, []);

  const performAPICall = async () => {
    try {
      const response = await axios.get(`${config.endpoint}/products`);
      setProductData(response.data);
    } catch (e) {
      handleAPIError(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAPIError = (e) => {
    if (e.response) {
      if (e.response.status === 404) {
        setProductData([]);
      }
      if (e.response.status === 500) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      }
    } else {
      enqueueSnackbar("Could not fetch products. Check that the backend is running, reachable, and returns valid JSON.", { variant: "error" });
    }
  };

  const debounceSearch = (text) => {
    clearTimeout(debounceTimeout);
    const timerId = setTimeout(() => performSearch(text), 800);
    setDebounceTimeout(timerId);
  };

  const performSearch = async (text) => {
    try {
      const response = await axios.get(`${config.endpoint}/products/search?value=${text}`);
      setProductData(response.data);
    } catch (e) {
      handleAPIError(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header >
      <TextField
        className="search-desktop"
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => debounceSearch(e.target.value)}
      />
      </Header>
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => debounceSearch(e.target.value)}
      />

      <Grid container>
        <Grid item className="product-grid">
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span> to your doorstep
            </p>
          </Box>
        </Grid>
      </Grid>
      {isLoading ? (
        <Box className="loading">
          <CircularProgress />
          <Typography variant="body1">Loading Products...</Typography>
        </Box>
      ) : (
        productData.length ? (
          <Grid container spacing={3} marginY={1} paddingX={1}>
            {productData.map((product) => (
              <Grid item xs={6} md={3} key={product._id}>
                <ProductCard productData={product} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box className="loading">
            <SentimentDissatisfied />
            <Typography variant="body1">no products found</Typography>
          </Box>
        )
      )}
      <Footer />
    </div>
  );
};

export default Products;
