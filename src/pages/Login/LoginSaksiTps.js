import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { tempUrl } from "../../contexts/ContextProvider";
import { AuthContext } from "../../contexts/AuthContext";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Snackbar,
  Alert
} from "@mui/material";
import { useForm } from "react-hook-form";

const LoginSaksiTps = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const [open, setOpen] = useState(false);
  const [namaSaksi, setNamaSaksi] = useState("");
  const [passwordSaksi, setPasswordSaksi] = useState("");
  const navigate = useNavigate();

  const { loading, error, dispatch } = useContext(AuthContext);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleClick = async (e) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post(`${tempUrl}/loginTps`, {
        namaSaksi,
        passwordSaksi
      });
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      navigate(`/tps/${res.data.details._id}`);
    } catch (err) {
      setOpen(true);
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
  };

  return (
    <Box sx={container}>
      <form onSubmit={handleSubmit(handleClick)}>
        <Typography color="#757575">User</Typography>
        <Typography variant="h4" sx={subTitleText}>
          Login Saksi TPS
        </Typography>
        <Divider sx={dividerStyle} />
        <Box sx={showDataContainer}>
          <Box sx={showDataWrapper}>
            <TextField
              id="outlined-basic"
              label="Nama Saksi"
              variant="outlined"
              value={namaSaksi}
              {...register("namaSaksi", {
                required: "NamaS aksi harus diisi!"
              })}
              error={!!errors?.namaSaksi}
              helperText={errors?.namaSaksi ? errors.namaSaksi.message : null}
              onChange={(e) => setNamaSaksi(e.target.value.toUpperCase())}
            />
            <TextField
              type="password"
              id="outlined-basic"
              label="Password Saksi"
              variant="outlined"
              autoComplete="current-passwordSaksi"
              sx={spacingTop}
              value={passwordSaksi}
              {...register("passwordSaksi", {
                required: "Password Saksi harus diisi!"
              })}
              error={!!errors?.passwordSaksi}
              helperText={
                errors?.passwordSaksi ? errors.passwordSaksi.message : null
              }
              onChange={(e) => setPasswordSaksi(e.target.value.toUpperCase())}
            />
          </Box>
        </Box>
        <Box sx={spacingTop}>
          <Button type="submit" variant="contained">
            Login
          </Button>
        </Box>
        {error && (
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={alertBox}>
              Nama atau Password salah!
            </Alert>
          </Snackbar>
        )}
        <Divider sx={spacingTop} />
      </form>
    </Box>
  );
};

export default LoginSaksiTps;

const container = {
  p: 4
};

const subTitleText = {
  fontWeight: "900"
};

const dividerStyle = {
  mt: 2
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
