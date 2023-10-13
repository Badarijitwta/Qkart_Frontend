import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart, { generateCartItemsFrom } from "./Cart";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const [loading, setloading] = useState(true);
  const [products, setproducts] = useState([]);
  const [debouncetime, setdebouncetime] = useState(null);
  const [items, setItems] = useState([]);
  const token = localStorage.getItem("token");
  const { enqueueSnackbar } = useSnackbar();

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    try {
      let res = await axios.get(`${config.endpoint}/products`);
      return res.data;
    } catch (e) {}
  };

  const fetchCart = async (token) => {
    if (!token) return;
    try {
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response)
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, {
          variant: "error",
        });
      } else {
        enqueueSnackbar(
          "Something went Wrong. Please check the backend is running",
          {
            variant: "error",
          }
        );
      }
    }
  };

  useEffect(() => {
    const onLoader = async () => {
      let products = await performAPICall();
      setproducts(products);
      setloading(false);
      const cartData = await fetchCart(token);
      const CartItems = generateCartItemsFrom(cartData, products);
      setItems(CartItems);
      // console.log(CartItems)
    };
    onLoader();
  }, []);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    try {
      let search = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      setproducts(search.data);
    } catch (e) {
      setproducts([]);
    }
  };

  const isItemInCart = (items, productId) => {
    return items.find((item) => item.productId === productId) ? true : false;
  };

  const addtocart = async (
    products,
    items,
    token,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (!token) {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
      return;
    }
    if (isItemInCart(items, productId) && options.preventDuplicate) {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item",
        {
          variant: "warning",
        }
      );
      return;
    }

    try {
      const response = await axios.post(
        `${config.endpoint}/cart`,
        {
          productId: productId,
          qty: qty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
        }
      );
      // console.log(response)
      const CartItems = generateCartItemsFrom(response.data, products);
      setItems(CartItems);
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, {
          variant: "error",
        });
      } else {
        enqueueSnackbar(
          "Could not able to add product to Cart. Something went Wrong. Please check the backend is running",
          {
            variant: "error",
          }
        );
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    let timerId = setTimeout(() => {
      performSearch(event.target.value);
    }, 800);

    setdebouncetime(timerId);
  };

  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          className="search-desktop"
          size=""
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(e) => {
            debounceSearch(e, debouncetime);
          }}
        />
      </Header>

      {/* Search view for mobiles */}
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
        onChange={(e) => {
          debounceSearch(e, debouncetime);
        }}
      />
      <Grid container>
        <Grid
          item
          md={token && products.length ? 9 : 12}
          className="product-grid"
        >
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
          {loading ? (
            <Box className="loading">
              <CircularProgress />
              <Typography>Loading the products....</Typography>
            </Box>
          ) : products.length === 0 ? (
            <Box className="loading">
              <SentimentDissatisfied />
              <Typography>No Products found</Typography>
            </Box>
          ) : (
            <Grid container spacing={2} marginY="1rem" paddingX="1.3rem">
              {products.map((product) => (
                <Grid item key={product._id} xs={6} md={3}>
                  <ProductCard
                    product={product}
                    handleAddToCart={async () => {
                      await addtocart(products, items, token, product._id, 1, {
                        preventDuplicate: true,
                      });
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
        {token ? (
          <Grid item md={3} xs={12} bgcolor="#E9F5E1">
            <Cart
              token={token}
              products={products}
              items={items}
              handleQuantity={addtocart}
              hasCheckOutButton
            />
          </Grid>
        ) : null}
      </Grid>

      <Footer />
    </div>
  );
};

export default Products;
