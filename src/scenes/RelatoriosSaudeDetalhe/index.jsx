import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Chip,
  Paper,
  Divider,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Radio,
  Stack,
} from "@mui/material";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import FlagIcon from "@mui/icons-material/Flag";
import InfoIcon from "@mui/icons-material/Info";

import { doc, onSnapshot, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { authArago, dbArago } from "/src/data/firebase-config.js";

function formatDateBR(ts) {
  try {
    const d = ts?.toDate ? ts.toDate() : ts ? new Date(ts) : null;
    if (!d || Number.isNaN(d.getTime())) return "—";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
  } catch {
    return "—";
  }
}


//============================================================================================
//função simples que lê req.descricao

function parseDescricaoCampos(descricaoRaw) {
  const raw = String(descricaoRaw || "");
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const map = {};
  for (const line of lines) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();
    if (!value) continue;

    // guarda o primeiro valor encontrado para cada chave
    if (!map[key]) map[key] = value;
  }

  return map;
}


//=============================================================================================

function normalizeParecer(v) {
  const s = String(v || "analise").toLowerCase();
  if (s.includes("anal")) return "analise";
  if (s.includes("pend")) return "pendente";
  if (s.includes("recus")) return "recusado";
  if (s.includes("liber")) return "liberado";
  if (s.includes("concl")) return "concluido";
  return "analise";
}

function labelParecer(k) {
  const map = {
    analise: "ANÁLISE",
    pendente: "PENDENTE",
    recusado: "RECUSADO",
    liberado: "LIBERADO",
    concluido: "CONCLUÍDO",
  };
  return map[k] || "ANÁLISE";
}

function dotColor(k) {
  const map = {
    analise: "#f59e0b",
    pendente: "#ef4444",
    recusado: "#b91c1c",
    liberado: "#22c55e",
    concluido: "#6b7280",
  };
  return map[k] || "#f59e0b";
}

function hexToRgba(hex, alpha = 0.12) {
  try {
    const h = String(hex || "").replace("#", "");
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } catch {
    return `rgba(107,114,128,${alpha})`; // fallback cinza
  }
}



//=============================================================================================

function pickText(v) {
  if (!v) return "";
  if (typeof v === "string") return v.trim();
  if (typeof v === "number") return String(v);
  if (typeof v === "object") {
    return String(
      v?.nome ??
      v?.name ??
      v?.label ??
      v?.value ??
      v?.title ??
      ""
    ).trim();
  }
  return String(v).trim();
}

function formatDateOnlyBR(ts) {
  try {
    const d = ts?.toDate ? ts.toDate() : ts ? new Date(ts) : null;
    if (!d || Number.isNaN(d.getTime())) return "";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  } catch {
    return "";
  }
}
//===============================================================================================

export default function RelatoriosSaudeDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [req, setReq] = useState(null);

  const [authUser, setAuthUser] = useState(null);
  const [userNome, setUserNome] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // UI state (parecer e justificativa)
  const [parecer, setParecer] = useState("analise");
  const [justificativa, setJustificativa] = useState("");

  const [accordionParecerOpen, setAccordionParecerOpen] = useState(true);
  const [accordionLiberacaoOpen, setAccordionLiberacaoOpen] = useState(true);

  const [savingParecer, setSavingParecer] = useState(false);


//
async function handleSalvarParecer() {
  if (!id) return;

  const texto = String(justificativa || "").trim();

  // regra simples: recusado precisa de justificativa
  if (parecer === "recusado" && !texto) {
    alert("Para RECUSADO, informe a justificativa.");
    return;
  }

  try {
    setSavingParecer(true);

   const payload = {
  status: parecer,
  parecer: parecer,
  statusUpdatedAt: serverTimestamp(),
  statusUpdatedBy: userEmail || authUser?.email || null,

  // ✅ NOVO: responsável que salvou/liberou (vai aparecer pro cidadão no app)
  responsavelLiberacao: {
    uid: authUser?.uid || null,
    nome: String(userNome || "").trim() || String(userEmail || "").trim(),
    email: String(userEmail || authUser?.email || "").trim() || null,
    area: "saude",
    savedAtMs: Date.now(),
  },
};

// ✅ grava o texto no campo certo (conforme seu banco)
if (parecer === "analise") payload.notaAnalise = texto;
if (parecer === "pendente") payload.notaPendente = texto;
if (parecer === "recusado") payload.notaRecusado = texto;

// ✅ liberado / concluido: usa justificativa
if (parecer === "liberado" || parecer === "concluido") {
  payload.justificativa = texto;
}

await updateDoc(doc(dbArago, "requests", id), payload);

alert("Parecer salvo com sucesso!");

  } catch (e) {
    console.error(e);
    alert("Erro ao salvar parecer. Veja o console.");
  } finally {
    setSavingParecer(false);
  }
}




  // carrega auth + nome usuário
  useEffect(() => {
    const unsub = onAuthStateChanged(authArago, async (u) => {
      setAuthUser(u || null);
      setUserEmail(String(u?.email || ""));
      // tenta displayName
      const dn = String(u?.displayName || "").trim();
      if (dn) {
        setUserNome(dn);
        return;
      }
      // fallback: buscar em users/{uid}
      try {
        const uid = u?.uid;
        if (!uid) return;
        const snap = await getDoc(doc(dbArago, "users", uid));
        const data = snap.exists() ? snap.data() : null;
        const nome =
          String(data?.nome || data?.name || data?.displayName || "").trim();
        if (nome) setUserNome(nome);
      } catch {
        // silencioso
      }
    });

    return () => unsub();
  }, []);

  // carrega request
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    const ref = doc(dbArago, "requests", id);

    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setReq(null);
          setLoading(false);
          return;
        }
        const data = { id: snap.id, ...snap.data() };
        setReq(data);

       const p = normalizeParecer(data?.status || data?.parecer);
        setParecer(p);

        // ✅ puxa o texto baseado no status atual
        const texto =
          p === "analise" ? data?.notaAnalise :
          p === "pendente" ? data?.notaPendente :
          p === "recusado" ? data?.notaRecusado :
          data?.justificativa;

        setJustificativa(String(texto || ""));


        setLoading(false);
      },
      () => {
        setReq(null);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [id]);

  const saudeData = useMemo(() => req?.saudeData || req?.data || {}, [req]);

  // ✅ CRIA O dmap AQUI (ANTES de resumo e veiculo)
const dmap = useMemo(() => parseDescricaoCampos(req?.descricao), [req?.descricao]);




  // blocos do “Resumo da solicitação” (esquerda)
 const resumo = useMemo(() => {
  const createdAtLabel = formatDateBR(req?.createdAt || req?.createdAtMs);

  // ✅ pega tudo do texto salvo no banco
  const dmap = parseDescricaoCampos(req?.descricao);

  // ✅ esses nomes têm que bater com o que aparece na string
  const especialidadesTxt =
    dmap["especialidade"] ||
    saudeData?.especialidadeAgendada ||
    saudeData?.especialidadeSelecionada ||
    saudeData?.especialidade ||
    "";

  const dataAgendadaLabel = dmap["data"] || createdAtLabel;
  const horarioTxt = dmap["horário"] || dmap["horario"] || "";

  const clinicaTxt =
    dmap["clínica"] ||
    dmap["clinica"] ||
    saudeData?.clinicaSelecionada ||
    saudeData?.clinica ||
    saudeData?.unidade ||
    "";

  const exameTxt =
    dmap["exame"] || saudeData?.exameSelecionado || saudeData?.exame || "";

  const procedimentoTxt =
    dmap["procedimento"] ||
    saudeData?.procedimentoSelecionado ||
    saudeData?.procedimento ||
    "";

  const transporteTxt =
    dmap["transporte"] ||
    saudeData?.transporteVinculado ||
    saudeData?.transporte ||
    saudeData?.transporteData?.veiculoSelecionado ||
    "";

  return {
    createdAtLabel,
    especialidadesTxt,
    dataAgendadaLabel,
    horarioTxt,
    clinicaTxt,
    exameTxt,
    procedimentoTxt,
    transporteTxt,
  };
}, [req, saudeData]);



  // dados do “Veículo selecionado” (meio)
const veiculo = useMemo(() => {
  // primeiro tenta pelo TEXTO da descrição (fonte real)
  const tipoTransporte = dmap["transporte"] || "";
  const veiculoSelecionado = dmap["veículo transporte"] || dmap["veiculo transporte"] || "";
  const motorista = dmap["motorista transporte"] || "";
  const placa = dmap["placa transporte"] || "";
  const horario = dmap["transporte horário"] || dmap["transporte horario"] || "";
  const destino = dmap["destino transporte"] || "";
  const motivo = dmap["motivo transporte"] || "";

  // fallback (caso algum request antigo não tenha tudo no texto)
  const t = saudeData?.transporteData || {};

  const veiculoFinal =
    veiculoSelecionado ||
    t?.veiculoSelecionado ||
    t?.veiculo ||
    saudeData?.veiculoSelecionado ||
    "";

  const motoristaFinal = motorista || t?.motorista || "";
  const placaFinal = placa || t?.placa || "";
  const horarioFinal = horario || t?.horario || t?.hora || "";
  const destinoFinal = destino || t?.destino || "";
  const motivoFinal = motivo || t?.motivo || saudeData?.motivo || "";

  // "tem transporte?" → se tiver pelo menos o tipoTransporte OU veiculoFinal
  const hasTransporte = Boolean(tipoTransporte || veiculoFinal);

  return {
    hasTransporte,
    tipoTransporte,                 // ex: "Veículo pequeno"
    veiculoSelecionado: veiculoFinal, // ex: "Veículo Pequeno 02"
    motorista: motoristaFinal,
    placa: placaFinal,
    horario: horarioFinal,
    destino: destinoFinal,
    motivo: motivoFinal,
    confirmado: hasTransporte, // por enquanto, se existe, mostra como confirmado
  };
}, [dmap, saudeData]);





  const tituloTopo = useMemo(() => {
    // se você tiver um campo de título custom, prioriza
    const base =
      req?.requestTitle ||
      req?.titulo ||
      "SOLICITAÇÃO SAÚDE";
    const n = req?.numero || req?.num || req?.seq;
    // no print aparece “SOLICITAÇÃO SAÚDE - 18”
    return n ? `${base} - ${n}` : `${base} - ${String(id || "").slice(0, 2)}`;
  }, [req, id]);

  if (loading) {
    return (
      <Box sx={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!req) {
    return (
      <Box sx={{ p: 3 }}>
        <Button variant="outlined" onClick={() => navigate("/relatorios")}>
          Voltar
        </Button>
        <Typography sx={{ mt: 2, fontWeight: 900 }}>
          Solicitação não encontrada.
        </Typography>
      </Box>
    );
  }


  // ✅ cores do status (SEM HOOKS pra não dar mismatch)
const statusHex = dotColor(parecer);

const statusChipSx = {
  height: 28,
  borderRadius: 999,
  fontWeight: 900,
  border: `1px solid ${statusHex}`,
  bgcolor: hexToRgba(statusHex, 0.12),
  color:
    parecer === "liberado" ? "#16a34a" :
    parecer === "recusado" ? "#b91c1c" :
    parecer === "pendente" ? "#ef4444" :
    parecer === "analise" ? "#b45309" :
    "#6b7280",
};

const resumoDotSx = { ...miniDot, bgcolor: statusHex };
const statusMiniIconSx = { ...miniIcon, border: `2px solid ${statusHex}` };




  return (
    <Box sx={{ bgcolor: "#EEF1FF", minHeight: "100vh" }}>
      {/* Top bar roxa (igual print) */}
      <Box
        sx={{
          height: 56,
          bgcolor: "#4B0082",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          px: 2,
          gap: 1,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Button
          onClick={() => navigate("/relatorios")}
          sx={{
            minWidth: 36,
            width: 36,
            height: 36,
            borderRadius: 999,
            color: "#fff",
          }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </Button>

        <Typography sx={{ fontWeight: 900, letterSpacing: 0.2 }}>
          {tituloTopo}
        </Typography>
      </Box>

      

      {/* Conteúdo */}
      <Box sx={{ px: { xs: 1.5, md: 2.5 }, py: 2.2 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "360px 1fr 360px" },
            gap: 2,
            alignItems: "start",
          }}
        >
          {/* Coluna esquerda: Resumo */}
          <Box>
            <Paper sx={cardWrap}>
              <Typography sx={sectionTitle}>Resumo da solicitação</Typography>

       
              {/* Status */}
              <Paper sx={rowCard}>
                <Box sx={rowLeft}>
                  <Box sx={statusMiniIconSx} />
                  <Typography sx={rowLabel}>Status</Typography>
                </Box>

                <Chip
                  label={labelParecer(parecer)}
                  variant="outlined"
                  sx={statusChipSx}
                />
              </Paper>


              {/* Especialidades */}
              <Paper sx={rowCard}>
                <Box sx={rowLeft}>
                  <Box sx={resumoDotSx} />
                  <Box>
                    <Typography sx={rowLabelStrong}>Especialidades</Typography>
                    <Typography sx={rowSub}>
                      {resumo.especialidadesTxt || "—"} • {resumo.dataAgendadaLabel || "—"}
                      {resumo.horarioTxt ? ` • ${resumo.horarioTxt}` : ""}
                    </Typography>

                  </Box>
                </Box>

                <Chip
                  label={resumo.especialidadesTxt || "—"}
                  size="small"
                  sx={pillGrey}
                />
              </Paper>

              {/* Clínica */}
              <Paper sx={rowCard}>
                <Box sx={rowLeft}>
                  <Box sx={resumoDotSx} />

                  <Box>
                    <Typography sx={rowLabelStrong}>Clínica</Typography>
                    <Typography sx={rowSub}></Typography>
                  </Box>
                </Box>

                <Chip
                  label={resumo.clinicaTxt || "—"}
                  size="small"
                  sx={pillGrey}
                />
              </Paper>

              {/* Exame */}
              <Paper sx={rowCard}>
                <Box sx={rowLeft}>
                  <Box sx={resumoDotSx} />

                  <Box>
                    <Typography sx={rowLabelStrong}>Exame</Typography>
                    <Typography sx={rowSub}></Typography>
                  </Box>
                </Box>

                <Chip
                  label={resumo.exameTxt || "—"}
                  size="small"
                  sx={pillGrey}
                />
              </Paper>

              {/* Procedimento */}
              <Paper sx={rowCard}>
                <Box sx={rowLeft}>
                  <Box sx={resumoDotSx} />

                  <Box>
                    <Typography sx={rowLabelStrong}>Procedimento</Typography>
                    <Typography sx={rowSub}></Typography>
                  </Box>
                </Box>

                <Chip
                  label={resumo.procedimentoTxt || "—"}
                  size="small"
                  sx={pillGrey}
                />
              </Paper>

              <Divider sx={{ my: 1.6, opacity: 0.35 }} />

             
             
            </Paper>
          </Box>

          {/* Coluna meio: Veículo selecionado + Responsável */}
          <Box>
            <Paper sx={cardWrap}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.2 }}>
                <Typography sx={sectionTitle}>Transporte vinculado</Typography>

                {veiculo.hasTransporte ? (
                  <Chip
                    icon={<CheckCircleIcon sx={{ fontSize: 18 }} />}
                    label="Confirmado"
                    sx={{
                      height: 28,
                      borderRadius: 999,
                      fontWeight: 900,
                      bgcolor: "rgba(34,197,94,0.12)",
                      color: "#16a34a",
                    }}
                  />
                ) : (
                  <Chip
                    label="Sem transporte vinculado"
                    sx={{
                      height: 28,
                      borderRadius: 999,
                      fontWeight: 900,
                      bgcolor: "rgba(107,114,128,0.12)",
                      color: "#6B7280",
                    }}
                  />
                )}

              </Box>

              <Paper
                sx={{
                  p: 1.6,
                  borderRadius: 2,
                  bgcolor: "#ffffff",
                  border: "1px solid rgba(75,0,130,0.20)",
                }}
              >
                {!veiculo.hasTransporte ? (
                  <Typography sx={{ fontWeight: 900, color: "#6B7280" }}>
                    Sem transporte vinculado
                  </Typography>
                ) : (
                  <>
                    <Typography sx={{ fontWeight: 900, color: "#4B0082" }}>
                      {veiculo.veiculoSelecionado || veiculo.tipoTransporte || "—"}
                    </Typography>

                    <Box sx={{ display: "flex", gap: 0.6, mt: 0.6, color: "#6B7280" }}>
                      <DirectionsCarFilledIcon sx={{ fontSize: 18 }} />
                      <PersonIcon sx={{ fontSize: 18 }} />
                    </Box>

                    <Divider sx={{ my: 1.2, opacity: 0.35 }} />

                    <Stack spacing={1}>
                      <InfoLine icon={<PersonIcon sx={infoIcon} />} label="Motorista" value={veiculo.motorista || "—"} />
                      <InfoLine icon={<BadgeIcon sx={infoIcon} />} label="Placa" value={veiculo.placa || "—"} />
                      <InfoLine icon={<AccessTimeFilledIcon sx={infoIcon} />} label="Horário" value={veiculo.horario || "—"} />
                      <InfoLine icon={<FlagIcon sx={infoIcon} />} label="Destino" value={veiculo.destino || "—"} />
                      <InfoLine icon={<InfoIcon sx={infoIcon} />} label="Motivo" value={veiculo.motivo || "—"} />
                    </Stack>
                  </>
                )}

              </Paper>

              <Divider sx={{ my: 1.8, opacity: 0.35 }} />

              

              
              {/* ✅ Accordion final (libera no app do usuário) */}
              <Accordion
                expanded={accordionLiberacaoOpen}
                onChange={() => setAccordionLiberacaoOpen((v) => !v)}
                sx={accordionWrap}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: 900, color: "#111827" }}>
                    Solicitação libera por:
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ fontSize: 12.5, color: "#6B7280", mb: 1 }}>
                    Este bloco é o que “libera” a solicitação no app para o cidadão prosseguir.
                  </Typography>

                  <TextField
                    label="Usuário logado"
                    value={userNome || userEmail || "—"}
                    fullWidth
                    size="small"
                    InputProps={{ readOnly: true }}
                  />

               
                </AccordionDetails>
              </Accordion>
            </Paper>
          </Box>

          {/* Coluna direita: Parecer (accordion) */}
          <Box>
            <Paper sx={cardWrap}>
              <Accordion
                expanded={accordionParecerOpen}
                onChange={() => setAccordionParecerOpen((v) => !v)}
                sx={accordionWrap}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ fontWeight: 900 }}>Parecer</Typography>

                    <Chip
                      label={labelParecer(parecer)}
                      variant="outlined"
                      sx={{
                        height: 26,
                        borderRadius: 999,
                        fontWeight: 900,
                        borderColor: parecer === "liberado" ? "#22c55e" : "rgba(0,0,0,0.15)",
                        color: parecer === "liberado" ? "#16a34a" : "#4b5563",
                        bgcolor: parecer === "liberado" ? "rgba(34,197,94,0.10)" : "transparent",
                      }}
                    />
                  </Box>
                </AccordionSummary>

                <AccordionDetails>
                  <Stack spacing={1.2}>
                    {["analise", "pendente", "recusado", "liberado", "concluido"].map((k) => (
                      <Box
                        key={k}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          px: 1.2,
                          py: 1,
                          borderRadius: 2,
                          bgcolor: "#F3F5FF",
                          border: "1px solid rgba(0,0,0,0.06)",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: 99,
                              bgcolor: dotColor(k),
                            }}
                          />
                          <Typography sx={{ fontWeight: 900, fontSize: 12.5, color: "#111827" }}>
                            {labelParecer(k)}
                          </Typography>
                        </Box>

                        <Radio
                          checked={parecer === k}
                          onChange={() => setParecer(k)}
                          value={k}
                        />
                      </Box>
                    ))}

                    <Typography sx={{ mt: 0.8, fontSize: 12, fontWeight: 900, color: "#6B7280" }}>
                      Justificativa
                    </Typography>

                    <TextField
                      value={justificativa}
                      onChange={(e) => setJustificativa(e.target.value)}
                      placeholder="Digite a justificativa..."
                      fullWidth
                      size="small"
                      multiline
                      minRows={3}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: "#fff",
                        },
                      }}
                    />

                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      <Button
                        variant="contained"
                        disabled={savingParecer}
                        sx={{
                          bgcolor: "#4B0082",
                          borderRadius: 2,
                          fontWeight: 900,
                          "&:hover": { bgcolor: "#3a0066" },
                          opacity: savingParecer ? 0.7 : 1,
                        }}
                        onClick={handleSalvarParecer}
                      >
                        {savingParecer ? "Salvando..." : "Salvar"}
                      </Button>
                    </Box>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// ---------- subcomponent ----------
function InfoLine({ icon, label, value }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {icon}
      <Typography sx={{ fontSize: 12.5, color: "#111827" }}>
        <b>{label}:</b> {String(value || "—")}
      </Typography>
    </Box>
  );
}

// ---------- styles ----------
const cardWrap = {
  p: 2,
  borderRadius: 3,
  bgcolor: "#fff",
  border: "1px solid rgba(0,0,0,0.06)",
  boxShadow: "0 10px 22px rgba(0,0,0,0.06)",
};

const sectionTitle = {
  fontSize: 13,
  fontWeight: 900,
  color: "#6B7280",
  mb: 1.2,
};

const rowCard = {
  p: 1.2,
  borderRadius: 2,
  bgcolor: "#F3F5FF",
  border: "1px solid rgba(0,0,0,0.06)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1.2,
  mb: 1.1,
};

const rowLeft = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  minWidth: 0,
};

const miniIcon = {
  width: 12,
  height: 12,
  borderRadius: 999,
  border: "2px solid #22c55e",
};

const miniDot = {
  width: 10,
  height: 10,
  borderRadius: 999,
};

const rowLabel = { fontSize: 12.5, fontWeight: 900, color: "#111827" };
const rowLabelStrong = { fontSize: 12.5, fontWeight: 900, color: "#111827", lineHeight: 1.2 };
const rowSub = { fontSize: 11.5, color: "#6B7280" };

const pillGrey = {
  height: 24,
  borderRadius: 999,
  bgcolor: "rgba(107,114,128,0.16)",
  color: "#374151",
  fontWeight: 900,
};

const accordionWrap = {
  borderRadius: 2,
  boxShadow: "none",
  border: "1px solid rgba(0,0,0,0.06)",
  bgcolor: "#fff",
  "&:before": { display: "none" },
};

const infoIcon = { fontSize: 18, color: "#6B7280" };
