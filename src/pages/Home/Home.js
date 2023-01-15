import React from "react";
import { useNavigate } from "react-router-dom";
import {
  logoLoginCaleg,
  logoLoginSaksiTPS
} from "../../constants/GeneralSetting";
import {
  Box,
  Typography,
  Divider,
  Card,
  CardActionArea,
  CardMedia,
  CardContent
} from "@mui/material";

const Home = () => {
  const navigate = useNavigate();

  const loginCaleg = () => {
    navigate("/loginCaleg");
  };

  const loginSaksiTPS = () => {
    navigate("/loginSaksiTps");
  };

  return (
    <Box sx={container}>
      <Card sx={{ maxWidth: 345 }} onClick={loginCaleg}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image={logoLoginCaleg}
            alt="login caleg"
          />
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{ textAlign: "center" }}
            >
              Login Caleg
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      <Divider sx={dividerStyle} />
      <Card sx={{ maxWidth: 345 }} onClick={loginSaksiTPS}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image={logoLoginSaksiTPS}
            alt="login saksi tps"
          />
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{ textAlign: "center" }}
            >
              Login Saksi TPS
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
};

export default Home;

const container = {
  p: 4,
  display: "flex",
  flexDirection: "column"
};

const subTitleText = {
  fontWeight: "900"
};

const dividerStyle = {
  mt: 2,
  mb: 2
};

const showDataContainer = {
  mt: 4,
  display: "flex",
  flexDirection: {
    xs: "column",
    sm: "row"
  }
};

const showDataWrapper = {
  display: "flex",
  flex: 1,
  flexDirection: "column",
  maxWidth: {
    md: "40vw"
  }
};

const spacingTop = {
  mt: 4
};

const alertBox = {
  width: "100%"
};
