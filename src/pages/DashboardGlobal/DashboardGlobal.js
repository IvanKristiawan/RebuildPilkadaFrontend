import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { tempUrl } from "../../contexts/ContextProvider";
import { Box, Typography, Divider, Paper } from "@mui/material";
import { Chart } from "react-google-charts";

const DashboardGlobal = () => {
  const { user } = useContext(AuthContext);
  const [dataBarChart, setDataBarChart] = useState([]);

  useEffect(() => {
    getTotalSuaraData();
    setInterval(async () => {
      getTotalSuaraData();
    }, 5000);
  }, []);

  const getTotalSuaraData = async () => {
    const totalSuara = await axios.post(
      `${tempUrl}/allTpsCalegByKecamatanTotal`,
      {
        id: user._id,
        token: user.token
      }
    );
    let tempDataBarChart = [
      [
        "Total Suara Global",
        "Total Pemilih",
        "Total Target Suara TPS",
        "Jumlah Pemilih"
      ]
    ];
    let tempTotalSuara = [
      `Statistik ${user.nama}`,
      totalSuara.data[0].totalPemilih,
      totalSuara.data[0].totalTargetSuara,
      totalSuara.data[0].totalJumlahPemilih
    ];
    tempDataBarChart.push(tempTotalSuara);
    setDataBarChart(tempDataBarChart);
  };

  return (
    <Box sx={container}>
      <Typography color="#757575">Dashboard Global</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Total Suara Global
      </Typography>
      <Divider sx={dividerStyle} />

      <Paper sx={graphContainer} elevation={8}>
        <Chart
          chartType="ColumnChart"
          width="100%"
          height="400px"
          data={dataBarChart}
        />
      </Paper>
    </Box>
  );
};

export default DashboardGlobal;

const container = {
  p: 4
};

const subTitleText = {
  fontWeight: "900"
};
const dividerStyle = {
  pt: 4
};

const graphContainer = {
  p: 6
};
