import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../contexts/ContextProvider";
import { namaPerusahaan } from "../../constants/GeneralSetting";
import { ShowTableDaftarKecamatan } from "../../components/ShowTable";
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

const DaftarKecamatan = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [caleg, setCaleg] = useState("");
  const [kodeKecamatan, setKodeKecamatan] = useState("");
  const [namaKecamatan, setNamaKecamatan] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [kecamatanData, setKecamatanData] = useState([]);
  const [kecamatanForDoc, setKecamatanForDoc] = useState([]);
  const navigate = useNavigate();
  let isKecamatanExist = kodeKecamatan.length !== 0;

  const columns = [
    { title: "Caleg", field: "caleg" },
    { title: "Kode Kecamatan", field: "kodeKecamatan" },
    { title: "Nama Kecamatan", field: "namaKecamatan" }
  ];

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = kecamatanData.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.idCaleg.nama.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.kodeKecamatan.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.namaKecamatan.toUpperCase().includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(kecamatanData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getKecamatanForDoc();
    getKecamatanData();
    id && getKecamatanById();
  }, [id]);

  const getKecamatanData = async () => {
    try {
      if (user.tipeUser === "ADMIN") {
        const kecamatans = await axios.post(`${tempUrl}/kecamatans`, {
          id: user._id,
          token: user.token
        });
        setKecamatanData(kecamatans.data);
      } else {
        const kecamatans = await axios.post(`${tempUrl}/kecamatansCaleg`, {
          id: user._id,
          token: user.token
        });
        setKecamatanData(kecamatans.data);
      }
    } catch (err) {
      setIsFetchError(true);
    }
  };

  const getKecamatanForDoc = async () => {
    try {
      if (user.tipeUser === "ADMIN") {
        const kecamatansForDoc = await axios.post(
          `${tempUrl}/kecamatansForDoc`,
          {
            id: user._id,
            token: user.token
          }
        );
        setKecamatanForDoc(kecamatansForDoc.data);
      } else {
        const kecamatansForDoc = await axios.post(
          `${tempUrl}/kecamatansForDocCaleg`,
          {
            id: user._id,
            token: user.token
          }
        );
        setKecamatanForDoc(kecamatansForDoc.data);
      }
    } catch (err) {
      setIsFetchError(true);
    }
  };

  const getKecamatanById = async () => {
    if (id) {
      const pickedKecamatan = await axios.post(`${tempUrl}/kecamatan/${id}`, {
        id: user._id,
        token: user.token
      });
      setCaleg(pickedKecamatan.data.idCaleg.nama);
      setKodeKecamatan(pickedKecamatan.data.kodeKecamatan);
      setNamaKecamatan(pickedKecamatan.data.namaKecamatan);
    }
  };

  const deleteKecamatan = async (id) => {
    try {
      setLoading(true);
      await axios.post(`${tempUrl}/deleteKecamatan/${id}`, {
        id: user._id,
        token: user.token
      });
      setKodeKecamatan("");
      setNamaKecamatan("");
      setLoading(false);
      navigate("/daftarKecamatan");
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
    doc.text(`Daftar Kecamatan`, 85, 30);
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
      body: kecamatanForDoc,
      headStyles: {
        fillColor: [117, 117, 117],
        color: [0, 0, 0]
      }
    });
    doc.save(`daftarKecamatan.pdf`);
  };

  if (loading) {
    return <Loader />;
  }

  if (isFetchError) {
    return <FetchErrorHandling />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Daftar Kecamatan</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Daftar Kecamatan
      </Typography>
      <Box sx={downloadButtons}>
        <ButtonGroup variant="outlined" color="secondary">
          <Button startIcon={<PrintIcon />} onClick={() => downloadPdf()}>
            CETAK
          </Button>
        </ButtonGroup>
      </Box>
      {user.tipeUser === "ADMIN" ? (
        <Box sx={buttonModifierContainer}>
          <ButtonModifier
            id={id}
            kode={kodeKecamatan}
            addLink={null}
            editLink={null}
            deleteUser={deleteKecamatan}
            nameUser={kodeKecamatan}
          />
        </Box>
      ) : (
        <Box sx={buttonModifierContainer}>
          <ButtonModifier
            id={id}
            kode={kodeKecamatan}
            addLink={`/daftarKecamatan/tambahKecamatan`}
            editLink={`/daftarKecamatan/${id}/edit`}
            deleteUser={deleteKecamatan}
            nameUser={kodeKecamatan}
          />
        </Box>
      )}
      <Divider sx={dividerStyle} />
      {isKecamatanExist && (
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
              <Typography sx={[labelInput, spacingTop]}>
                Kode Kecamatan
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={kodeKecamatan}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Nama Kecamatan
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={namaKecamatan}
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
        <ShowTableDaftarKecamatan
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

export default DaftarKecamatan;

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

const downloadButtons = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center"
};
