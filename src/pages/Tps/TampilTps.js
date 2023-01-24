import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { tempUrl } from "../../contexts/ContextProvider";
import {
  Box,
  Typography,
  ButtonGroup,
  Button,
  Divider,
  TextField
} from "@mui/material";

const TampilTps = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [caleg, setCaleg] = useState("");
  const [noTps, setNoTps] = useState("");
  const [namaTps, setNamaTps] = useState("");
  const [noHpSaksi, setNoHpSaksi] = useState("");
  const [namaSaksi, setNamaSaksi] = useState("");
  const [jumlahPemilih, setJumlahPemilih] = useState("");
  const [processTambahButton, setProcessTambahButton] = useState(false);
  const [processKurangButton, setProcessKurangButton] = useState(false);

  useEffect(() => {
    getTpsById();
  }, []);

  const getTpsById = async () => {
    if (id) {
      const pickedTps = await axios.post(`${tempUrl}/tps/${id}`, {
        id: user._id,
        token: user.token
      });
      setCaleg(pickedTps.data.idCaleg.nama);
      setNoTps(pickedTps.data.noTps);
      setNamaTps(pickedTps.data.namaTps);
      setNoHpSaksi(pickedTps.data.noHpSaksi);
      setNamaSaksi(pickedTps.data.namaSaksi);
      setJumlahPemilih(pickedTps.data.jumlahPemilih);
    }
  };

  const tambahJumlahPemilih = async () => {
    try {
      setProcessTambahButton(true);
      await axios
        .post(`${tempUrl}/tambahJumlahPemilih/${id}`, {
          id: user._id,
          token: user.token
        })
        .then(() => {
          setJumlahPemilih(jumlahPemilih + 1);
          setProcessTambahButton(false);
        });
    } catch (err) {
      alert(err);
    }
  };

  const kurangJumlahPemilih = async () => {
    try {
      setProcessKurangButton(true);
      await axios
        .post(`${tempUrl}/kurangJumlahPemilih/${id}`, {
          id: user._id,
          token: user.token
        })
        .then(() => {
          setJumlahPemilih(jumlahPemilih - 1);
          setProcessKurangButton(false);
        });
    } catch (err) {
      alert(err);
    }
  };

  return (
    <Box sx={container}>
      <Typography color="#757575">TPS</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Calon : {caleg}
      </Typography>
      <Divider sx={dividerStyle} />
      <Box sx={showDataContainer}>
        <Box sx={showDataWrapper}>
          <Typography sx={labelInput}>Caleg</Typography>
          <TextField
            size="small"
            id="outlined-basic"
            variant="filled"
            InputProps={{
              readOnly: true
            }}
            value={caleg}
          />
          <Typography sx={[labelInput, spacingTop]}>No. TPS</Typography>
          <TextField
            size="small"
            id="outlined-basic"
            variant="filled"
            InputProps={{
              readOnly: true
            }}
            value={noTps}
          />
          <Typography sx={[labelInput, spacingTop]}>Nama TPS</Typography>
          <TextField
            size="small"
            id="outlined-basic"
            variant="filled"
            InputProps={{
              readOnly: true
            }}
            value={namaTps}
          />
        </Box>
        <Box sx={[showDataWrapper, secondWrapper]}>
          <Typography sx={labelInput}>Nama Saksi</Typography>
          <TextField
            size="small"
            id="outlined-basic"
            variant="filled"
            InputProps={{
              readOnly: true
            }}
            value={namaSaksi}
          />
          <Typography sx={[labelInput, spacingTop]}>No. HP Saksi</Typography>
          <TextField
            size="small"
            id="outlined-basic"
            variant="filled"
            InputProps={{
              readOnly: true
            }}
            value={noHpSaksi}
          />
          <Typography sx={[labelInput, spacingTop]}>Jumlah Pemilih</Typography>
          <TextField
            size="small"
            id="outlined-basic"
            variant="filled"
            InputProps={{
              readOnly: true
            }}
            value={jumlahPemilih}
          />
        </Box>
      </Box>
      <Divider sx={dividerStyle} />
      <Box sx={spacingTop}>
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
        >
          <Button
            disabled={processTambahButton}
            onClick={() => tambahJumlahPemilih()}
          >
            + Tambah Pemilih
          </Button>
          <Button
            disabled={processKurangButton}
            color="secondary"
            onClick={() => kurangJumlahPemilih()}
          >
            - Kurangkan Pemilih
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
};

export default TampilTps;

const container = {
  p: 4
};

const subTitleText = {
  fontWeight: "900"
};

const dividerStyle = {
  mt: 2
};

const spacingTop = {
  mt: 4,
  mb: 2
};

const labelInput = {
  fontWeight: "600",
  marginLeft: 1
};

const showDataWrapper = {
  display: "flex",
  flex: 1,
  flexDirection: "column",
  maxWidth: {
    md: "40vw"
  }
};

const showDataContainer = {
  mt: 4,
  display: "flex",
  flexDirection: {
    xs: "column",
    sm: "row"
  }
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
