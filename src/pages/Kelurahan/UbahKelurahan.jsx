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
  Paper
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const UbahKelurahan = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [caleg, setCaleg] = useState("");
  // const [kecamatan, setKecamatan] = useState("");
  const [kodeKelurahan, setKodeKelurahan] = useState("");
  const [namaKelurahan, setNamaKelurahan] = useState("");
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
    getKelurahanById();
  }, []);

  const getKelurahanById = async () => {
    setLoading(true);
    const pickedKelurahan = await axios.post(`${tempUrl}/kelurahan/${id}`, {
      id: user._id,
      token: user.token
    });
    setKodeKelurahan(pickedKelurahan.data.kodeKelurahan);
    setNamaKelurahan(pickedKelurahan.data.namaKelurahan);
    setCaleg(pickedKelurahan.data.idCaleg.nama);
    setLoading(false);
  };

  const updateKelurahan = async (e) => {
    e.preventDefault();
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    let isFailedValidation = namaKelurahan.length === 0;
    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/updateKelurahan/${id}`, {
          namaKelurahan,
          tglUpdate: current_date,
          jamUpdate: current_time,
          userUpdate: user.nama,
          id: user._id,
          token: user.token
        });
        setLoading(false);
        navigate("/daftarKelurahan");
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Daftar Kelurahan</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Tambah Kelurahan
      </Typography>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
        <Box sx={showDataContainer}>
          <Box sx={showDataWrapper}>
            <Typography sx={labelInput}>Caleg</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={caleg}
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
            />
            <Typography sx={[labelInput, spacingTop]}>
              Kode Kelurahan
            </Typography>
            <TextField
              size="small"
              error={error && kodeKelurahan.length === 0 && true}
              helperText={
                error &&
                kodeKelurahan.length === 0 &&
                "Kode Kelurahan harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={kodeKelurahan}
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
            />
            <Typography sx={[labelInput, spacingTop]}>
              Nama Kelurahan
            </Typography>
            <TextField
              size="small"
              error={error && namaKelurahan.length === 0 && true}
              helperText={
                error &&
                namaKelurahan.length === 0 &&
                "Nama Kelurahan harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={namaKelurahan}
              onChange={(e) => setNamaKelurahan(e.target.value.toUpperCase())}
            />
          </Box>
        </Box>
        <Box sx={spacingTop}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/daftarKelurahan")}
            sx={{ marginRight: 2 }}
          >
            {"< Kembali"}
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={updateKelurahan}
          >
            Ubah
          </Button>
        </Box>
      </Paper>
      <Divider sx={spacingTop} />
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

export default UbahKelurahan;

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
