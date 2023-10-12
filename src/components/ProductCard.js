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
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
      <CardMedia
        component="img"
        src={product.image}
        alt={product.name}
      ></CardMedia>
      <CardContent>
        {product.name}
        <Typography fontStyle={700}>${product.cost}</Typography>
        <Rating value={product.rating} readOnly />
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          startIcon={<AddShoppingCartOutlined />}
          fullWidth
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
