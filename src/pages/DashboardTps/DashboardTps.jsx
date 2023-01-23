import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { tempUrl } from "../../contexts/ContextProvider";
import { Loader } from "../../components";
import {
  Box,
  TextField,
  Typography,
  Divider,
  Button,
  Snackbar,
  Alert,
  Autocomplete
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Chart } from "react-google-charts";

const DashboardTps = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [openChart, setOpenChart] = useState(false);
  const [kecamatan, setKecamatan] = useState("");
  const [kecamatans, setKecamatans] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataBarChart, setDataBarChart] = useState([]);
  const [totalDataBarChart, setTotalDataBarChart] = useState([]);

  let optionsTpsPerKecamatan = {
    chart: {
      title: "Suara Tps Per Kecamatan"
    }
  };

  let optionsTotalTpsKecamatan = {
    chart: {
      title: "Suara Total Tps Kecamatan"
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const kecamatanOptions = kecamatans.map((kecamatan) => ({
    label: `${kecamatan._id} - ${kecamatan.namaKecamatan}`
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
    let totalJumlahPemilih = 0;
    let totalTargetSuara = 0;
    const kecamatans = await axios.post(`${tempUrl}/allTpsCalegByKecamatan`, {
      idKecamatan: kecamatan,
      id: user._id,
      token: user.token
    });
    let tempDataBarChart = [["TPS", "Jumlah Pemilih", "Target Suara"]];
    let tempTotalDataBarChart = [
      ["TotalTPS", "Jumlah Pemilih", "Target Suara"]
    ];
    for (let i = 0; i < kecamatans.data.length; i++) {
      let tempTpsKecamatan = [
        `${kecamatans.data[i].namaTps}`,
        kecamatans.data[i].jumlahPemilih,
        kecamatans.data[i].targetSuara
      ];
      totalJumlahPemilih += kecamatans.data[i].jumlahPemilih;
      totalTargetSuara += kecamatans.data[i].targetSuara;
      tempDataBarChart.push(tempTpsKecamatan);
    }
    let tempTotalTpsKecamatan = [
      `Total Semua Tps`,
      totalJumlahPemilih,
      totalTargetSuara
    ];
    tempTotalDataBarChart.push(tempTotalTpsKecamatan);
    setTotalDataBarChart(tempTotalDataBarChart);
    setDataBarChart(tempDataBarChart);
    setOpenChart(true);
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

      {openChart && (
        <>
          <Box sx={spacingTop}>
            <Chart
              chartType="Bar"
              width="800px"
              height="400px"
              data={dataBarChart}
              options={optionsTpsPerKecamatan}
            />
          </Box>
          <Box sx={spacingTop}>
            <Chart
              chartType="Bar"
              width="800px"
              height="400px"
              data={totalDataBarChart}
              options={optionsTotalTpsKecamatan}
            />
          </Box>
        </>
      )}
      <Box sx={spacingTop}>
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={cariTpsByKecamatan}
        >
          Cari
        </Button>
      </Box>
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

export default DashboardTps;

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
