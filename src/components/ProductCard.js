import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";

import React, { useState } from "react";
// import React from "react";

import "./ProductCard.css";
const ProductCard = ({ productData, handleAddToCart }) => {
  return (
    <Card className="card">
      <CardMedia
        image={productData.image}
        alt={productData.name}
        component="img"
      />
      <CardContent>
        <Typography>{productData.name}</Typography>
        <Typography fontWeight={700}>${productData.cost}</Typography>
        <Rating
          readOnly
          precesion={0.5}
          defaultValue={productData.rating}
          name="half-rating"
        />
      </CardContent>
      <CardActions className="card-actions">
        <Button
          className="card-button"
          variant="contained"
          fullWidth={true}
          startIcon={<AddShoppingCartOutlined />}
          type="submit"
          onClick={handleAddToCart}
        >
          Add to cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
