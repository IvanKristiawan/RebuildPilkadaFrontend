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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Autocomplete
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const TambahTps = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [kelurahan, setKelurahan] = useState("");
  const [noTps, setNoTps] = useState("");
  const [namaTps, setNamaTps] = useState("");
  const [noHpSaksi, setNoHpSaksi] = useState("");
  const [namaSaksi, setNamaSaksi] = useState("");
  const [targetSuara, setTargetSuara] = useState("");
  const [totalPemilih, setTotalPemilih] = useState("");
  const [passwordSaksi, setPasswordSaksi] = useState("");
  const [error, setError] = useState(false);
  const [kelurahans, setKelurahans] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const handleClickOpenAlert = () => {
    setOpenAlert(true);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const kelurahanOptions = kelurahans.map((kelurahan) => ({
    label: `${kelurahan.kodeKelurahan} - ${kelurahan.namaKelurahan}`
  }));

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getKelurahansCalegData();
  }, []);

  const getKelurahansCalegData = async () => {
    setLoading(true);
    const kelurahans = await axios.post(`${tempUrl}/kelurahansCaleg`, {
      id: user._id,
      token: user.token
    });
    setKelurahans(kelurahans.data);
    setLoading(false);
  };

  const getNextKodeTpsCaleg = async (value) => {
    let tempKelurahan = await axios.post(
      `${tempUrl}/kelurahanCalegByKodeKelurahan`,
      {
        kodeKelurahan: value,
        id: user._id,
        token: user.token
      }
    );
    const nextKodeTps = await axios.post(`${tempUrl}/tpsNextKode`, {
      idKelurahan: tempKelurahan.data._id,
      idCaleg: user._id,
      id: user._id,
      token: user.token
    });
    setKelurahan(value);
    setNoTps(`${value}${nextKodeTps.data}`);
  };

  const saveTps = async (e) => {
    e.preventDefault();
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    let isFailedValidation =
      noTps.length === 0 ||
      kelurahan.length === 0 ||
      namaTps.length === 0 ||
      noHpSaksi.length === 0 ||
      namaSaksi.length === 0 ||
      totalPemilih.length === 0 ||
      targetSuara.length === 0 ||
      passwordSaksi.length === 0;
    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      try {
        let tempKelurahan = await axios.post(
          `${tempUrl}/kelurahanCalegByKodeKelurahan`,
          {
            kodeKelurahan: kelurahan,
            id: user._id,
            token: user.token
          }
        );
        let tempNamaSaksi = await axios.post(`${tempUrl}/findTpsNamaSaksi`, {
          namaSaksi,
          id: user._id,
          token: user.token
        });
        if (tempNamaSaksi.data.length > 0) {
          handleClickOpenAlert();
        } else {
          setLoading(true);
          await axios.post(`${tempUrl}/saveTps`, {
            idCaleg: user._id,
            idKecamatan: tempKelurahan.data.idKecamatan,
            idKelurahan: tempKelurahan.data._id,
            noTps,
            namaTps,
            noHpSaksi,
            namaSaksi,
            totalPemilih,
            targetSuara,
            passwordSaksi,
            tglInput: current_date,
            jamInput: current_time,
            userInput: user.nama,
            id: user._id,
            token: user.token
          });
          setLoading(false);
          navigate("/daftarTps");
        }
      } catch (error) {
        alert(error);
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
      <Dialog
        open={openAlert}
        onClose={handleCloseAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Data Nama Saksi Sama`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {`Nama Saksi ${namaSaksi} sudah ada, ganti Nama Saksi!`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert}>Ok</Button>
        </DialogActions>
      </Dialog>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
        <Box sx={showDataContainer}>
          <Box sx={showDataWrapper}>
            <Typography sx={labelInput}>No. TPS</Typography>
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
            <Typography sx={[labelInput, spacingTop]}>
              Kode Kelurahan
            </Typography>
            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              options={kelurahanOptions}
              renderInput={(params) => (
                <TextField
                  size="small"
                  error={error && kelurahan.length === 0 && true}
                  helperText={
                    error &&
                    kelurahan.length === 0 &&
                    "Kode Kelurahan harus diisi!"
                  }
                  {...params}
                />
              )}
              onInputChange={(e, value) => {
                if (value) {
                  getNextKodeTpsCaleg(value.split(" ", 1)[0]);
                } else {
                  setNoTps("");
                }
              }}
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
            <Typography sx={[labelInput, spacingTop]}>Nama Saksi</Typography>
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
            <Typography sx={labelInput}>
              Total Pemilih
              {totalPemilih !== 0 &&
                !isNaN(parseInt(totalPemilih)) &&
                ` : ${parseInt(totalPemilih).toLocaleString()}`}
            </Typography>
            <TextField
              type="number"
              error={error && totalPemilih.length === 0 && true}
              helperText={
                error &&
                totalPemilih.length === 0 &&
                "Total Pemilih Suara harus diisi!"
              }
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={totalPemilih}
              onChange={(e) => setTotalPemilih(e.target.value.toUpperCase())}
            />
            <Typography sx={[labelInput, spacingTop]}>
              Target Suara
              {targetSuara !== 0 &&
                !isNaN(parseInt(targetSuara)) &&
                ` : ${parseInt(targetSuara).toLocaleString()}`}
            </Typography>
            <TextField
              type="number"
              error={error && targetSuara.length === 0 && true}
              helperText={
                error && targetSuara.length === 0 && "Target Suara harus diisi!"
              }
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={targetSuara}
              onChange={(e) => setTargetSuara(e.target.value.toUpperCase())}
            />
            <Typography sx={[labelInput, spacingTop]}>
              Password Saksi
            </Typography>
            <TextField
              type="password"
              size="small"
              error={error && passwordSaksi.length === 0 && true}
              helperText={
                error &&
                passwordSaksi.length === 0 &&
                "Password Saksi Dealer harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={passwordSaksi}
              onChange={(e) => setPasswordSaksi(e.target.value.toUpperCase())}
            />
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
            onClick={saveTps}
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

export default TambahTps;

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
