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
  Paper,
  Autocomplete
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const UbahTps = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [calegAwal, setCalegAwal] = useState("");
  const [caleg, setCaleg] = useState("");
  const [noTps, setNoTps] = useState("");
  const [namaTps, setNamaTps] = useState("");
  const [noHpSaksi, setNoHpSaksi] = useState("");
  const [namaSaksi, setNamaSaksi] = useState("");
  const [jumlahPemilih, setJumlahPemilih] = useState("");
  const [passwordSaksi, setPasswordSaksi] = useState("");
  const [passwordSaksiAwal, setPasswordSaksiAwal] = useState("");
  const [error, setError] = useState(false);
  const [calegs, setCalegs] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const calegOptions = calegs.map((caleg) => ({
    label: `${caleg.nama}`
  }));

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getCalegsData();
    getCalegById();
  }, []);

  const getCalegById = async () => {
    setLoading(true);
    const pickedTps = await axios.post(`${tempUrl}/tps/${id}`, {
      id: user._id,
      token: user.token
    });
    setNoTps(pickedTps.data.noTps);
    setNamaTps(pickedTps.data.namaTps);
    setNoHpSaksi(pickedTps.data.noHpSaksi);
    setNamaSaksi(pickedTps.data.namaSaksi);
    setJumlahPemilih(pickedTps.data.jumlahPemilih);
    setPasswordSaksiAwal(pickedTps.data.passwordSaksi);
    setCalegAwal(pickedTps.data.idCaleg.nama);
    setCaleg(pickedTps.data.idCaleg.nama);
    setLoading(false);
  };

  const getCalegsData = async () => {
    setLoading(true);
    const allCalegs = await axios.post(`${tempUrl}/usersCaleg`, {
      id: user._id,
      token: user.token
    });
    setCalegs(allCalegs.data);
    setLoading(false);
  };

  const getNextKodeTps = async (value) => {
    if (user.tipeUser === "ADMIN") {
      const findCaleg = await axios.post(`${tempUrl}/findUserNama`, {
        nama: value,
        id: user._id,
        token: user.token
      });
      const nextKodeTps = await axios.post(`${tempUrl}/tpsNextKode`, {
        idCaleg: findCaleg.data._id,
        id: user._id,
        token: user.token
      });
      if (calegAwal === value) {
        let decNextKodeTps = nextKodeTps.data - 1;
        let tempNextKodeTps = decNextKodeTps.toLocaleString("en-US", {
          minimumIntegerDigits: 3,
          useGrouping: false
        });
        setNoTps(tempNextKodeTps);
      } else {
        setNoTps(nextKodeTps.data);
      }
    } else {
      const nextKodeTps = await axios.post(`${tempUrl}/tpsNextKode`, {
        idCaleg: user._id,
        id: user._id,
        token: user.token
      });
      setNoTps(nextKodeTps.data);
    }
  };

  const updateTps = async (e) => {
    e.preventDefault();
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    let isFailedValidation =
      namaTps.length === 0 ||
      noHpSaksi.length === 0 ||
      namaSaksi.length === 0 ||
      jumlahPemilih.length === 0;
    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      try {
        setLoading(true);
        const findCaleg = await axios.post(`${tempUrl}/findUserNama`, {
          nama: caleg,
          id: user._id,
          token: user.token
        });
        await axios.post(`${tempUrl}/updateTps/${id}`, {
          idCaleg: findCaleg.data._id,
          namaTps,
          noHpSaksi,
          namaSaksi,
          jumlahPemilih,
          passwordSaksi: !passwordSaksi ? passwordSaksiAwal : passwordSaksi,
          tglUpdate: current_date,
          jamUpdate: current_time,
          userUpdate: user.nama,
          id: user._id,
          token: user.token
        });
        setLoading(false);
        navigate("/daftarTps");
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
      <Typography color="#757575">Daftar TPS</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Tambah TPS
      </Typography>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
        <Box sx={showDataContainer}>
          <Box sx={showDataWrapper}>
            <Typography sx={labelInput}>Kode Caleg</Typography>
            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              options={calegOptions}
              renderInput={(params) => (
                <TextField
                  size="small"
                  error={error && caleg.length === 0 && true}
                  helperText={
                    error && caleg.length === 0 && "Caleg harus diisi!"
                  }
                  {...params}
                />
              )}
              onInputChange={(e, value) => {
                setCaleg(value);
                getNextKodeTps(value);
              }}
              value={{ label: caleg }}
            />
            <Typography sx={[labelInput, spacingTop]}>No. TPS</Typography>
            <TextField
              size="small"
              error={error && noTps.length === 0 && true}
              helperText={error && noTps.length === 0 && "No. TPS harus diisi!"}
              id="outlined-basic"
              variant="outlined"
              value={noTps}
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
            />
            <Typography sx={[labelInput, spacingTop]}>Nama TPS</Typography>
            <TextField
              size="small"
              error={error && namaTps.length === 0 && true}
              helperText={
                error && namaTps.length === 0 && "Nama TPS harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={namaTps}
              onChange={(e) => setNamaTps(e.target.value.toUpperCase())}
            />
            <Typography sx={[labelInput, spacingTop]}>No. HP Saksi</Typography>
            <TextField
              type="number"
              error={error && noHpSaksi.length === 0 && true}
              helperText={
                error && noHpSaksi.length === 0 && "No. HP Saksi harus diisi!"
              }
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={noHpSaksi}
              onChange={(e) => setNoHpSaksi(e.target.value.toUpperCase())}
            />
          </Box>
          <Box sx={[showDataWrapper, secondWrapper]}>
            <Typography sx={labelInput}>Nama Saksi</Typography>
            <TextField
              size="small"
              error={error && namaSaksi.length === 0 && true}
              helperText={
                error && namaSaksi.length === 0 && "Nama Saksi harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={namaSaksi}
              onChange={(e) => setNamaSaksi(e.target.value.toUpperCase())}
            />
            <Typography sx={[labelInput, spacingTop]}>
              Jumlah Pemilih
            </Typography>
            <TextField
              tpye="number"
              error={error && jumlahPemilih.length === 0 && true}
              helperText={
                error &&
                jumlahPemilih.length === 0 &&
                "Jumlah Pemilih harus diisi!"
              }
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={jumlahPemilih}
              onChange={(e) => setJumlahPemilih(e.target.value.toUpperCase())}
            />
            <Typography sx={[labelInput, spacingTop]}>
              Password Saksi
            </Typography>
            <TextField
              type="password"
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={passwordSaksi}
              onChange={(e) => setPasswordSaksi(e.target.value.toUpperCase())}
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
            onClick={() => navigate("/daftarTps")}
            sx={{ marginRight: 2 }}
          >
            {"< Kembali"}
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={updateTps}
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

export default UbahTps;

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
