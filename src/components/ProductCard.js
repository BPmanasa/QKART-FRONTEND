import { AddShoppingCartOutlined } from "@mui/icons-material";
import { Box } from "@mui/system";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
// import React from "react";

import "./ProductCard.css";
const ProductCard = ({ productData }) => {
  return (
    <Card className="card">
      <CardMedia image={productData.image} alt={productData.name} component="img" />
      <CardContent>
        <Typography>{productData.name}</Typography>
        <Typography fontWeight={700}>$ {productData.cost}</Typography>
        <Rating readOnly precesion={0.5} defaultValue={productData.rating} name="half-rating" />
      </CardContent>
      <CardActions className="card-actions">
        <Button
          className="card-button"
          variant="contained"
          fullWidth={true}
          startIcon={<AddShoppingCartOutlined />}
          type="submit"
        >
          Add to cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;

