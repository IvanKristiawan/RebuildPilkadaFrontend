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

const TambahKelurahan = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [caleg, setCaleg] = useState("");
  const [kecamatan, setKecamatan] = useState("");
  const [kodeKelurahan, setKodeKelurahan] = useState("");
  const [namaKelurahan, setNamaKelurahan] = useState("");
  const [error, setError] = useState(false);
  const [calegs, setCalegs] = useState([]);
  const [kecamatans, setKecamatans] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const calegOptions = calegs.map((caleg) => ({
    label: `${caleg._id} - ${caleg.nama}`
  }));

  const kecamatanOptions = kecamatans.map((kecamatan) => ({
    label: `${kecamatan.kodeKecamatan} - ${kecamatan.namaKecamatan}`
  }));

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getCalegsData();
    getKecamatansCalegData();
    // getNextKodeKelurahan();
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

  const getKecamatansCalegData = async () => {
    setLoading(true);
    const kecamatans = await axios.post(`${tempUrl}/kecamatansCaleg`, {
      id: user._id,
      token: user.token
    });
    setKecamatans(kecamatans.data);
    setLoading(false);
  };

  const getNextKodeKelurahan = async (value) => {
    let tempKecamatan = await axios.post(
      `${tempUrl}/kecamatanCalegByKodeKecamatan`,
      {
        kodeKecamatan: value,
        id: user._id,
        token: user.token
      }
    );
    const nextKodeKelurahan = await axios.post(`${tempUrl}/kelurahanNextKode`, {
      idCaleg: user._id,
      idKecamatan: tempKecamatan.data._id,
      id: user._id,
      token: user.token
    });
    setKecamatan(value);
    setKodeKelurahan(`${value}${nextKodeKelurahan.data}`);
  };

  const saveKelurahan = async (e) => {
    e.preventDefault();
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    let isFailedValidation =
      kodeKelurahan.length === 0 || namaKelurahan.length === 0;
    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      try {
        setLoading(true);
        let tempKecamatan = await axios.post(
          `${tempUrl}/kecamatanCalegByKodeKecamatan`,
          {
            kodeKecamatan: kecamatan,
            id: user._id,
            token: user.token
          }
        );
        await axios.post(`${tempUrl}/saveKelurahan`, {
          idCaleg: user._id,
          idKecamatan: tempKecamatan.data._id,
          kodeKelurahan,
          namaKelurahan,
          tglInput: current_date,
          jamInput: current_time,
          userInput: user.nama,
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
            <Typography sx={labelInput}>Kode Kelurahan</Typography>
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
              Kode Kecamatan
            </Typography>
            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              options={kecamatanOptions}
              renderInput={(params) => (
                <TextField
                  size="small"
                  error={error && kecamatan.length === 0 && true}
                  helperText={
                    error &&
                    kecamatan.length === 0 &&
                    "Kode Kecamatan harus diisi!"
                  }
                  {...params}
                />
              )}
              onInputChange={(e, value) => {
                if (value) {
                  getNextKodeKelurahan(value.split(" ", 1)[0]);
                } else {
                  setKodeKelurahan("");
                }
              }}
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
            onClick={saveKelurahan}
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

export default TambahKelurahan;

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
