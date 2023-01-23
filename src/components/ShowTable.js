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
            <TableCell className={classes.tableRightBorder}>Username</TableCell>
            <TableCell className={classes.tableRightBorder}>
              Tipe User
            </TableCell>
            <TableCell className={classes.tableRightBorder}>
              Target Suara Caleg
            </TableCell>
            <TableCell className={classes.tableRightBorder}>Password</TableCell>
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
                val.targetSuaraCaleg
                  .toString()
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
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
                <TableCell>{user.targetSuaraCaleg}</TableCell>
                <TableCell>{user.password}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableDaftarTps({ currentPosts, searchTerm, tipeUser }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            {tipeUser === "ADMIN" && (
              <TableCell className={classes.tableRightBorder}>Caleg</TableCell>
            )}
            <TableCell className={classes.tableRightBorder}>
              Kecamatan
            </TableCell>
            <TableCell className={classes.tableRightBorder}>No. TPS</TableCell>
            <TableCell className={classes.tableRightBorder}>Nama TPS</TableCell>
            <TableCell className={classes.tableRightBorder}>
              Jumlah Pemilih
            </TableCell>
            <TableCell>Target Suara</TableCell>
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
                val.idKecamatan._id
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.idKecamatan.namaKecamatan
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.noTps.toUpperCase().includes(searchTerm.toUpperCase()) ||
                val.namaTps.toUpperCase().includes(searchTerm.toUpperCase()) ||
                val.namaSaksi
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.jumlahPemilih
                  .toString()
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.targetSuara
                  .toString()
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
                {tipeUser === "ADMIN" && (
                  <TableCell component="th" scope="row">
                    {user.idCaleg.nama}
                  </TableCell>
                )}
                <TableCell>{`${user.idKecamatan._id} - ${user.idKecamatan.namaKecamatan}`}</TableCell>
                <TableCell>{user.noTps}</TableCell>
                <TableCell>{user.namaTps}</TableCell>
                <TableCell>{user.jumlahPemilih.toLocaleString()}</TableCell>
                <TableCell>{user.targetSuara.toLocaleString()}</TableCell>
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
            <TableCell className={classes.tableRightBorder}>Caleg</TableCell>
            <TableCell className={classes.tableRightBorder}>Kode</TableCell>
            <TableCell>Nama</TableCell>
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
                val._id.toUpperCase().includes(searchTerm.toUpperCase()) ||
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
                <TableCell>{user._id}</TableCell>
                <TableCell>{user.namaKecamatan}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
