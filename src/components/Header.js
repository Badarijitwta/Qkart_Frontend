import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useState, useEffect } from "react";
import "./Header.css";
import { Link } from "react-router-dom";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const [data, setdata] = useState(null);
  useEffect(() => {
    // Retrieve data from localStorage when the component mounts
    const storedData = localStorage.getItem("token");

    if (storedData) {
      // If data exists in localStorage, update the component's state
      setdata(storedData);
    }
  }, []);
  if (hasHiddenAuthButtons) {
    return (
      <Box className="header">
        <Box className="header-title">
          <Link to="/">
            <img src="logo_light.svg" alt="QKart-icon"></img>
          </Link>
        </Box>
        {children}
        <Link to="/">
          <Button
            className="explore-button"
            startIcon={<ArrowBackIcon />}
            variant="text"
          >
            Back to explore
          </Button>
        </Link>
      </Box>
    );
  }

  return (
    <Box className="header">
      <Box className="header-title">
        <Link to="/">
          <img src="logo_light.svg" alt="QKart-icon"></img>
        </Link>
      </Box>
      {children}
      <Stack direction={"row"} spacing={1} alignItems="center">
        {data ? (
          <>
            <Avatar src="avatar.png" alt={localStorage.getItem("username")} />
            <p>{localStorage.getItem("username")}</p>

            <Button
              className="explore-button"
              variant="text"
              onClick={() => {
                localStorage.clear();
                setdata(null);
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button className="explore-button" variant="text">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="contained">Register</Button>
            </Link>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default Header;
