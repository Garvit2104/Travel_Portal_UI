import React from "react";
import { Box, Button, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Dashboard from '../Assests/Dashboard/Dashboard.png';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)", // remove header height
        backgroundImage: `url(${Dashboard})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
     
      }}
    >
      

    </Box>
  );
};

export default HomePage;
