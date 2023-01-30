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

const DashboardTpsPerKecamatan = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [openChart, setOpenChart] = useState(false);
  const [kecamatan, setKecamatan] = useState("");
  const [kecamatans, setKecamatans] = useState([]);
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

  const kecamatanOptions = kecamatans.map((kecamatan) => ({
    label: `${kecamatan.kodeKecamatan} - ${kecamatan.namaKecamatan}`
  }));

  useEffect(() => {
    getKecamatansCalegData();
  }, []);

  const getKecamatansCalegData = async () => {
    setLoading(true);
    const kecamatans = await axios.post(`${tempUrl}/kecamatansCaleg`, {
      id: user._id,
      token: user.token
    });
    setKecamatans(kecamatans.data);
    setLoading(false);
  };

  const cariTpsByKecamatan = async () => {
    let totalPemilih = 0;
    let totalJumlahPemilih = 0;
    let totalTargetSuara = 0;

    let isFailedValidation = kecamatan.length === 0;
    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      let tempKecamatan = await axios.post(
        `${tempUrl}/kecamatanCalegByKodeKecamatan`,
        {
          kodeKecamatan: kecamatan,
          id: user._id,
          token: user.token
        }
      );
      const kecamatans = await axios.post(`${tempUrl}/allTpsCalegByKecamatan`, {
        idKecamatan: tempKecamatan.data._id,
        id: user._id,
        token: user.token
      });
      if (kecamatans.data.length > 0) {
        let tempDataBarChart = [
          ["TPS", "Total Pemilih", "Target Suara", "Jumlah Pemilih"]
        ];
        let tempTotalDataBarChart = [
          ["TotalTPS", "Total Pemilih", "Target Suara", "Jumlah Pemilih"]
        ];
        for (let i = 0; i < kecamatans.data.length; i++) {
          let tempTpsKecamatan = [
            `${kecamatans.data[i].namaTps}`,
            kecamatans.data[i].totalPemilih,
            kecamatans.data[i].targetSuara,
            kecamatans.data[i].jumlahPemilih
          ];
          totalPemilih += kecamatans.data[i].totalPemilih;
          totalTargetSuara += kecamatans.data[i].targetSuara;
          totalJumlahPemilih += kecamatans.data[i].jumlahPemilih;
          tempDataBarChart.push(tempTpsKecamatan);
        }
        let tempTotalTpsKecamatan = [
          `Total Semua Tps`,
          totalPemilih,
          totalTargetSuara,
          totalJumlahPemilih
        ];
        tempTotalDataBarChart.push(tempTotalTpsKecamatan);
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
        TPS Per Kecamatan
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
            {`Tidak ada Data TPS di Kecamatan ini!`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert}>Ok</Button>
        </DialogActions>
      </Dialog>
      <Divider sx={dividerStyle} />
      <Typography sx={[labelInput, spacingTop]}>Kode Kecamatan</Typography>
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
              error && kecamatan.length === 0 && "Kode Kecamatan harus diisi!"
            }
            {...params}
          />
        )}
        onInputChange={(e, value) => {
          setKecamatan(value.split(" ", 1)[0]);
        }}
      />

      <Box sx={spacingTop}>
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={cariTpsByKecamatan}
        >
          Cari
        </Button>
      </Box>

      {openChart && (
        <>
          <Divider sx={dividerStyle} />
          <Paper sx={graphContainer} elevation={8}>
            <Typography sx={[labelInput, graphTitle]}>
              Suara TPS Per Kecamatan
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
              Akumulasi Total TPS Kecamatan
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

export default DashboardTpsPerKecamatan;

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
