import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const roleToLabelMap = {
  "37": "Ajinomoto",
  "38": "AB Mauri",
  "39": "Adoralle",
  "40": "Bettanin",
  "41": "Mars Choco",
  "42": "Mars Pet",
  "43": "M.Dias",
  "44": "SCJhonson",
  "45": "UAU Ingleza",
  "46": "Danone",
  "47": "Ypê",
  "48": "Adoralle",
  "49": "Fini",
  "50": "Heinz",
  "51": "Red Bull",
};

const cardBase = {
  bgcolor: "#fff",
  borderRadius: "14px",
  boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
  border: "1px solid rgba(0,0,0,0.04)",
};

function MiniBars({ height = 54 }) {
  // barras fake para “parecer gráfico”
  const bars = [18, 26, 12, 30, 22, 34, 16, 28, 20, 36];
  return (
    <Box sx={{ display: "flex", alignItems: "flex-end", gap: 0.9, height }}>
      {bars.map((h, i) => (
        <Box
          key={i}
          sx={{
            width: 7,
            height: h,
            borderRadius: 999,
            bgcolor: i % 2 === 0 ? "rgba(115,103,240,0.85)" : "rgba(115,103,240,0.25)",
          }}
        />
      ))}
    </Box>
  );
}

function MiniLine({ height = 60 }) {
  // linha fake (gradiente)
  return (
    <Box
      sx={{
        height,
        borderRadius: 2,
        background:
          "linear-gradient(180deg, rgba(115,103,240,0.20), rgba(115,103,240,0.02))",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          left: 10,
          right: 10,
          top: "45%",
          height: 2,
          bgcolor: "rgba(115,103,240,0.65)",
          borderRadius: 999,
          transform: "skewX(-15deg)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: 40,
          top: "35%",
          width: 10,
          height: 10,
          borderRadius: "50%",
          bgcolor: "rgba(115,103,240,0.9)",
        }}
      />
    </Box>
  );
}

function DonutMock() {
  return (
    <Box
      sx={{
        width: 120,
        height: 120,
        borderRadius: "50%",
        background:
          "conic-gradient(rgba(115,103,240,0.95) 0 260deg, rgba(115,103,240,0.15) 260deg 360deg)",
        display: "grid",
        placeItems: "center",
      }}
    >
      <Box sx={{ width: 88, height: 88, borderRadius: "50%", bgcolor: "#fff" }} />
    </Box>
  );
}

export default function Home() {
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role) setUserRole(role);
  }, []);

  const isIndustria = useMemo(
    () => Object.keys(roleToLabelMap).includes(String(userRole || "")),
    [userRole]
  );

  const destinoPrincipal = isIndustria ? "/painelindustrias" : "/relatorios";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F5F6FA",
        padding: "22px",
      }}
    >
      {/* GRID PRINCIPAL (igual a imagem) */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: "18px",
        }}
      >
        {/* CARD GRANDE ROXO - esquerda topo */}
        <Box
          component={Link}
          to={destinoPrincipal}
          sx={{
            ...cardBase,
            gridColumn: { xs: "span 12", md: "span 7" },
            padding: "18px 18px 16px 18px",
            textDecoration: "none",
            color: "inherit",
            background:
              "linear-gradient(135deg, #4B0F8A 0%, #4B0F8A 55%, rgba(115,103,240,0.78) 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              right: -30,
              top: -30,
              width: 160,
              height: 160,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
            }}
          />
          <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>
            Website Analytics
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: 12, mt: 0.3 }}>
            Total 28.5% Conversion Rate
          </Typography>

          <Box sx={{ display: "flex", gap: 4, mt: 2.2, alignItems: "flex-end" }}>
            <Box>
              <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: 11 }}>
                Spent
              </Typography>
              <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>
                12h
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: 11 }}>
                Order
              </Typography>
              <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>
                127
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: 11 }}>
                Items
              </Typography>
              <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>
                18
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* 2 cards pequenos topo direita */}
        <Box
          sx={{
            ...cardBase,
            gridColumn: { xs: "span 12", md: "span 5" },
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: "18px",
            padding: "0px",
            background: "transparent",
            boxShadow: "none",
            border: "none",
          }}
        >
          <Box
            sx={{
              ...cardBase,
              gridColumn: "span 8",
              padding: "16px",
            }}
          >
            <Typography sx={{ fontWeight: 800, fontSize: 13, color: "#2F2B3D" }}>
              Average Daily Sales
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#6F6B7D", mt: 0.3 }}>
              Total Sales This Month
            </Typography>
            <Typography sx={{ fontWeight: 900, fontSize: 20, mt: 1 }}>
              $28,450
            </Typography>
            <Box sx={{ mt: 1.2 }}>
              <MiniLine />
            </Box>
          </Box>

          <Box
            sx={{
              ...cardBase,
              gridColumn: "span 4",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: 13, color: "#2F2B3D" }}>
                Sales Overview
              </Typography>
              <Typography sx={{ fontWeight: 900, fontSize: 18, mt: 0.6 }}>
                $42.5k
              </Typography>
            </Box>

            <Box
              sx={{
                height: 6,
                borderRadius: 999,
                bgcolor: "rgba(115,103,240,0.18)",
                overflow: "hidden",
              }}
            >
              <Box sx={{ width: "62%", height: "100%", bgcolor: "rgba(115,103,240,0.95)" }} />
            </Box>

            <Typography sx={{ fontSize: 12, color: "#22C55E", fontWeight: 700 }}>
              +18.2%
            </Typography>
          </Box>
        </Box>

        {/* ROW 2: Earnings / Support */}
        <Box
          sx={{
            ...cardBase,
            gridColumn: { xs: "span 12", md: "span 7" },
            padding: "16px",
          }}
        >
          <Typography sx={{ fontWeight: 800, fontSize: 13, color: "#2F2B3D" }}>
            Earning Reports
          </Typography>
          <Typography sx={{ fontSize: 12, color: "#6F6B7D", mt: 0.3 }}>
            Weekly Earnings Overview
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Box>
              <Typography sx={{ fontWeight: 900, fontSize: 22 }}>$468</Typography>
              <Typography sx={{ fontSize: 12, color: "#22C55E", fontWeight: 700 }}>
                +4.2%
              </Typography>
            </Box>
            <MiniBars />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 2,
              mt: 2,
            }}
          >
            {[
              ["Earnings", "$545.69"],
              ["Profit", "$256.34"],
              ["Expense", "$74.19"],
            ].map(([t, v]) => (
              <Box
                key={t}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "rgba(115,103,240,0.06)",
                  border: "1px solid rgba(115,103,240,0.12)",
                }}
              >
                <Typography sx={{ fontSize: 12, color: "#6F6B7D" }}>{t}</Typography>
                <Typography sx={{ fontWeight: 900, mt: 0.6 }}>{v}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            ...cardBase,
            gridColumn: { xs: "span 12", md: "span 5" },
            padding: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 13, color: "#2F2B3D" }}>
              Support Tracker
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#6F6B7D", mt: 0.3 }}>
              Last 7 Days
            </Typography>

            <Typography sx={{ fontWeight: 900, fontSize: 28, mt: 2 }}>164</Typography>
            <Typography sx={{ fontSize: 12, color: "#6F6B7D" }}>Total Tickets</Typography>

            <Box sx={{ mt: 2, display: "grid", gap: 1 }}>
              {[
                ["New Tickets", "142"],
                ["Open Tickets", "28"],
                ["Response Time", "1 Day"],
              ].map(([k, v]) => (
                <Box key={k} sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                  <Typography sx={{ fontSize: 12, color: "#6F6B7D" }}>{k}</Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 800, color: "#2F2B3D" }}>
                    {v}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <DonutMock />
        </Box>

        {/* ROW 3: lista + gráfico + rate */}
        <Box
          sx={{
            ...cardBase,
            gridColumn: { xs: "span 12", md: "span 4" },
            padding: "16px",
          }}
        >
          <Typography sx={{ fontWeight: 800, fontSize: 13, color: "#2F2B3D" }}>
            Sales by Countries
          </Typography>
          <Typography sx={{ fontSize: 12, color: "#6F6B7D", mt: 0.3 }}>
            Monthly Sales Overview
          </Typography>

          <Box sx={{ mt: 2, display: "grid", gap: 1.3 }}>
            {[
              ["United States", "$8.567k", "+25.8%"],
              ["Brazil", "$2.415k", "-6.2%"],
              ["India", "$865k", "+12.4%"],
              ["France", "$745k", "-1.9%"],
            ].map(([c, v, p]) => (
              <Box
                key={c}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1.2,
                  borderRadius: 2,
                  border: "1px solid rgba(0,0,0,0.05)",
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: 12, fontWeight: 800 }}>{c}</Typography>
                  <Typography sx={{ fontSize: 12, color: "#6F6B7D" }}>{v}</Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: p.startsWith("-") ? "#EF4444" : "#22C55E",
                  }}
                >
                  {p}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            ...cardBase,
            gridColumn: { xs: "span 12", md: "span 4" },
            padding: "16px",
          }}
        >
          <Typography sx={{ fontWeight: 800, fontSize: 13, color: "#2F2B3D" }}>
            Total Earning
          </Typography>

          <Typography sx={{ fontWeight: 900, fontSize: 28, mt: 1 }}>87%</Typography>
          <Typography sx={{ fontSize: 12, color: "#22C55E", fontWeight: 700 }}>
            +25.8%
          </Typography>

          <Box sx={{ mt: 2 }}>
            <MiniBars height={90} />
          </Box>
        </Box>

        <Box
          sx={{
            ...cardBase,
            gridColumn: { xs: "span 12", md: "span 4" },
            padding: "16px",
          }}
        >
          <Typography sx={{ fontWeight: 800, fontSize: 13, color: "#2F2B3D" }}>
            Monthly Campaign State
          </Typography>

          <Box sx={{ mt: 2, display: "grid", gap: 1.2 }}>
            {[
              ["Emails", "12,346", "+0.3%"],
              ["Opened", "8,734", "+2.1%"],
              ["Clicked", "967", "+1.6%"],
              ["Subscribe", "345", "+4.8%"],
            ].map(([k, v, p]) => (
              <Box key={k} sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: 12, color: "#6F6B7D" }}>{k}</Typography>
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 800 }}>{v}</Typography>
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: p.startsWith("-") ? "#EF4444" : "#22C55E",
                    }}
                  >
                    {p}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ROW FINAL: tabela "Project List" */}
        <Box
          sx={{
            ...cardBase,
            gridColumn: "span 12",
            padding: "16px",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography sx={{ fontWeight: 900, fontSize: 14, color: "#2F2B3D" }}>
              Project List
            </Typography>

            <Box
              sx={{
                width: 240,
                height: 34,
                borderRadius: 999,
                border: "1px solid rgba(0,0,0,0.08)",
                bgcolor: "#fff",
                px: 2,
                display: "flex",
                alignItems: "center",
                color: "#9CA3AF",
                fontSize: 12,
              }}
            >
              Search Project
            </Box>
          </Box>

          {/* header */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1.2fr 1fr 0.6fr",
              gap: 2,
              px: 1,
              py: 1,
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              color: "#6F6B7D",
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            <Box>PROJECT</Box>
            <Box>LEADER</Box>
            <Box>TEAM</Box>
            <Box>PROGRESS</Box>
            <Box>ACTION</Box>
          </Box>

          {[
            ["Website SEO", "Eileen", "•••", "38%"],
            ["Social Banners", "Owen", "•••", "45%"],
            ["Logo Designs", "Keith", "•••", "92%"],
            ["IOS App Design", "Melanie", "•••", "56%"],
            ["Figma Dashboard", "Harmonia", "•••", "25%"],
          ].map((row, idx) => (
            <Box
              key={idx}
              sx={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1.2fr 1fr 0.6fr",
                gap: 2,
                px: 1,
                py: 1.2,
                borderBottom: "1px solid rgba(0,0,0,0.04)",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 800, color: "#2F2B3D" }}>
                {row[0]}
              </Typography>

              <Typography sx={{ fontSize: 13, color: "#6F6B7D" }}>{row[1]}</Typography>

              <Typography sx={{ fontSize: 13, color: "#6F6B7D" }}>{row[2]}</Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    flex: 1,
                    height: 6,
                    borderRadius: 999,
                    bgcolor: "rgba(115,103,240,0.14)",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width: row[3],
                      height: "100%",
                      bgcolor: "rgba(115,103,240,0.95)",
                    }}
                  />
                </Box>
                <Typography sx={{ fontSize: 12, fontWeight: 800, color: "#6F6B7D" }}>
                  {row[3]}
                </Typography>
              </Box>

              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: 2,
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
