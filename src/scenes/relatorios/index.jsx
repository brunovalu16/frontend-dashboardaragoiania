import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Menu,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Checkbox,
} from "@mui/material";

import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import LinearProgress from "@mui/material/LinearProgress";

import { Header } from "../../components";
import { onAuthStateChanged } from "firebase/auth";

import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { authArago, dbArago } from "/src/data/firebase-config.js";

/* ----------------------------- helpers ----------------------------- */
function hexToRgba(hex, alpha = 0.15) {
  try {
    const h = String(hex || "").replace("#", "");
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } catch {
    return `rgba(107,114,128,${alpha})`;
  }
}

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

function formatDateTimeBR(ts) {
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

function getProgressPercent(req) {
  const v =
    req?.progressPercent ??
    req?.progress?.percent ??
    req?.progress?.value ??
    req?.progress ??
    req?.barraProgresso?.percent ??
    req?.barraProgresso ??
    null;

  const n = Number(v);
  if (Number.isFinite(n)) return Math.max(0, Math.min(100, n));

  const current = Number(req?.currentStep ?? req?.step ?? 0);
  const total = Number(req?.totalSteps ?? req?.stepsTotal ?? 0);
  if (Number.isFinite(current) && Number.isFinite(total) && total > 0) {
    return Math.max(0, Math.min(100, Math.round((current / total) * 100)));
  }

  return 0;
}

/* ----------------------------- component ----------------------------- */
const Relatorios = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  // menu actions (⋮)
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  function handleOpenMenu(event, row) {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  }

  function handleCloseMenu() {
    setAnchorEl(null);
    setSelectedRow(null);
  }

  // ✅ ASSINATURA: filtra por userEmail + areaId
  useEffect(() => {
    const indexOkRef = { current: true };
    let stopSnapshot = null;

    const unsubAuth = onAuthStateChanged(authArago, (currentUser) => {
      if (stopSnapshot) {
        stopSnapshot();
        stopSnapshot = null;
      }

      if (!currentUser) {
        setRequests([]);
        setLoadingRequests(false);
        return;
      }

      const email = String(currentUser.email || "").toLowerCase();
      if (!email) {
        setRequests([]);
        setLoadingRequests(false);
        return;
      }

      setLoadingRequests(true);

      const base = [
        collection(dbArago, "requests"),
        where("areaId", "==", "saude"),
        where("userEmail", "==", email),
      ];

      const qWithOrder = query(...base, orderBy("createdAt", "desc"));
      const qNoOrder = query(...base);

      const attach = (q, sortClient = false) =>
        onSnapshot(
          q,
          (snap) => {
            let list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

            if (sortClient) {
              list = list.sort((a, b) => {
                const ta = a?.createdAt?.toMillis?.() ?? 0;
                const tb = b?.createdAt?.toMillis?.() ?? 0;
                return tb - ta;
              });
            }

            setRequests(list);
            setLoadingRequests(false);
          },
          (err) => {
            const msg = String(err?.message || "");
            const needIndex = msg.toLowerCase().includes("requires an index");

            if (needIndex) {
              indexOkRef.current = false;
              if (stopSnapshot) stopSnapshot();
              stopSnapshot = attach(qNoOrder, true);
              return;
            }

            console.error("❌ Relatorios requests onSnapshot:", err);
            setRequests([]);
            setLoadingRequests(false);
          }
        );

      stopSnapshot = indexOkRef.current ? attach(qWithOrder, false) : attach(qNoOrder, true);
    });

    return () => {
      if (stopSnapshot) stopSnapshot();
      unsubAuth();
    };
  }, []);

  // -----------------------------
  // UI state (filtros)
  // -----------------------------
  const [statusFilter, setStatusFilter] = useState("Status");
  const [categoryFilter, setCategoryFilter] = useState("Category");
  const [stockFilter, setStockFilter] = useState("Stock");
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(7);
  const [page, setPage] = useState(1);

  // ✅ rows com status real: analise/pendente/recusado/liberado/concluido
  const rows = useMemo(() => {
    return (requests || []).map((req) => {
      const progress = getProgressPercent(req);
      const statusKey = normalizeStatus(req?.status || req?.parecer);

      const saudeData = req?.saudeData || req?.data || null;

      const titulo = req?.requestTitle || "SOLICITAÇÃO SAÚDE - EXAMES E CONSULTAS";

      const especialidade =
        saudeData?.especialidadeAgendada || saudeData?.especialidadeSelecionada || "";

      const clinica = saudeData?.clinicaSelecionada || "";

      const desc =
        [
          especialidade ? `Especialidade: ${especialidade}` : null,
          clinica ? `Clínica: ${clinica}` : null,
          (req?.descricao || "").trim() ? String(req.descricao).split("\n")[0] : null,
        ]
          .filter(Boolean)
          .join(" • ") || "—";

      return {
        id: req.id,
        product: titulo,
        desc,
        category: "Saúde",
        stock: progress >= 100,
        sku: req.id.slice(0, 6).toUpperCase(),
        userEmail: req?.userEmail || "—",
        price: formatDateTimeBR(req?.createdAt || req?.createdAtMs),
        qty: `${progress}%`,
        status: statusKey, // ✅ status real
        __progress: progress,
        __req: req,
      };
    });
  }, [requests]);

  const categories = useMemo(
    () => ["Category", ...Array.from(new Set(rows.map((r) => r.category)))],
    [rows]
  );

  // ✅ ordem/nomes conforme print
  const statuses = useMemo(
    () => ["Status", "analise", "pendente", "recusado", "liberado", "concluido"],
    []
  );

  const stockOptions = useMemo(() => ["Stock", "In Stock", "Out of Stock"], []);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();

    return rows.filter((r) => {
      const matchSearch =
        !s ||
        r.product.toLowerCase().includes(s) ||
        r.desc.toLowerCase().includes(s) ||
        r.sku.toLowerCase().includes(s);
        String(r.userEmail || "").toLowerCase().includes(s);

      const matchStatus = statusFilter === "Status" ? true : r.status === statusFilter;

      const matchCategory =
        categoryFilter === "Category" ? true : r.category === categoryFilter;

      const matchStock =
        stockFilter === "Stock"
          ? true
          : stockFilter === "In Stock"
          ? r.stock === true
          : r.stock === false;

      return matchSearch && matchStatus && matchCategory && matchStock;
    });
  }, [rows, search, statusFilter, categoryFilter, stockFilter]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filtered.length / pageSize)),
    [filtered.length, pageSize]
  );

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // ✅ pill com cores do print
  const statusPill = (statusKey) => {
    const c = statusColor(statusKey);
    return (
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          px: 1.2,
          py: 0.45,
          borderRadius: 1,
          fontSize: 11,
          fontWeight: 900,
          backgroundColor: hexToRgba(c, 0.15),
          color: c,
          border: `1px solid ${hexToRgba(c, 0.28)}`,
          width: "fit-content",
          textTransform: "uppercase",
        }}
      >
        {statusLabelPt(statusKey)}
      </Box>
    );
  };

  return (
    <>
      <Box sx={{ marginLeft: "40px" }}>
        <Header title={<Box display="flex" alignItems="center" gap={1} />} />
      </Box>

      <Box
        sx={{
          marginLeft: "40px",
          marginTop: "-15px",
          width: "calc(100% - 80px)",
          minHeight: "70vh",
          padding: "18px",
          borderRadius: "18px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
          bgcolor: "#f6f6f9",
          overflowX: "hidden",
          position: "relative",
        }}
      >
        <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
          <PlayCircleFilledIcon sx={{ color: "#5f53e5", fontSize: 25 }} />
          <Typography color="#858585">RELATÓRIOS</Typography>
        </Box>

        {isModalOpen && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 420,
              maxWidth: "92vw",
              bgcolor: "#fff",
              borderRadius: 2,
              boxShadow: "0 18px 45px rgba(0,0,0,0.18)",
              p: 4,
              textAlign: "center",
              zIndex: 999,
              color: "#737373",
            }}
          >
            <ErrorOutlineIcon sx={{ color: "#dc2626", fontSize: 42 }} />
            <Typography variant="h6" sx={{ fontWeight: 900, mt: 1 }}>
              Nenhum relatório no momento.
            </Typography>
            <Typography sx={{ mt: 1.4 }}>
              Entre em contato com o administrador do sistema para mais informações.
            </Typography>
          </Box>
        )}

        {/* FILTER Card */}
        <Box sx={{ ...cardBase, p: 2.2, mb: 2 }}>
          <Typography sx={{ fontWeight: 900, color: "#2F2B3D", mb: 1.6 }}>
            Filter
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 2,
            }}
          >
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                {statuses.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s === "Status" ? "Status" : statusLabelPt(s)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPage(1);
                }}
              >
                {categories.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Stock</InputLabel>
              <Select
                value={stockFilter}
                label="Stock"
                onChange={(e) => {
                  setStockFilter(e.target.value);
                  setPage(1);
                }}
              >
                {stockOptions.map((o) => (
                  <MenuItem key={o} value={o}>
                    {o}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* toolbar */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1.5,
              mt: 2.2,
              pt: 2,
              borderTop: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <TextField
              size="small"
              placeholder="Search Product"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              sx={{ width: 240 }}
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              <FormControl size="small" sx={{ width: 90 }}>
                <Select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  {[7, 10, 25, 50].map((n) => (
                    <MenuItem key={n} value={n}>
                      {n}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                startIcon={<FileUploadOutlinedIcon />}
                sx={{
                  height: 36,
                  borderRadius: 1.5,
                  textTransform: "none",
                  borderColor: "rgba(0,0,0,0.14)",
                  color: "#6F6B7D",
                }}
                onClick={() => console.log("Export (mock)")}
              >
                Export
              </Button>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  height: 36,
                  borderRadius: 1.5,
                  textTransform: "none",
                  backgroundColor: "#7367F0",
                  boxShadow: "0 10px 18px rgba(115,103,240,0.25)",
                  "&:hover": {
                    backgroundColor: "#5f53e5",
                    boxShadow: "0 10px 18px rgba(115,103,240,0.25)",
                  },
                }}
                onClick={() => console.log("Add Product (mock)")}
              >
                Add Product
              </Button>
            </Box>
          </Box>

          {/* table */}
          <Box sx={{ mt: 2, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
            {/* header */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns:
                  "40px 3fr 1.2fr 0.7fr 0.7fr 0.8fr 0.7fr 0.9fr 0.8fr",
                gap: 1.5,
                px: 1.5,
                py: 1.2,
                fontSize: 11,
                fontWeight: 900,
                color: "#6F6B7D",
                alignItems: "center",
              }}
            >
              <Checkbox size="small" />
              <Box>SOLICITAÇÃO</Box>
              <Box>AREA</Box>
              <Box>PROGRESSO</Box>
              <Box>USUÁRIO</Box>
              <Box>DATA</Box>
              <Box>STATUS</Box>
              <Box>AÇÃO</Box>
            </Box>

            {/* loading / empty */}
            {loadingRequests ? (
              <Box sx={{ px: 1.5, py: 2, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                <Typography sx={{ fontSize: 13, color: "#6F6B7D" }}>
                  Carregando solicitações...
                </Typography>
              </Box>
            ) : pageRows.length === 0 ? (
              <Box sx={{ px: 1.5, py: 2, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                <Typography sx={{ fontSize: 13, color: "#6F6B7D" }}>
                  Nenhuma solicitação encontrada.
                </Typography>
              </Box>
            ) : (
              pageRows.map((r) => (
                <Box
                  key={r.id}
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "40px 3fr 1.2fr 0.7fr 0.7fr 0.8fr 0.7fr 0.9fr 0.8fr",
                    gap: 1.5,
                    px: 1.5,
                    py: 1.3,
                    alignItems: "center",
                    borderTop: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <Checkbox size="small" />

                  <Box sx={{ display: "flex", gap: 1.2, alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1.2,
                        bgcolor: "rgba(0,0,0,0.05)",
                        border: "1px solid rgba(0,0,0,0.06)",
                      }}
                    />
                    <Box>
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 900,
                          color: "#2F2B3D",
                          lineHeight: 1.2,
                        }}
                      >
                        {r.product}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: "#6F6B7D", lineHeight: 1.2 }}>
                        {r.desc}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography sx={{ fontSize: 13, color: "#6F6B7D" }}>
                    {r.category}
                  </Typography>

                  

                  <Typography sx={{ fontSize: 13, color: "#6F6B7D" }}>
                    {r.userEmail}
                  </Typography>

                  

                  {statusPill(r.status)}

                  {/* ✅ AÇÃO: lápis + menu ⋮ */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginLeft: 3 }}>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/relatorios/saude/${r.id}`)}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>

                    
                  </Box>
                </Box>
              ))
            )}

            {/* footer pagination */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 1.5,
                py: 1.2,
                borderTop: "1px solid rgba(0,0,0,0.06)",
                color: "#6F6B7D",
                fontSize: 12,
              }}
            >
              <Typography sx={{ fontSize: 12, color: "#6F6B7D" }}>
                Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1} to{" "}
                {Math.min(page * pageSize, filtered.length)} of {filtered.length} entries
              </Typography>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  disabled={page <= 1}
                  onClick={() => setPage(1)}
                  sx={pagerBtn}
                >
                  {"<<"}
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  sx={pagerBtn}
                >
                  {"<"}
                </Button>

                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const num = i + 1;
                  return (
                    <Button
                      key={num}
                      variant={page === num ? "contained" : "outlined"}
                      size="small"
                      onClick={() => setPage(num)}
                      sx={page === num ? pagerBtnActive : pagerBtn}
                    >
                      {num}
                    </Button>
                  );
                })}

                <Button
                  variant="outlined"
                  size="small"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  sx={pagerBtn}
                >
                  {">"}
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  disabled={page >= totalPages}
                  onClick={() => setPage(totalPages)}
                  sx={pagerBtn}
                >
                  {">>"}
                </Button>
              </Box>
            </Box>
          </Box>

          
        </Box>
      </Box>
    </>
  );
};

// -------- styles helpers (fora do componente) ----------
const cardBase = {
  backgroundColor: "#fff",
  borderRadius: "14px",
  border: "1px solid rgba(0,0,0,0.06)",
  boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
};

const pagerBtn = {
  minWidth: 34,
  height: 32,
  borderRadius: 1.5,
  textTransform: "none",
  borderColor: "rgba(0,0,0,0.12)",
  color: "#6F6B7D",
};

const pagerBtnActive = {
  ...pagerBtn,
  backgroundColor: "#7367F0",
  color: "#fff",
  borderColor: "#7367F0",
  "&:hover": {
    backgroundColor: "#5f53e5",
    borderColor: "#5f53e5",
  },
};

export default Relatorios;
