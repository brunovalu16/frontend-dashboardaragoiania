import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Divider,
  Alert,
  Collapse,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Checkbox,
  Switch,
} from "@mui/material";

import { Header } from "../../components";
import { dbFokus360, storageFokus360, authFokus360 } from "../../data/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import AssessmentIcon from "@mui/icons-material/Assessment";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

const Relatorios = () => {
  const navigate = useNavigate();

  const [activeContent, setActiveContent] = useState("Vendas");
  const [userRole, setUserRole] = useState("");
  const [visibleLinks, setVisibleLinks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Regras para os links baseados no perfil
  const links = {
    "01": ["Vendas", "Financeiro", "Logística", "Central de monitoramento", "Trade", "Indústrias"],
    "02": ["Vendas", "Financeiro", "Logística", "Central de monitoramento", "Trade", "Indústrias"],
    "03": ["Vendas", "Financeiro", "Logística", "Central de monitoramento", "Trade", "Indústrias"],
    "04": ["Vendas", "Financeiro", "Logística", "Central de monitoramento", "Trade", "Indústrias"],
    "05": ["Trade", "Indústrias"],
    "06": ["Indústrias"],
    "07": ["Projetos"],
    "08": ["Vendas", "Financeiro", "Logística", "Central de monitoramento", "Trade", "Indústrias"],
    "09": ["Trade", "Indústrias"],
    "10": ["Trade", "Indústrias"],
    "11": ["Trade", "Indústrias"],
    "12": ["Projetos"],
    "13": ["Projetos"],
    "14": ["Projetos"],
    "15": ["Projetos"],
    "16": ["Projetos"],
    "17": ["Projetos"],
    "18": ["Projetos"],
    "19": ["Financeiro", "Indústrias"],
    "20": ["Financeiro", "Indústrias"],
    "21": ["Financeiro", "Indústrias"],
    "22": ["Projetos"],
    "23": ["Projetos"],
    "24": ["Projetos"],
    "25": ["Logística", "Indústrias"],
    "26": ["Logística", "Indústrias"],
    "27": ["Logística", "Indústrias"],
    "28": ["Projetos"],
    "29": ["Projetos"],
    "30": ["Projetos"],
    "31": ["Projetos"],
    "32": ["Projetos"],
    "33": ["Projetos"],
    "34": ["Central de monitoramento", "Indústrias"],
    "35": ["Central de monitoramento", "Indústrias"],
    "36": ["Central de monitoramento", "Indústrias"],
    "37": ["Projetos"],
    "38": ["Projetos"],
    "39": ["Projetos"],
    "40": ["Projetos"],
    "41": ["Projetos"],
    "42": ["Projetos"],
    "43": ["Projetos"],
    "44": ["Projetos"],
    "45": ["Projetos"],
    "46": ["Projetos"],
    "47": ["Projetos"],
    "48": ["Projetos"],
    "49": ["Projetos"],
    "50": ["Projetos"],
    "51": ["Projetos"],
  };

  const rolesQueMostramModal = [
    "07", "12", "13", "14", "15", "16", "17", "18", "22", "23", "24", "28", "29", "30",
    "31", "32", "33", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51",
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authFokus360, async (currentUser) => {
      if (currentUser) {
        try {
          const docRef = doc(dbFokus360, "user", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const roleRaw = docSnap.data().role;
            const role = String(roleRaw).padStart(2, "0");

            setUserRole(role);
            setVisibleLinks(links[role] || []);

            if (rolesQueMostramModal.includes(role)) {
              setIsModalOpen(true);
            }
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // -----------------------------
  // UI state para layout da imagem
  // -----------------------------
  const [statusFilter, setStatusFilter] = useState("Status");
  const [categoryFilter, setCategoryFilter] = useState("Category");
  const [stockFilter, setStockFilter] = useState("Stock");
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(7);
  const [page, setPage] = useState(1);

  // mock rows (substitua por dados reais depois)
  const rows = useMemo(
    () => [
      {
        id: 1,
        product: "Air Jordan",
        desc: "Air Jordan is a line of basketball shoes produced by Nike",
        category: "Shoes",
        stock: false,
        sku: "31063",
        price: "$125",
        qty: 942,
        status: "Inactive",
      },
      {
        id: 2,
        product: "Amazon Fire TV",
        desc: "4K UHD smart TV, stream live TV without cable",
        category: "Electronics",
        stock: false,
        sku: "5829",
        price: "$263.49",
        qty: 587,
        status: "Scheduled",
      },
      {
        id: 3,
        product: "Apple iPad",
        desc: "10.2-inch Retina Display, 64GB",
        category: "Electronics",
        stock: true,
        sku: "35946",
        price: "$248.39",
        qty: 468,
        status: "Publish",
      },
      {
        id: 4,
        product: "Apple Watch Series 7",
        desc: "Starlight Aluminum Case with Starlight Sport Band.",
        category: "Accessories",
        stock: false,
        sku: "46658",
        price: "$799",
        qty: 851,
        status: "Scheduled",
      },
      {
        id: 5,
        product: "BANGE Anti Theft Backpack",
        desc: "Smart Business Laptop Fits 15.6 inch Notebook",
        category: "Accessories",
        stock: true,
        sku: "41867",
        price: "$79.99",
        qty: 519,
        status: "Inactive",
      },
      {
        id: 6,
        product: "Canon EOS Rebel T7",
        desc: "18-55mm Lens | Built-in Wi-Fi | 24.1 MP CMOS Sensor",
        category: "Electronics",
        stock: true,
        sku: "63474",
        price: "$399",
        qty: 810,
        status: "Scheduled",
      },
      {
        id: 7,
        product: "Dohioue Wall Clock",
        desc: "Modern 10 Inch Battery Operated Wall Clocks",
        category: "Household",
        stock: false,
        sku: "29540",
        price: "$16.34",
        qty: 804,
        status: "Publish",
      },
      {
        id: 8,
        product: "Nike Air Max",
        desc: "Comfortable shoes for everyday use",
        category: "Shoes",
        stock: true,
        sku: "88712",
        price: "$149",
        qty: 210,
        status: "Publish",
      },
      {
        id: 9,
        product: "Logitech Mouse",
        desc: "Wireless mouse with ergonomic design",
        category: "Electronics",
        stock: true,
        sku: "99001",
        price: "$29.99",
        qty: 1500,
        status: "Publish",
      },
      {
        id: 10,
        product: "Office Chair",
        desc: "Ergonomic chair with lumbar support",
        category: "Household",
        stock: false,
        sku: "44551",
        price: "$129",
        qty: 83,
        status: "Inactive",
      },
    ],
    []
  );

  const categories = useMemo(() => ["Category", ...Array.from(new Set(rows.map((r) => r.category)))], [rows]);
  const statuses = ["Status", "Publish", "Scheduled", "Inactive"];
  const stockOptions = ["Stock", "In Stock", "Out of Stock"];

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();

    return rows.filter((r) => {
      const matchSearch =
        !s ||
        r.product.toLowerCase().includes(s) ||
        r.desc.toLowerCase().includes(s) ||
        r.sku.toLowerCase().includes(s);

      const matchStatus = statusFilter === "Status" ? true : r.status === statusFilter;

      const matchCategory = categoryFilter === "Category" ? true : r.category === categoryFilter;

      const matchStock =
        stockFilter === "Stock"
          ? true
          : stockFilter === "In Stock"
          ? r.stock === true
          : r.stock === false;

      return matchSearch && matchStatus && matchCategory && matchStock;
    });
  }, [rows, search, statusFilter, categoryFilter, stockFilter]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filtered.length / pageSize)), [filtered.length, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const statusPill = (status) => {
    const map = {
      Publish: { bg: "rgba(34,197,94,0.15)", color: "#16a34a" },
      Scheduled: { bg: "rgba(249,115,22,0.15)", color: "#f97316" },
      Inactive: { bg: "rgba(239,68,68,0.15)", color: "#ef4444" },
    };
    const s = map[status] || { bg: "rgba(107,114,128,0.12)", color: "#6b7280" };
    return (
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          px: 1.2,
          py: 0.4,
          borderRadius: 1,
          fontSize: 11,
          fontWeight: 800,
          backgroundColor: s.bg,
          color: s.color,
          width: "fit-content",
        }}
      >
        {status}
      </Box>
    );
  };

  // ------------------------------------------------------------------
  // RETURN (idêntico ao layout da imagem)
  // ------------------------------------------------------------------
  return (
    <>
      {/* Header mantém */}
      <Box sx={{ marginLeft: "40px" }}>
        <Header
          title={
            <Box display="flex" alignItems="center" gap={1}>
              
            </Box>
          }
        />
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

        {/* Modal por role (mantido) */}
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

        {/* KPI Row (igual imagem) */}
        <Box
          sx={{
            ...cardBase,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
            gap: 0,
            p: 0,
            overflow: "hidden",
            mb: 2,
          }}
        >
          {[
            { title: "In-store Sales", value: "$5,345.43", sub: "5k orders", chip: "+5.7%", chipBg: "rgba(34,197,94,0.15)", chipColor: "#16a34a" },
            { title: "Website Sales", value: "$674,347.12", sub: "21k orders", chip: "+12.4%", chipBg: "rgba(34,197,94,0.15)", chipColor: "#16a34a" },
            { title: "Discount", value: "$14,235.12", sub: "6k orders", chip: "", chipBg: "", chipColor: "" },
            { title: "Affiliate", value: "$8,345.23", sub: "150 orders", chip: "-3.5%", chipBg: "rgba(239,68,68,0.15)", chipColor: "#ef4444" },
          ].map((kpi, idx) => (
            <Box
              key={kpi.title}
              sx={{
                p: 2.2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderRight: { xs: "none", md: idx === 3 ? "none" : "1px solid rgba(0,0,0,0.06)" },
                borderBottom: { xs: "1px solid rgba(0,0,0,0.06)", md: "none" },
              }}
            >
              <Box>
                <Typography sx={{ fontSize: 12, color: "#6F6B7D" }}>{kpi.title}</Typography>
                <Typography sx={{ fontSize: 20, fontWeight: 900, color: "#2F2B3D", mt: 0.4 }}>
                  {kpi.value}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.6 }}>
                  <Typography sx={{ fontSize: 12, color: "#6F6B7D" }}>{kpi.sub}</Typography>
                  {kpi.chip ? (
                    <Box
                      sx={{
                        px: 1,
                        py: 0.3,
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 900,
                        backgroundColor: kpi.chipBg,
                        color: kpi.chipColor,
                      }}
                    >
                      {kpi.chip}
                    </Box>
                  ) : null}
                </Box>
              </Box>

              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: 1.5,
                  display: "grid",
                  placeItems: "center",
                  border: "1px solid rgba(0,0,0,0.06)",
                  color: "#6F6B7D",
                  bgcolor: "#fff",
                }}
              >
                <Box sx={{ width: 14, height: 14, borderRadius: 0.6, bgcolor: "rgba(115,103,240,0.35)" }} />
              </Box>
            </Box>
          ))}
        </Box>

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
              <Select value={statusFilter} label="Status" onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
                {statuses.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select value={categoryFilter} label="Category" onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}>
                {categories.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Stock</InputLabel>
              <Select value={stockFilter} label="Stock" onChange={(e) => { setStockFilter(e.target.value); setPage(1); }}>
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
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              sx={{ width: 240 }}
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              <FormControl size="small" sx={{ width: 90 }}>
                <Select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}>
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
                  "&:hover": { backgroundColor: "#5f53e5", boxShadow: "0 10px 18px rgba(115,103,240,0.25)" },
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
                gridTemplateColumns: "40px 3fr 1.2fr 0.7fr 0.7fr 0.8fr 0.7fr 0.9fr 0.8fr",
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
              <Box>PRODUCT</Box>
              <Box>CATEGORY</Box>
              <Box>STOCK</Box>
              <Box>SKU</Box>
              <Box>PRICE</Box>
              <Box>QTY</Box>
              <Box>STATUS</Box>
              <Box>ACTIONS</Box>
            </Box>

            {/* rows */}
            {pageRows.map((r) => (
              <Box
                key={r.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "40px 3fr 1.2fr 0.7fr 0.7fr 0.8fr 0.7fr 0.9fr 0.8fr",
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
                    <Typography sx={{ fontSize: 13, fontWeight: 900, color: "#2F2B3D", lineHeight: 1.2 }}>
                      {r.product}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "#6F6B7D", lineHeight: 1.2 }}>
                      {r.desc}
                    </Typography>
                  </Box>
                </Box>

                <Typography sx={{ fontSize: 13, color: "#6F6B7D" }}>{r.category}</Typography>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Switch
                    checked={r.stock}
                    size="small"
                    onChange={() => console.log("toggle stock mock", r.id)}
                  />
                </Box>

                <Typography sx={{ fontSize: 13, color: "#6F6B7D" }}>{r.sku}</Typography>
                <Typography sx={{ fontSize: 13, color: "#6F6B7D" }}>{r.price}</Typography>
                <Typography sx={{ fontSize: 13, color: "#6F6B7D" }}>{r.qty}</Typography>

                {statusPill(r.status)}

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton size="small" onClick={() => console.log("edit mock", r.id)}>
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => console.log("more mock", r.id)}>
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            ))}

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
                Showing {(page - 1) * pageSize + 1} to{" "}
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
