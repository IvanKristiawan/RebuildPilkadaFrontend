import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import {
  Box,
  TextField,
  Typography,
  Divider,
  Button,
  ButtonGroup
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const ProfilCaleg = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <Box sx={container}>
      <Typography color="#757575">Caleg</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Profil Caleg
      </Typography>
      <Box sx={buttonModifierContainer}>
        <ButtonGroup variant="contained">
          <Button
            color="primary"
            startIcon={<EditIcon />}
            sx={{ textTransform: "none" }}
            onClick={() => {
              navigate(`/profilCaleg/${user._id}/edit`);
            }}
          >
            Ubah
          </Button>
        </ButtonGroup>
      </Box>
      <Divider sx={dividerStyle} />
      <Box sx={showDataContainer}>
        <Box sx={showDataWrapper}>
          <Typography sx={labelInput}>Nama</Typography>
          <TextField
            size="small"
            id="outlined-basic"
            variant="filled"
            InputProps={{
              readOnly: true
            }}
            value={user.nama}
          />
          <Typography sx={[labelInput, spacingTop]}>Tipe User</Typography>
          <TextField
            size="small"
            id="outlined-basic"
            variant="filled"
            InputProps={{
              readOnly: true
            }}
            value={user.tipeUser}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilCaleg;

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

const labelInput = {
  fontWeight: "600",
  marginLeft: 1
};

const spacingTop = {
  mt: 4
};
