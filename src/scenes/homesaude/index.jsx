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
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { authArago, dbArago } from "/src/data/firebase-config.js";


import { useNavigate } from "react-router-dom";

import { useLocation } from "react-router-dom";

import capaSaude from "../../assets/images/medico.png";


//============================================================================================


function normalizeStatus(v) {
  const s = String(v || "analise").toLowerCase();
  if (s.includes("anal")) return "analise";
  if (s.includes("pend")) return "pendente";
  if (s.includes("recus")) return "recusado";
  if (s.includes("liber")) return "liberado";
  if (s.includes("concl")) return "concluido";
  return "analise";
}

function statusLabelPt(k) {
  const map = {
    analise: "ANÁLISE",
    pendente: "PENDENTE",
    recusado: "RECUSADO",
    liberado: "LIBERADO",
    concluido: "CONCLUÍDO",
  };
  return map[k] || "ANÁLISE";
}

function statusColor(k) {
  const map = {
    analise: "#f59e0b",
    pendente: "#ef4444",
    recusado: "#b91c1c",
    liberado: "#22c55e",
    concluido: "#6b7280",
  };
  return map[k] || "#f59e0b";
}


//============================================================================================


const Homesaude = () => {
  const theme = useTheme();
  const [userRole, setUserRole] = useState("");

  const [expandedLeft, setExpandedLeft] = useState(false);
  const [expandedRight, setExpandedRight] = useState(false);

  const [selectedSetor, setSelectedSetor] = useState(null);

  const [selectedAgenda, setSelectedAgenda] = useState(null);

  const [selectedItem, setSelectedItem] = useState(null);
// selectedItem = { id, label, to, side: "left" | "right" }

const [requestsSaude, setRequestsSaude] = useState([]);

  const { state } = useLocation();
// state.setorId
// state.setorLabel

  const navigate = useNavigate();



  const resumo = useMemo(() => {
  const base = requestsSaude || [];
  const total = base.length;

  const counts = base.reduce(
    (acc, r) => {
      const st = normalizeStatus(r?.status || r?.parecer);
      acc[st] = (acc[st] || 0) + 1;
      return acc;
    },
    { analise: 0, pendente: 0, recusado: 0, liberado: 0, concluido: 0 }
  );

  const pct = (n) => (total ? Math.round((n / total) * 100) : 0);

  return {
    total,
    ...counts,
    pAnalise: pct(counts.analise),
    pPendente: pct(counts.pendente),
    pRecusado: pct(counts.recusado),
    pLiberado: pct(counts.liberado),
    pConcluido: pct(counts.concluido),
  };
}, [requestsSaude]);


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



  useEffect(() => {
  let stop = null;

  const unsubAuth = onAuthStateChanged(authArago, (u) => {
    if (stop) stop();

    // se quiser mostrar mesmo deslogado, pode remover esse if
    if (!u?.email) {
      setRequestsSaude([]);
      return;
    }

    // ✅ geral (todas solicitações de saúde)
    // se quiser por usuário, eu te mando a versão filtrando por userEmail
    const q = query(collection(dbArago, "requests"), where("areaId", "==", "saude"));

    stop = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setRequestsSaude(list);
    });
  });

  return () => {
    if (stop) stop();
    unsubAuth();
  };
}, []);



const cardBase = {
  backgroundColor: "#fff",
  borderRadius: "14px",
  border: "1px solid rgba(0,0,0,0.06)",
  boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
};


  return (
    <Box sx={{ px: { xs: 1.5, md: 5 }, py: { xs: 2, md: 3 } }}>



      {/* --- RELATÓRIO CONSOLIDADO (mockup) --- */}
    <Box sx={{ mt: 0, mb: 2 }}>
      <Typography sx={{ fontWeight: 900, color: "#2F2B3D", mb: 1 }}>
        CONSOLIDADO SETORES DA SAÚDE
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          width: "100%",
          pb: 1,

          overflowX: "auto",     // ✅ se não couber, rola
          flexWrap: "nowrap",    // ✅ nunca quebra linha
          WebkitOverflowScrolling: "touch",
        }}
      >
        {[
          { key: "analise", label: "ANÁLISE", value: resumo.analise, pct: resumo.pAnalise },
          { key: "pendente", label: "PENDENTE", value: resumo.pendente, pct: resumo.pPendente },
          { key: "recusado", label: "RECUSADO", value: resumo.recusado, pct: resumo.pRecusado },
          { key: "liberado", label: "LIBERADO", value: resumo.liberado, pct: resumo.pLiberado },
          { key: "concluido", label: "CONCLUÍDO", value: resumo.concluido, pct: resumo.pConcluido },
        ].map((c) => {
          const color = statusColor(c.key);

          return (
            <Box
              key={c.key}
              sx={{
                ...cardBase,
                p: 2,
                borderRadius: "16px",

                flex: "1 1 0",  // ✅ divide igualmente e mantém 1 linha
                minWidth: 240,  // ✅ tamanho mínimo (ajuste se quiser)
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: 12, fontWeight: 900, color: "#6F6B7D" }}>
                  {c.label}
                </Typography>

                {/* bolinha mais grossa (anel) */}
                <Box
                  sx={{
                    width: 55, // externo maior
                    height: 55,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    background: `conic-gradient(${color} ${c.pct * 3.6}deg, rgba(0,0,0,0.08) 0deg)`,
                  }}
                >
                  <Box
                    sx={{
                      width: 28, // interno menor => anel mais grosso
                      height: 28,
                      borderRadius: "50%",
                      bgcolor: "#fff",
                      display: "grid",
                      placeItems: "center",
                      fontSize: 11,
                      fontWeight: 900,
                      color: "#6F6B7D",
                    }}
                  >
                    {c.pct}%
                  </Box>
                </Box>
              </Box>

              <Typography sx={{ mt: 1, fontSize: 26, fontWeight: 900, color: "#2F2B3D" }}>
                {c.value}
              </Typography>

              <Typography sx={{ mt: 0.5, fontSize: 12, color: "#6F6B7D" }}>
                de {resumo.total} solicitações
              </Typography>

              <Box sx={{ mt: 1.2 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: 12, color: "#6F6B7D" }}>Progresso</Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 900, color }}>
                    {c.pct}%
                  </Typography>
                </Box>

                <Box
                  sx={{
                    mt: 0.8,
                    height: 8,
                    borderRadius: 999,
                    bgcolor: "rgba(0,0,0,0.08)",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      width: `${c.pct}%`,
                      bgcolor: color,
                    }}
                  />
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>





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
                width: 30,
                height: 30,
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
              }}
            >
              <LocalHospitalIcon
                sx={{ fontSize: 30, color: "#4b0f8a" }}
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
