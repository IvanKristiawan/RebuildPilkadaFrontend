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

const UbahTps = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [caleg, setCaleg] = useState("");
  const [kecamatan, setKecamatan] = useState("");
  const [noTps, setNoTps] = useState("");
  const [namaTps, setNamaTps] = useState("");
  const [noHpSaksi, setNoHpSaksi] = useState("");
  const [namaSaksi, setNamaSaksi] = useState("");
  const [jumlahPemilih, setJumlahPemilih] = useState("");
  const [targetSuara, setTargetSuara] = useState("");
  const [totalPemilih, setTotalPemilih] = useState("");
  const [passwordSaksi, setPasswordSaksi] = useState("");
  const [passwordSaksiAwal, setPasswordSaksiAwal] = useState("");
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
    getTpsById();
  }, []);

  const getTpsById = async () => {
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
    setTargetSuara(pickedTps.data.targetSuara);
    setTotalPemilih(pickedTps.data.totalPemilih);
    setPasswordSaksiAwal(pickedTps.data.passwordSaksi);
    setCaleg(pickedTps.data.idCaleg.nama);
    setKecamatan(
      `${pickedTps.data.idKecamatan._id} - ${pickedTps.data.idKecamatan.namaKecamatan}`
    );
    setLoading(false);
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
      totalPemilih.length === 0 ||
      targetSuara.length === 0;
    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/updateTps/${id}`, {
          namaTps,
          noHpSaksi,
          namaSaksi,
          totalPemilih,
          targetSuara,
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
            <Typography sx={[labelInput, spacingTop]}>Kecamatan</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={kecamatan}
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
            />
            <Typography sx={[labelInput, spacingTop]}>No. TPS</Typography>
            <TextField
              size="small"
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
            <Typography sx={labelInput}>Jumlah Pemilih</Typography>
            <TextField
              tpye="number"
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={jumlahPemilih}
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
            />
            <Typography sx={[labelInput, spacingTop]}>
              Total Pemilih
              {totalPemilih !== 0 &&
                !isNaN(parseInt(totalPemilih)) &&
                ` : ${parseInt(totalPemilih).toLocaleString()}`}
            </Typography>
            <TextField
              tpye="number"
              error={error && totalPemilih.length === 0 && true}
              helperText={
                error &&
                totalPemilih.length === 0 &&
                "Total Pemilih harus diisi!"
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
              tpye="number"
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
