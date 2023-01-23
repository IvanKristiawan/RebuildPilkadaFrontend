import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { tempUrl } from "../../contexts/ContextProvider";
import { Loader } from "../../components";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Paper,
  Snackbar,
  Alert
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Colors } from "../../constants/styles";

const UbahProfilCaleg = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [nama, setNama] = useState("");
  const [tipeUser, setTipeUser] = useState("");
  const [targetSuaraCaleg, setTargetSuaraCaleg] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
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
    const response = await axios.post(`${tempUrl}/findUser/${id}`, {
      id: user._id,
      token: user.token
    });
    setNama(response.data.nama);
    setTipeUser(response.data.tipeUser);
    setTargetSuaraCaleg(response.data.targetSuaraCaleg);
    setLoading(false);
  };

  const updateUser = async (e) => {
    e.preventDefault();
    let isFailedValidation = nama.length === 0 || targetSuaraCaleg.length === 0;

    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      if (!password) {
        setPassword(user.password);
      }
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/updateUser/${id}`, {
          nama,
          targetSuaraCaleg,
          password,
          id: user._id,
          token: user.token
        });
        setLoading(false);
        if (password) {
          logoutButtonHandler();
          navigate("/");
        } else {
          navigate("/profilCaleg");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const logoutButtonHandler = async (e) => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">User</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Ubah Password User
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
            <Typography sx={[labelInput, spacingTop]}>Tipe User</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={tipeUser}
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
            />
            <Typography sx={[labelInput, spacingTop]}>
              Target Suara Caleg
              {targetSuaraCaleg !== 0 &&
                !isNaN(parseInt(targetSuaraCaleg)) &&
                ` : ${parseInt(targetSuaraCaleg).toLocaleString()}`}
            </Typography>
            <TextField
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
            <Typography sx={[labelInput, spacingTop]}>
              Password (baru)
            </Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value.toUpperCase())}
            />
            <Typography>
              *Kosongkan jika tidak ingin mengganti password
            </Typography>
          </Box>
        </Box>
        <Box sx={spacingTop}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/profilCaleg")}
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

export default UbahProfilCaleg;

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

const alertBox = {
  width: "100%"
};
