import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import {
  Card,
  CardContent,
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
import Cart from './Cart'

import { generateCartItemsFrom } from './Cart'; 



const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [productData, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  // const [cartData, setCartData] = useState([]);
  const [items, setItems]= useState([]);
  const token = localStorage.getItem("token");


  

  const performAPICall = async () => {
    try {
      const response = await axios.get(`${config.endpoint}/products`);
      setProductData(response.data);
      return response.data;
    } catch (e) {
      enqueueSnackbar("Could not fetch products. Check that the backend is running, reachable, and returns valid JSON.", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };


  const debounceSearch = (text) => {
    const timerId = setTimeout(() => performSearch(text), 800);
    setDebounceTimeout(timerId);
  };

  useEffect(()=>{
    return ()=>{
      clearTimeout(debounceTimeout)
    }
  },[debounceTimeout])

  const performSearch = async (text) => {
    try {
      const response = await axios.get(`${config.endpoint}/products/search?value=${text}`);
      setProductData(response.data);
      return response.data;
    } catch (e) {
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
       
    }
  };
 
  const fetchCart = async (token) => {
  
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    return response.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };


  useEffect(() => {
    const onLoadHandler = async () => {
     const productData = await performAPICall();
     const cartsData = await fetchCart(token);
     const cartDetails = generateCartItemsFrom(cartsData, productData);
     setItems(cartDetails);
    //  console.log(cartDetails);
     
    }
    onLoadHandler();
   }, []);






   // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
   function isItemInCart(items, productId) {
    return items.find((item) => item.productId===productId)?true:false;
  };
  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } productData
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
   const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (!token){
      enqueueSnackbar("Login to add an item to the Cart", { variant: "warning" });
      return;
    };
    if (isItemInCart(items, productId) && options.preventDuplicate){
      enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item", { variant: "warning" });
      return;
    };
    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      
      const response = await axios.post(`${config.endpoint}/cart`, 
      {
        "productId":productId,
        "qty": qty
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type':'application/json'
        },
      });
      const cartDetails = generateCartItemsFrom(response.data, products);
      setItems(cartDetails);
       return response.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not add product to the cart. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
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
      {/* <Grid container spacing={2} marginY={1} paddingX={1}>
          <Grid item xs={12} md={token && productData.length >0  ? 9:12}>
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
              // productData.length ? (
                <Grid container spacing={2} marginY={1} paddingX={1}>
                  {productData.length ? (
                  productData.map((product) => (
                    
                    <Grid item xs={6} md={3} key={product._id}>
                      <ProductCard productData={product} handleAddToCart={ async() =>{
                       await addToCart(token, items, productData, product._id, 1, {preventDuplicate: true})
                      }}/>
                    </Grid>
                  )))
               : (
                <Box className="loading">
                  <SentimentDissatisfied />
                  <Typography variant="body1">no products found</Typography>
                </Box>
              
            )}
          </Grid>
            )}
            </Grid>
          {token ?(
          <Grid item xs={12} md={3} bgcolor="#E9F5E1">
              <Cart products={productData} items={items} handleQuantity={addToCart} />
          </Grid>):null
          }
        </Grid> */}
        <Grid container>
       <Grid item xs={12} md={token ? 9 : 12} className="product-grid">
         <Box className="hero">
           <p className="hero-heading">
             India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
             to your door step
           </p>
         </Box>
         {isLoading?(
            <Box className="loading">
            <CircularProgress />
            <Typography variant='body1'>Loading Products...</Typography>
            </Box>)

          :
          (<Grid container spacing={2} marginY={1} paddingX={1}>
            {productData.length?
              (productData.map((product) =>(
              <Grid key={product._id} item xs={6} md={3}>
                <ProductCard 
                  productData={product}
                  handleAddToCart={async () => {await addToCart(token,items,productData,product._id,1,{preventDuplicate:true});}} 
                />
              </Grid>)))
              :(
              <Box className="loading">
                <SentimentDissatisfied color="action"/>
                <Typography variant='body1'>No products found</Typography>
              </Box>
            )}
          </Grid>)}
       </Grid>
       {token?(
        <Grid item xs={12} md={3} bgcolor="#E9F5E1">
          <Cart products={productData} items={items} handleQuantity={addToCart}/>
        </Grid> 
       ):null}
      </Grid>

        <Footer />
</div>
  );
};

export default Products;
