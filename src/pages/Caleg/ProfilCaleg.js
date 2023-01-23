import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { tempUrl } from "../../contexts/ContextProvider";
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
  const [nama, setNama] = useState("");
  const [tipeUser, setTipeUser] = useState("");
  const [targetSuaraCaleg, setTargetSuaraCaleg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getUserById();
  }, []);

  const getUserById = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/findUser/${user._id}`, {
      id: user._id,
      token: user.token
    });
    setNama(response.data.nama);
    setTipeUser(response.data.tipeUser);
    setTargetSuaraCaleg(response.data.targetSuaraCaleg);
    setLoading(false);
  };

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
            value={nama}
          />
          <Typography sx={[labelInput, spacingTop]}>Tipe User</Typography>
          <TextField
            size="small"
            id="outlined-basic"
            variant="filled"
            InputProps={{
              readOnly: true
            }}
            value={tipeUser}
          />
          <Typography sx={[labelInput, spacingTop]}>
            Target Suara Caleg
          </Typography>
          <TextField
            size="small"
            id="outlined-basic"
            variant="filled"
            InputProps={{
              readOnly: true
            }}
            value={targetSuaraCaleg.toLocaleString()}
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
