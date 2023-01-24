import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
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
  Paper,
  Autocomplete
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const TambahKecamatan = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [caleg, setCaleg] = useState("");
  const [kodeKecamatan, setKodeKecamatan] = useState("");
  const [namaKecamatan, setNamaKecamatan] = useState("");
  const [error, setError] = useState(false);
  const [calegs, setCalegs] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const calegOptions = calegs.map((caleg) => ({
    label: `${caleg._id} - ${caleg.nama}`
  }));

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getCalegsData();
    getNextKodeKecamatan();
  }, []);

  const getCalegsData = async () => {
    setLoading(true);
    const allCalegs = await axios.post(`${tempUrl}/usersCaleg`, {
      id: user._id,
      token: user.token
    });
    setCalegs(allCalegs.data);
    setLoading(false);
  };

  const getNextKodeKecamatan = async (value) => {
    const nextKodeKecamatan = await axios.post(`${tempUrl}/kecamatanNextKode`, {
      idCaleg: user._id,
      id: user._id,
      token: user.token
    });
    setKodeKecamatan(nextKodeKecamatan.data);
    setCaleg(value);
  };

  const saveKecamatan = async (e) => {
    e.preventDefault();
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    let isFailedValidation =
      kodeKecamatan.length === 0 || namaKecamatan.length === 0;
    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/saveKecamatan`, {
          idCaleg: user._id,
          kodeKecamatan,
          namaKecamatan,
          tglInput: current_date,
          jamInput: current_time,
          userInput: user.nama,
          id: user._id,
          token: user.token
        });
        setLoading(false);
        navigate("/daftarKecamatan");
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
      <Typography color="#757575">Daftar Kecamatan</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Tambah Kecamatan
      </Typography>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
        <Box sx={showDataContainer}>
          <Box sx={showDataWrapper}>
            <Typography sx={labelInput}>No. Kecamatan</Typography>
            <TextField
              size="small"
              error={error && kodeKecamatan.length === 0 && true}
              helperText={
                error &&
                kodeKecamatan.length === 0 &&
                "No. Kecamatan harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={kodeKecamatan}
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
            />
            <Typography sx={[labelInput, spacingTop]}>
              Nama Kecamatan
            </Typography>
            <TextField
              size="small"
              error={error && namaKecamatan.length === 0 && true}
              helperText={
                error &&
                namaKecamatan.length === 0 &&
                "Nama Kecamatan harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={namaKecamatan}
              onChange={(e) => setNamaKecamatan(e.target.value.toUpperCase())}
            />
          </Box>
        </Box>
        <Box sx={spacingTop}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/daftarKecamatan")}
            sx={{ marginRight: 2 }}
          >
            {"< Kembali"}
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={saveKecamatan}
          >
            Simpan
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

export default TambahKecamatan;

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
