import * as React from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@mui/styles";
import { Colors } from "../constants/styles";

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      color: "white",
      backgroundColor: Colors.blue700
    }
  },
  tableRightBorder: {
    borderWidth: 0,
    borderRightWidth: 1,
    borderColor: "white",
    borderStyle: "solid"
  }
});

export function ShowTableUser({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Username
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Tipe User
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Password
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.nama.toUpperCase().includes(searchTerm.toUpperCase()) ||
                val.tipeUser.toUpperCase().includes(searchTerm.toUpperCase()) ||
                val.password.toUpperCase().includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user._id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/daftarUser/${user._id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.nama}
                </TableCell>
                <TableCell>{user.tipeUser}</TableCell>
                <TableCell>{user.password}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableDaftarTps({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Caleg
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              No. TPS
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Nama TPS
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Nama Saksi
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              No. HP Saksi
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Jumlah Pemilih</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.idCaleg.nama
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.noTps.toUpperCase().includes(searchTerm.toUpperCase()) ||
                val.namaTps.toUpperCase().includes(searchTerm.toUpperCase()) ||
                val.noHpSaksi
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.namaSaksi
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.jumlahPemilih
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user._id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/daftarTps/${user._id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.idCaleg.nama}
                </TableCell>
                <TableCell>{user.noTps}</TableCell>
                <TableCell>{user.namaTps}</TableCell>
                <TableCell>{user.namaSaksi}</TableCell>
                <TableCell>{user.noHpSaksi}</TableCell>
                <TableCell>{user.jumlahPemilih}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableDaftarKecamatan({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Caleg
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Kode Kecamatan
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Nama Kecamatan</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.idCaleg.nama
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.kodeKecamatan
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.namaKecamatan
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user._id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/daftarKecamatan/${user._id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.idCaleg.nama}
                </TableCell>
                <TableCell>{user.kodeKecamatan}</TableCell>
                <TableCell>{user.namaKecamatan}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
