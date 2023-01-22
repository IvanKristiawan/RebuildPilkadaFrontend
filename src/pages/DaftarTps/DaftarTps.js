import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../contexts/ContextProvider";
import { namaPerusahaan } from "../../constants/GeneralSetting";
import { ShowTableDaftarTps } from "../../components/ShowTable";
import { FetchErrorHandling } from "../../components/FetchErrorHandling";
import {
  SearchBar,
  Loader,
  usePagination,
  ButtonModifier
} from "../../components";
import {
  Box,
  TextField,
  Typography,
  Divider,
  Pagination,
  Button,
  ButtonGroup
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import PrintIcon from "@mui/icons-material/Print";

const DaftarTps = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [caleg, setCaleg] = useState("");
  const [noTps, setNoTps] = useState("");
  const [namaTps, setNamaTps] = useState("");
  const [noHpSaksi, setNoHpSaksi] = useState("");
  const [namaSaksi, setNamaSaksi] = useState("");
  const [jumlahPemilih, setJumlahPemilih] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [tpsData, setTpsData] = useState([]);
  const [tpsForDoc, setTpsForDoc] = useState([]);
  const navigate = useNavigate();
  let isTpsExist = noTps.length !== 0;

  const columns = [
    { title: "Caleg", field: "caleg" },
    { title: "No. TPS", field: "noTps" },
    { title: "Nama TPS", field: "namaTps" },
    { title: "No. HP Saksi", field: "noHpSaksi" },
    { title: "Nama Saksi", field: "namaSaksi" },
    { title: "Jumlah", field: "jumlahPemilih" }
  ];

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = tpsData.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.idCaleg.nama.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.noTps.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.namaTps.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.noHpSaksi.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.namaSaksi.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.jumlahPemilih.toUpperCase().includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(tpsData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    // setInterval(async () => {
    //   getTpsForDoc();
    //   getTpsData();
    // }, 2000);
    getTpsForDoc();
    getTpsData();
    id && getTpsById();
  }, [id]);

  const getTpsData = async () => {
    try {
      if (user.tipeUser === "ADMIN") {
        const allTps = await axios.post(`${tempUrl}/allTps`, {
          id: user._id,
          token: user.token
        });
        setTpsData(allTps.data);
      } else {
        const allTps = await axios.post(`${tempUrl}/allTpsCaleg`, {
          id: user._id,
          token: user.token
        });
        setTpsData(allTps.data);
      }
    } catch (err) {
      setIsFetchError(true);
    }
  };

  const getTpsForDoc = async () => {
    try {
      if (user.tipeUser === "ADMIN") {
        const allTpsForDoc = await axios.post(`${tempUrl}/allTpsForDoc`, {
          id: user._id,
          token: user.token
        });
        setTpsForDoc(allTpsForDoc.data);
      } else {
        const allTpsForDoc = await axios.post(`${tempUrl}/allTpsForDocCaleg`, {
          id: user._id,
          token: user.token
        });
        setTpsForDoc(allTpsForDoc.data);
      }
    } catch (err) {
      setIsFetchError(true);
    }
  };

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

  const deleteTps = async (id) => {
    try {
      setLoading(true);
      await axios.post(`${tempUrl}/deleteTps/${id}`, {
        id: user._id,
        token: user.token
      });
      setNoTps("");
      setNamaTps("");
      setNoHpSaksi("");
      setNamaSaksi("");
      setJumlahPemilih("");
      setLoading(false);
      navigate("/daftarTps");
    } catch (error) {
      console.log(error);
    }
  };

  const downloadPdf = () => {
    var date = new Date();
    var current_date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    var current_time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`${namaPerusahaan}`, 15, 10);
    doc.setFontSize(16);
    doc.text(`Daftar Tps`, 90, 30);
    doc.setFontSize(10);
    doc.text(
      `Dicetak Oleh: ${user.nama} | Tanggal : ${current_date} | Jam : ${current_time}`,
      15,
      290
    );
    doc.setFontSize(12);
    doc.autoTable({
      startY: doc.pageCount > 1 ? doc.autoTableEndPosY() + 20 : 45,
      columns: columns.map((col) => ({ ...col, dataKey: col.field })),
      body: tpsForDoc,
      headStyles: {
        fillColor: [117, 117, 117],
        color: [0, 0, 0]
      }
    });
    doc.save(`daftarTps.pdf`);
  };

  if (loading) {
    return <Loader />;
  }

  if (isFetchError) {
    return <FetchErrorHandling />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Daftar TPS</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Daftar TPS
      </Typography>
      <Box sx={downloadButtons}>
        <ButtonGroup variant="outlined" color="secondary">
          <Button startIcon={<PrintIcon />} onClick={() => downloadPdf()}>
            CETAK
          </Button>
        </ButtonGroup>
      </Box>
      <Box sx={buttonModifierContainer}>
        <ButtonModifier
          id={id}
          kode={noTps}
          addLink={`/daftarTps/tambahTps`}
          editLink={`/daftarTps/${id}/edit`}
          deleteUser={deleteTps}
          nameUser={noTps}
        />
      </Box>
      <Divider sx={dividerStyle} />
      {isTpsExist && (
        <>
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
              <Typography sx={[labelInput, spacingTop]}>
                No. HP Saksi
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={noHpSaksi}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Jumlah Pemilih
              </Typography>
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
        </>
      )}
      <Box sx={searchBarContainer}>
        <SearchBar setSearchTerm={setSearchTerm} />
      </Box>
      <Box sx={tableContainer}>
        <ShowTableDaftarTps
          currentPosts={currentPosts}
          searchTerm={searchTerm}
        />
      </Box>
      <Box sx={tableContainer}>
        <Pagination
          count={count}
          page={page}
          onChange={handleChange}
          color="primary"
          size={screenSize <= 600 ? "small" : "large"}
        />
      </Box>
    </Box>
  );
};

export default DaftarTps;

const container = {
  p: 4
};

const subTitleText = {
  fontWeight: "900"
};

const buttonModifierContainer = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center"
};

const dividerStyle = {
  pt: 4
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

const searchBarContainer = {
  pt: 6,
  display: "flex",
  justifyContent: "center"
};

const tableContainer = {
  pt: 4,
  display: "flex",
  justifyContent: "center"
};

const labelInput = {
  fontWeight: "600",
  marginLeft: 1
};

const spacingTop = {
  mt: 4
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

const downloadButtons = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center"
};
