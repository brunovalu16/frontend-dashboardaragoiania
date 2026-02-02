import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Modal,
  Typography,
  Alert,
  Collapse,
  IconButton,
  InputAdornment,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";
import { authFokus360, dbFokus360 as db } from "../../data/firebase-config";

import CloseIcon from "@mui/icons-material/Close";
import WarningIcon from "@mui/icons-material/Warning";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";


import logo from "../../assets/images/fokus360cinza.png"; // logo do painel

const CARD_W = 820; // parecido com o print
const LEFT_W = 320;

const Login = () => {
  const [open, setOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [alertReset, setAlertReset] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const navigate = useNavigate();

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setAlert({
        open: true,
        message: "Por favor, preencha todos os campos.",
        severity: "error",
      });
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        authFokus360,
        email,
        password
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        window.alert("Por favor, verifique seu e-mail antes de fazer login.");
        await authFokus360.signOut();
        return;
      }

      const userDoc = await getDoc(doc(db, "user", user.uid));
      if (userDoc.exists()) {
        const userRole = userDoc.data().role;

        localStorage.setItem("userId", user.uid);
        localStorage.setItem("token", user.accessToken);
        localStorage.setItem("userRole", userRole);

        navigate(userRole === "07" ? "/projetos" : "/home");
      } else {
        setAlert({
          open: true,
          message: "Usuário não encontrado no Firestore.",
          severity: "error",
        });
      }
    } catch (error) {
      let errorMessage = "Ocorreu um erro inesperado.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "Usuário não encontrado. Verifique o email informado.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Senha incorreta. Tente novamente.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Email inválido. Por favor, insira um email válido.";
      }

      setAlert({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  // Reset senha
  const handlePasswordReset = async () => {
    if (!resetEmail) {
      setAlertReset({
        open: true,
        message: "Por favor, insira seu e-mail.",
        severity: "error",
      });
      return;
    }

    try {
      await sendPasswordResetEmail(authFokus360, resetEmail);
      setAlertReset({
        open: true,
        message:
          "E-mail de redefinição de senha enviado com sucesso! Verifique sua caixa de entrada.",
        severity: "success",
      });
      setOpen(false);
    } catch (error) {
      setAlertReset({
        open: true,
        message:
          "Erro ao enviar e-mail de redefinição. Verifique se o e-mail está correto.",
        severity: "error",
      });
    }
  };

  // Inputs estilo do print (underline/cinza)
  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "2px",
      backgroundColor: "transparent",
      "& fieldset": { borderColor: "transparent" },
      "&:hover fieldset": { borderColor: "transparent" },
      "&.Mui-focused fieldset": { borderColor: "transparent" },
    },
    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
    "& .MuiInputLabel-root": { color: "#9CA3AF", fontSize: 12 },
    "& .MuiInputLabel-root.Mui-focused": { color: "#9CA3AF" },
    "& .MuiOutlinedInput-input": {
      color: "#374151",
      fontSize: 13,
      paddingLeft: 0,
    },
  };

  return (
    <>
      {/* Modal para redefinição de senha */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: 420,
            maxWidth: "92vw",
            backgroundColor: "#fff",
            p: 4,
            borderRadius: 1,
            boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
            textAlign: "left",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            outline: "none",
          }}
        >
          <Typography sx={{ color: "#111827", fontWeight: 700, mb: 0.5 }}>
            Redefinir senha
          </Typography>
          <Typography sx={{ color: "#6B7280", mb: 2, fontSize: 13 }}>
            Informe seu e-mail para receber o link de redefinição.
          </Typography>

          <TextField
            label="E-mail"
            type="email"
            fullWidth
            variant="outlined"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                "& fieldset": { borderColor: "#D1D5DB" },
                "&:hover fieldset": { borderColor: "#9CA3AF" },
                "&.Mui-focused fieldset": { borderColor: "#2563EB" },
              },
            }}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              height: 42,
              borderRadius: 1,
              backgroundColor: "#4B0F8A",
              textTransform: "none",
              fontWeight: 700,
              "&:hover": { backgroundColor: "#6316b4" },
            }}
            onClick={handlePasswordReset}
          >
            Enviar link
          </Button>
        </Box>
      </Modal>

      {/* Modal de alerta (erro login) */}
      <Modal open={alert.open} onClose={() => setAlert({ ...alert, open: false })}>
        <Box
          sx={{
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            outline: "none",
            background: "transparent",
          }}
        >
          <Collapse in={alert.open}>
            <Alert
              icon={<WarningIcon fontSize="inherit" style={{ color: "yellow" }} />}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => setAlert({ ...alert, open: false })}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{
                mb: 2,
                backgroundColor: "#dc2626",
                border: "none",
                color: "white",
                "& .MuiAlert-icon": { color: "yellow" },
                boxShadow: "0 18px 40px rgba(220,38,38,0.25)",
                borderRadius: 1,
              }}
            >
              {alert.message || "Por favor, verifique seu email e senha..."}
            </Alert>
          </Collapse>
        </Box>
      </Modal>

      {/* Alerta verde (reset) */}
      <Box
        sx={{
          position: "fixed",
          top: 10,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2000,
          width: "min(520px, 92vw)",
        }}
      >
        {alertReset.open && (
          <Alert
            severity={alertReset.severity}
            onClose={() => setAlertReset({ ...alertReset, open: false })}
            sx={{ borderRadius: 1, boxShadow: "0 18px 40px rgba(0,0,0,0.12)" }}
          >
            {alertReset.message}
          </Alert>
        )}
      </Box>

      {/* Fundo + Card central */}
      <Box
        sx={{
          width: "100vw",
          minHeight: "100vh",
          backgroundColor: "#EFEFEF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Box
          sx={{
            width: "min(100%, 980px)",
            maxWidth: CARD_W,
            backgroundColor: "#fff",
            boxShadow: "0 18px 45px rgba(0,0,0,0.12)",
            borderRadius: 5,
            position: "relative",
            display: "flex",
            overflow: "hidden",
          }}
        >
          

          {/* Painel azul (esquerda) */}
          <Box
            sx={{
              width: LEFT_W,
              minHeight: 380,
              background:
                "linear-gradient(180deg, #4B0F8A)",
              position: "relative",
              display: { xs: "none", sm: "flex" },
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              px: 3,
              textAlign: "center",
            }}
          >

            <Box sx={{ position: "relative", zIndex: 2 }}>
             
              <Typography
              sx={{
                color: "rgba(255,255,255,0.75)",
                mt: 1,
                fontSize: 15,
                fontWeight: 700, // 👈 bold
              }}
            >
              INOVAÇÃO E PROGRESSO <br /> PARA TODOS
            </Typography>


              <Box sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
                <img
                  src={logo}
                  alt="Logo"
                  style={{ height: 150, width: "auto", filter: "brightness(0) invert(1)" }}
                />
              </Box>
            </Box>
          </Box>

          {/* Form (direita) */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: { xs: 3, sm: 6 },
              py: 5,
            }}
          >
            <Box sx={{ width: "100%", maxWidth: 360 }}>
              <Box component="form" onSubmit={handleLogin} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <Box>
                  <Typography sx={{ fontSize: 10, color: "#9CA3AF", fontWeight: 700 }}>
                    USUÁRIO
                  </Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="DIGITE SEU EMAIL"
                    sx={inputSx}
                  />
                  <Divider sx={{ mt: 0.5 }} />
                </Box>

                <Box>
                  <Typography sx={{ fontSize: 10, color: "#9CA3AF", fontWeight: 700 }}>
                    SENHA
                  </Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPass ? "text" : "password"}
                    placeholder="DIGITE A SENHA"
                    sx={inputSx}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPass((s) => !s)} edge="end" size="small">
                            {showPass ? (
                              <VisibilityOutlinedIcon sx={{ color: "#9CA3AF" }} />
                            ) : (
                              <VisibilityOffOutlinedIcon sx={{ color: "#9CA3AF" }} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Divider sx={{ mt: 0.5 }} />
                </Box>

                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  sx={{
                    height: 38,
                    borderRadius: 5,
                    backgroundColor: "#4B0F8A",
                    fontWeight: 700,
                    boxShadow: "none",
                    "&:hover": { backgroundColor: "#6013b3", boxShadow: "none" },
                  }}
                >
                  ENTRAR
                </Button>

                <Button
                  variant="text"
                  onClick={() => setOpen(true)}
                  sx={{
                    textTransform: "none",
                    color: "#9CA3AF",
                    fontWeight: 600,
                    alignSelf: "center",
                    "&:hover": { backgroundColor: "transparent" },
                  }}
                >
                  Esqueci a senha
                </Button>

                <Button
                  variant="text"
                  onClick={() => navigate("/")}
                  sx={{
                    textTransform: "none",
                    color: "#9CA3AF",
                    fontWeight: 600,
                    alignSelf: "center",
                    "&:hover": { backgroundColor: "transparent" },
                  }}
                >
                  CANCELAR
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Login;
