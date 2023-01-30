import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import {
  Box,
  TextField,
  Typography,
  Divider,
  Button,
  Snackbar,
  Alert,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Chart } from "react-google-charts";

const DashboardTpsPerKelurahan = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [openChart, setOpenChart] = useState(false);
  const [kelurahan, setKelurahan] = useState("");
  const [kelurahans, setKelurahans] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataBarChart, setDataBarChart] = useState([]);
  const [totalDataBarChart, setTotalDataBarChart] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);

  const handleClickOpenAlert = () => {
    setOpenAlert(true);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const kelurahanOptions = kelurahans.map((kelurahan) => ({
    label: `${kelurahan.kodeKelurahan} - ${kelurahan.namaKelurahan}`
  }));

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

  const cariTpsByKelurahan = async () => {
    let totalPemilih = 0;
    let totalJumlahPemilih = 0;
    let totalTargetSuara = 0;

    let isFailedValidation = kelurahan.length === 0;
    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      let tempKelurahan = await axios.post(
        `${tempUrl}/kelurahanCalegByKodeKelurahan`,
        {
          kodeKelurahan: kelurahan,
          id: user._id,
          token: user.token
        }
      );
      const kelurahans = await axios.post(`${tempUrl}/allTpsCalegByKelurahan`, {
        idKelurahan: tempKelurahan.data._id,
        id: user._id,
        token: user.token
      });
      if (kelurahans.data.length > 0) {
        let tempDataBarChart = [
          ["TPS", "Total Pemilih", "Target Suara", "Jumlah Pemilih"]
        ];
        let tempTotalDataBarChart = [
          ["TotalTPS", "Total Pemilih", "Target Suara", "Jumlah Pemilih"]
        ];
        for (let i = 0; i < kelurahans.data.length; i++) {
          let tempTpsKelurahan = [
            `${kelurahans.data[i].namaTps}`,
            kelurahans.data[i].totalPemilih,
            kelurahans.data[i].targetSuara,
            kelurahans.data[i].jumlahPemilih
          ];
          totalPemilih += kelurahans.data[i].totalPemilih;
          totalTargetSuara += kelurahans.data[i].targetSuara;
          totalJumlahPemilih += kelurahans.data[i].jumlahPemilih;
          tempDataBarChart.push(tempTpsKelurahan);
        }
        let tempTotalTpsKelurahan = [
          `Total Semua Tps`,
          totalPemilih,
          totalTargetSuara,
          totalJumlahPemilih
        ];
        tempTotalDataBarChart.push(tempTotalTpsKelurahan);
        setTotalDataBarChart(tempTotalDataBarChart);
        setDataBarChart(tempDataBarChart);
        setOpenChart(true);
      } else {
        handleClickOpenAlert();
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Dashboard TPS</Typography>
      <Typography variant="h4" sx={subTitleText}>
        TPS Per Kelurahan
      </Typography>
      <Dialog
        open={openAlert}
        onClose={handleCloseAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Tidak Ada TPS`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {`Tidak ada Data TPS di Kelurahan ini!`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert}>Ok</Button>
        </DialogActions>
      </Dialog>
      <Divider sx={dividerStyle} />
      <Typography sx={[labelInput, spacingTop]}>Kode Kelurahan</Typography>
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
              error && kelurahan.length === 0 && "Kode Kelurahan harus diisi!"
            }
            {...params}
          />
        )}
        onInputChange={(e, value) => {
          setKelurahan(value.split(" ", 1)[0]);
        }}
      />

      <Box sx={spacingTop}>
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={cariTpsByKelurahan}
        >
          Cari
        </Button>
      </Box>

      {openChart && (
        <>
          <Divider sx={dividerStyle} />
          <Paper sx={graphContainer} elevation={8}>
            <Typography sx={[labelInput, graphTitle]}>
              Suara TPS Per Kelurahan
            </Typography>
            <Chart
              chartType="BarChart"
              width="100%"
              height="400px"
              data={dataBarChart}
            />
          </Paper>
          <Divider sx={dividerStyle} />
          <Paper sx={graphContainer} elevation={8}>
            <Typography sx={[labelInput, graphTitle]}>
              Akumulasi Total TPS Kelurahan
            </Typography>
            <Chart
              chartType="ColumnChart"
              width="100%"
              height="400px"
              data={totalDataBarChart}
            />
          </Paper>
        </>
      )}
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

export default DashboardTpsPerKelurahan;

const container = {
  p: 4
};

const subTitleText = {
  fontWeight: "900"
};
const dividerStyle = {
  pt: 4
};

const labelInput = {
  fontWeight: "600",
  marginLeft: 1
};

const spacingTop = {
  mt: 4
};

const alertBox = {
  width: "100%"
};

const graphContainer = {
  p: 6
};

const graphTitle = {
  mb: 4
};
