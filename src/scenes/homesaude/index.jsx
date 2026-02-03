import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  Divider,
  Grid,
  Chip,
  List,
  ListItemButton,
  ListItemText,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";

import { useNavigate } from "react-router-dom";

import { useLocation } from "react-router-dom";

import capaSaude from "../../assets/images/medico.png";


const Homesaude = () => {
  const theme = useTheme();
  const [userRole, setUserRole] = useState("");

  const [expandedLeft, setExpandedLeft] = useState(false);
  const [expandedRight, setExpandedRight] = useState(false);

  const [selectedSetor, setSelectedSetor] = useState(null);

  const [selectedAgenda, setSelectedAgenda] = useState(null);

  const [selectedItem, setSelectedItem] = useState(null);
// selectedItem = { id, label, to, side: "left" | "right" }



  const { state } = useLocation();
// state.setorId
// state.setorLabel

  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role) setUserRole(role);
  }, []);

  const setoresExames = useMemo(
    () => [
      { id: "exames-consultas", label: "Exames e consultas", to: "/relatorios" },
      { id: "laboratorio", label: "Laboratório" },
      { id: "telemedicina", label: "Telemedicina" },
      { id: "triagem", label: "Triagem" },
      { id: "especialidades", label: "Especialidades" },
      { id: "odontologia", label: "Odontologia" },
      { id: "farmacia", label: "Farmácia" },
    ],
    []
  );

  const setoresAgenda = useMemo(
    () => [
      { id: "agenda-medicos", label: "Calendário de atendimentos" },
      { id: "agenda-vacinas", label: "Calendário de vacinas" },
      { id: "plantao", label: "Escala de plantão" },
      { id: "procedimentos", label: "Procedimentos agendados" },
      { id: "retornos", label: "Retornos" },
      { id: "encaixes", label: "Encaixes" },
      { id: "visitas", label: "Visitas domiciliares" },
    ],
    []
  );

  // ✅ quando ABERTO: trava altura pra não crescer a página
  const OPEN_PANEL_H = 320;

  // ✅ view de ~5 itens com scroll
  const LIST_VIEW_H = 240;

  const CardShell = {
    width: "100%",
    borderRadius: 4,
    boxShadow: "0px 10px 30px rgba(0,0,0,.10)",
    bgcolor: theme.palette.background.paper,
    overflow: "hidden",
    border: `1px solid ${theme.palette.divider}`,
  };

  const RightHeader = {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    px: { xs: 2, md: 3 },
    pt: { xs: 2, md: 3 },
    pb: 1.5,
  };

  const AccordionBase = {
    borderRadius: 2,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: "none",
    "&:before": { display: "none" },
    overflow: "hidden",
    bgcolor: theme.palette.background.paper,
  };

  const AccordionSummaryBase = {
    minHeight: 52,
    px: 2,
    "& .MuiAccordionSummary-content": {
      my: 1,
      alignItems: "center",
      gap: 1,
    },
  };

  const ListItemBase = {
    borderRadius: 1.5,
    mb: 0.5,
    "&:hover": { bgcolor: theme.palette.action.hover },
  };

  const ScrollBox = {
    maxHeight: LIST_VIEW_H,
    overflowY: "auto",
    pr: 0.5,
    "&::-webkit-scrollbar": { width: 8 },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.palette.action.disabled,
      borderRadius: 8,
    },
    "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
  };

  // ✅ wrapper que só ganha altura quando expandido
  const panelWrapper = (expanded) => ({
    height: expanded ? OPEN_PANEL_H : "auto",
    transition: "height .18s ease",
  });

  return (
    <Box sx={{ px: { xs: 1.5, md: 5 }, py: { xs: 2, md: 3 } }}>
  <Box sx={CardShell}>
    {/* ✅ trava altura no desktop para não “empurrar” a página */}
    <Grid container sx={{ height: { xs: "auto", md: 430 } }}>
      {/* ESQUERDA */}
      <Grid item xs={12} md={5}>
        <Box
          sx={{
            height: { xs: 240, md: "100%" },
            width: "100%",
            backgroundImage: `url(${capaSaude})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </Grid>

      {/* DIREITA */}
      <Grid item xs={12} md={7}>
        {/* ✅ coluna direita flex para manter layout estável */}
        <Box
          sx={{
            height: { xs: "auto", md: "100%" },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={RightHeader}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
                bgcolor: theme.palette.action.hover,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <AddBoxOutlinedIcon
                sx={{ fontSize: 18, color: theme.palette.text.secondary }}
              />
            </Box>

            <Typography
              sx={{
                fontWeight: 600,
                fontSize: { xs: 18, md: 20 },
                color: "#4B0F8A",
              }}
            >
              Você está na área da saúde
            </Typography>

            <Box sx={{ flex: 1 }} />
          </Box>

          <Divider />

          {/* ✅ área do conteúdo não cresce: rola por dentro */}
          <Box
            sx={{
              p: { xs: 2, md: 3 },
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            <Grid container spacing={2} sx={{ height: "100%" }}>
              {/* ESQUERDO */}
              <Grid item xs={12} md={6} sx={{ height: { xs: "auto", md: "100%" } }}>
                <Box
                  sx={panelWrapper(expandedLeft)}
                  onMouseLeave={() => setExpandedLeft(false)} // ✅ fecha ao sair o mouse
                >
                  <Accordion
                    expanded={expandedLeft}
                    onChange={() => setExpandedLeft((v) => !v)}
                    sx={AccordionBase}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={AccordionSummaryBase}
                    >
                      <Typography sx={{ fontWeight: 700, color: "#747474" }}>
                        {selectedItem?.side === "left"
                          ? selectedItem.label
                          : "Solicitações por setores da saúde"}
                      </Typography>


                    </AccordionSummary>

                    <Box sx={{ px: 2, pb: 2, pt: 0 }}>
                      <Box sx={ScrollBox}>
                        <List dense disablePadding>
                          {setoresExames.map((item, index) => (
                            <Box key={item.id}>
                              <ListItemButton
                                  selected={selectedItem?.id === item.id && selectedItem?.side === "left"}
                                  sx={{
                                    ...ListItemBase,
                                    bgcolor:
                                      selectedItem?.id === item.id && selectedItem?.side === "left"
                                        ? theme.palette.action.selected
                                        : "transparent",
                                  }}
                                  onClick={() => setSelectedItem({ ...item, side: "left" })}
                                >
                                  <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{ fontWeight: 600, fontSize: 14, color: "#979797" }}
                                  />
                                </ListItemButton>

                              {/* ✅ linha entre itens */}
                              {index < setoresExames.length - 1 && (
                                <Divider sx={{ ml: 2, mr: 2 }} />
                              )}
                            </Box>
                          ))}
                        </List>
                      </Box>
                    </Box>
                  </Accordion>
                </Box>
              </Grid>

              {/* DIREITO */}
              <Grid item xs={12} md={6} sx={{ height: { xs: "auto", md: "100%" } }}>
                <Box
                  sx={panelWrapper(expandedRight)}
                  onMouseLeave={() => setExpandedRight(false)} // ✅ fecha ao sair o mouse
                >
                  <Accordion
                    expanded={expandedRight}
                    onChange={() => setExpandedRight((v) => !v)}
                    sx={AccordionBase}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={AccordionSummaryBase}
                    >
                      <Typography sx={{ fontWeight: 700, color: "#747474" }}>
                        {selectedItem?.side === "right"
                          ? selectedItem.label
                          : "Criar tarefas por setores da saúde"}
                      </Typography>

                    </AccordionSummary>


                    <Box sx={{ px: 2, pb: 2, pt: 0 }}>
                      <Box sx={ScrollBox}>
                        <List dense disablePadding>
                          {setoresAgenda.map((item, index) => (
                            <Box key={item.id}>
                              <ListItemButton
                                selected={selectedItem?.id === item.id && selectedItem?.side === "right"}
                                sx={{
                                  ...ListItemBase,
                                  bgcolor:
                                    selectedItem?.id === item.id && selectedItem?.side === "right"
                                      ? theme.palette.action.selected
                                      : "transparent",
                                }}
                                onClick={() => setSelectedItem({ ...item, side: "right" })}
                              >
                                <ListItemText
                                  primary={item.label}
                                  primaryTypographyProps={{ fontWeight: 600, fontSize: 14, color: "#979797" }}
                                />
                              </ListItemButton>

                              {/* ✅ linha entre itens */}
                              {index < setoresAgenda.length - 1 && (
                                <Divider sx={{ ml: 2, mr: 2 }} />
                              )}
                            </Box>
                          ))}
                        </List>
                      </Box>
                    </Box>
                  </Accordion>
                </Box>
              </Grid>
            </Grid>
          </Box>

         
        </Box>
      </Grid>
    </Grid>
    
  </Box>
   {/* ✅ botão fixo no “rodapé” da coluna direita (não sobe/desce com accordion) */}
          <Box
            sx={{
              px: { xs: 2, md: 3 },
              pb: { xs: 2, md: 3 },
              display: "flex",
              justifyContent: "flex-end",
              mt: 1,
            }}
          >
            <Box
  component="button"
  disabled={!selectedItem}
  onClick={() => {
    if (!selectedItem) return;
    navigate(selectedItem.to, {
      state: {
        setorId: selectedItem.id,
        setorLabel: selectedItem.label,
        origem: selectedItem.side, // "left" ou "right"
      },
    });
  }}
  style={{
    border: "none",
    cursor: selectedItem ? "pointer" : "not-allowed",
    padding: "10px 18px",
    borderRadius: 10,
    fontWeight: 700,
    backgroundColor: "#4B0F8A",
    opacity: selectedItem ? 1 : 0.6,
  }}
>
  <span style={{ color: "#fff" }}>ENTRAR</span>
</Box>

          </Box>
</Box>


  );
};

export default Homesaude;
