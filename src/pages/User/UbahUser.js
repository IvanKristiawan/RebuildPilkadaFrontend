import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { tempUrl } from "../../contexts/ContextProvider";
import { Colors } from "../../constants/styles";
import { Loader } from "../../components";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Snackbar,
  Alert,
  Autocomplete,
  Paper
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const UbahUser = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [nama, setNama] = useState("");
  const [password, setPassword] = useState("");
  const [tipeUser, setTipeUser] = useState("");
  const [targetSuaraCaleg, setTargetSuaraCaleg] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getUserById();
  }, []);

  const getUserById = async () => {
    setLoading(true);
    const pickedUser = await axios.post(`${tempUrl}/findUser/${id}`, {
      id: user._id,
      token: user.token
    });
    setNama(pickedUser.data.nama);
    setPassword(pickedUser.data.password);
    setTipeUser(pickedUser.data.tipeUser);
    setTargetSuaraCaleg(pickedUser.data.targetSuaraCaleg);
    setLoading(false);
  };

  const updateUser = async (e) => {
    e.preventDefault();

    let isFailedValidation =
      nama.length === 0 ||
      password.length === 0 ||
      tipeUser.length === 0 ||
      targetSuaraCaleg.length === 0;
    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/updateUser/${id}`, {
          nama,
          password,
          tipeUser,
          targetSuaraCaleg,
          id: user._id,
          token: user.token
        });
        setLoading(false);

        if (user._id === id) {
          dispatch({ type: "LOGOUT" });
          navigate("/");
        } else {
          navigate(`/daftarUser/${id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const tipeUserOption = [{ label: "ADMIN" }, { label: "CALEG" }];

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">User</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Ubah User
      </Typography>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
        <Box sx={showDataContainer}>
          <Box sx={showDataWrapper}>
            <Typography sx={labelInput}>Nama</Typography>
            <TextField
              size="small"
              error={error && nama.length === 0 && true}
              helperText={error && nama.length === 0 && "Nama harus diisi!"}
              id="outlined-basic"
              variant="outlined"
              value={nama}
              onChange={(e) => setNama(e.target.value.toUpperCase())}
            />
            <Typography sx={[labelInput, spacingTop]}>Password</Typography>
            <TextField
              type="password"
              size="small"
              error={error && password.length === 0 && true}
              helperText={
                error && password.length === 0 && "Password harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value.toUpperCase())}
            />
            <Typography sx={[labelInput, spacingTop]}>Jenis User</Typography>
            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              options={tipeUserOption}
              renderInput={(params) => (
                <TextField
                  size="small"
                  error={error && tipeUser.length === 0 && true}
                  helperText={
                    error && tipeUser.length === 0 && "Jenis User harus diisi!"
                  }
                  {...params}
                />
              )}
              onInputChange={(e, value) => setTipeUser(value)}
              value={{ label: tipeUser }}
            />
            <Typography sx={[labelInput, spacingTop]}>
              Target Suara Caleg
            </Typography>
            <TextField
              type="number"
              size="small"
              error={error && targetSuaraCaleg.length === 0 && true}
              helperText={
                error &&
                targetSuaraCaleg.length === 0 &&
                "Target Suara Caleg harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={targetSuaraCaleg}
              onChange={(e) =>
                setTargetSuaraCaleg(e.target.value.toUpperCase())
              }
            />
          </Box>
        </Box>
        <Box sx={spacingTop}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/daftarUser")}
            sx={{ marginRight: 2 }}
          >
            {"< Kembali"}
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={updateUser}
          >
            Ubah
          </Button>
        </Box>
      </Paper>
      <Divider sx={dividerStyle} />
      {error && (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={alertBox}>
            Data belum terisi semua!
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default UbahUser;

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

const labelInput = {
  fontWeight: "600",
  marginLeft: 1
};

const contentContainer = {
  p: 3,
  pt: 1,
  mt: 2,
  backgroundColor: Colors.grey100
};

const secondWrapper = {
  marginLeft: {
    sm: 4
  },
  marginTop: {
    sm: 0,
    xs: 4
  }
};
