import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../contexts/ContextProvider";
import { namaPerusahaan } from "../../constants/GeneralSetting";
import { ShowTableDaftarKelurahan } from "../../components/ShowTable";
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

const DaftarKelurahan = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [caleg, setCaleg] = useState("");
  const [kecamatan, setKecamatan] = useState("");
  const [kodeKelurahan, setKodeKelurahan] = useState("");
  const [namaKelurahan, setNamaKelurahan] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [kelurahanData, setKelurahanData] = useState([]);
  const [kelurahanForDoc, setKelurahanForDoc] = useState([]);
  const navigate = useNavigate();
  let isKelurahanExist = kodeKelurahan.length !== 0;

  const columns = [
    { title: "Caleg", field: "caleg" },
    { title: "Kecamatan", field: "kecamatan" },
    { title: "Kode Kelurahan", field: "kodeKelurahan" },
    { title: "Nama Kelurahan", field: "namaKelurahan" }
  ];

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = kelurahanData.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.idCaleg.nama.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.idKecamatan.kodeKecamatan
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.idKecamatan.namaKecamatan
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.kodeKelurahan.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.namaKelurahan.toUpperCase().includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(kelurahanData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getKelurahanForDoc();
    getKelurahanData();
    id && getKelurahanById();
  }, [id]);

  const getKelurahanData = async () => {
    try {
      if (user.tipeUser === "ADMIN") {
        const kelurahans = await axios.post(`${tempUrl}/kelurahans`, {
          id: user._id,
          token: user.token
        });
        setKelurahanData(kelurahans.data);
      } else {
        const kelurahans = await axios.post(`${tempUrl}/kelurahansCaleg`, {
          id: user._id,
          token: user.token
        });
        setKelurahanData(kelurahans.data);
      }
    } catch (err) {
      setIsFetchError(true);
    }
  };

  const getKelurahanForDoc = async () => {
    try {
      if (user.tipeUser === "ADMIN") {
        const kelurahansForDoc = await axios.post(
          `${tempUrl}/kelurahansForDoc`,
          {
            id: user._id,
            token: user.token
          }
        );
        setKelurahanForDoc(kelurahansForDoc.data);
      } else {
        const kelurahansForDoc = await axios.post(
          `${tempUrl}/kelurahansForDocCaleg`,
          {
            id: user._id,
            token: user.token
          }
        );
        setKelurahanForDoc(kelurahansForDoc.data);
      }
    } catch (err) {
      setIsFetchError(true);
    }
  };

  const getKelurahanById = async () => {
    if (id) {
      const pickedKelurahan = await axios.post(`${tempUrl}/kelurahan/${id}`, {
        id: user._id,
        token: user.token
      });
      setCaleg(pickedKelurahan.data.idCaleg.nama);
      setKecamatan(
        `${pickedKelurahan.data.idKecamatan.kodeKecamatan} - ${pickedKelurahan.data.idKecamatan.namaKecamatan}`
      );
      setKodeKelurahan(pickedKelurahan.data.kodeKelurahan);
      setNamaKelurahan(pickedKelurahan.data.namaKelurahan);
    }
  };

  const deleteKelurahan = async (id) => {
    try {
      setLoading(true);
      await axios.post(`${tempUrl}/deleteKelurahan/${id}`, {
        id: user._id,
        token: user.token
      });
      setKodeKelurahan("");
      setNamaKelurahan("");
      setLoading(false);
      navigate("/daftarKelurahan");
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
    doc.text(`Daftar Kelurahan`, 85, 30);
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
      body: kelurahanForDoc,
      headStyles: {
        fillColor: [117, 117, 117],
        color: [0, 0, 0]
      }
    });
    doc.save(`daftarKelurahan.pdf`);
  };

  if (loading) {
    return <Loader />;
  }

  if (isFetchError) {
    return <FetchErrorHandling />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Daftar Kelurahan</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Daftar Kelurahan
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
            kode={kodeKelurahan}
            addLink={null}
            editLink={null}
            deleteUser={deleteKelurahan}
            nameUser={kodeKelurahan}
          />
        </Box>
      ) : (
        <Box sx={buttonModifierContainer}>
          <ButtonModifier
            id={id}
            kode={kodeKelurahan}
            addLink={`/daftarKelurahan/tambahKelurahan`}
            editLink={`/daftarKelurahan/${id}/edit`}
            deleteUser={deleteKelurahan}
            nameUser={kodeKelurahan}
          />
        </Box>
      )}
      <Divider sx={dividerStyle} />
      {isKelurahanExist && (
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
              <Typography sx={[labelInput, spacingTop]}>Kecamatan</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={kecamatan}
              />
              <Typography sx={[labelInput, spacingTop]}>
                Kode Kelurahan
              </Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={kodeKelurahan}
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
                value={namaKelurahan}
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
        <ShowTableDaftarKelurahan
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

export default DaftarKelurahan;

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
