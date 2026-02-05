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

/** =========================
 *  DADOS REAIS – ARAGOIÂNIA
 *  Fontes: IBGE + site oficial
 *  ========================= */
const aragoiania = {
  nome: "Aragoiânia",
  uf: "GO",
  codigoIBGE: "5201801",

  // IBGE (Cidades e Estados)
  areaKm2: 218.125, // [2024]
  populacaoCenso: 11890, // [2022]
  densidadeHabKm2: 54.51, // [2022]
  populacaoEstimada: 12806, // [2025]
  escolarizacao6a14: 91.12, // % [2022]
  idhm2010: 0.684, // [2010]
  mortalidadeInfantil: 9.71, // por mil NV [2023]
  receitasBrutas: 71148567.84, // R$ [2024]
  despesasBrutas: 67986131.65, // R$ [2024]
  pibPerCapita: 20007.46, // R$ [2023]

  // Prefeitura (Fale Conosco)
  atendimento: {
    telefone: "(62) 9 9663-0183",
    email: "administracao@aragoiania.go.gov.br",
    endereco: "Praça da Matriz, nº 37, Centro, Aragoiânia - GO. CEP: 75330-000",
    horario: "Seg–Sex 08h–11h e 13h–17h",
  },
};

const cardBase = {
  bgcolor: "#fff",
  borderRadius: "14px",
  boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
  border: "1px solid rgba(0,0,0,0.04)",
};

function MiniBars({ height = 54 }) {
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
  return (
    <Box
      sx={{
        height,
        borderRadius: 2,
        background: "linear-gradient(180deg, rgba(115,103,240,0.20), rgba(115,103,240,0.02))",
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

const formatBRL = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const formatNumber = (value) => new Intl.NumberFormat("pt-BR").format(value);

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

  // mantém sua regra atual: indústria vai pro painelindustrias, demais pro relatorios
  const destinoPrincipal = isIndustria ? "/painelindustrias" : "/relatorios";

  // % “equilíbrio fiscal” (mock visual) com base em receitas x despesas
  const execPercent = Math.max(
    0,
    Math.min(100, Math.round((aragoiania.despesasBrutas / aragoiania.receitasBrutas) * 100))
  );

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F5F6FA", padding: "22px" }}>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "18px" }}>
        {/* CARD GRANDE ROXO */}
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
            Painel de Indicadores — {aragoiania.nome}/{aragoiania.uf}
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: 12, mt: 0.3 }}>
            Código IBGE {aragoiania.codigoIBGE} • População estimada {formatNumber(aragoiania.populacaoEstimada)} (2025)
          </Typography>

          <Box sx={{ display: "flex", gap: 4, mt: 2.2, alignItems: "flex-end" }}>
            <Box>
              <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: 11 }}>
                Área territorial
              </Typography>
              <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>
                {formatNumber(aragoiania.areaKm2)} km²
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: 11 }}>
                População (Censo 2022)
              </Typography>
              <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>
                {formatNumber(aragoiania.populacaoCenso)}
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: 11 }}>
                Densidade (2022)
              </Typography>
              <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>
                {String(aragoiania.densidadeHabKm2).replace(".", ",")} hab/km²
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
          <Box sx={{ ...cardBase, gridColumn: "span 8", padding: "16px" }}>
            <Typography sx={{ fontWeight: 800, fontSize: 13, color: "#2F2B3D" }}>
              Finanças Públicas — Receitas (2024)
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#6F6B7D", mt: 0.3 }}>
              Total de receitas brutas realizadas
            </Typography>
            <Typography sx={{ fontWeight: 900, fontSize: 20, mt: 1 }}>
              {formatBRL(aragoiania.receitasBrutas)}
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
                Despesas (2024)
              </Typography>
              <Typography sx={{ fontWeight: 900, fontSize: 15, mt: 0.6 }}>
                {formatBRL(aragoiania.despesasBrutas)}
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
              <Box
                sx={{
                  width: `${execPercent}%`,
                  height: "100%",
                  bgcolor: "rgba(115,103,240,0.95)",
                }}
              />
            </Box>

            <Typography sx={{ fontSize: 12, color: "#22C55E", fontWeight: 700 }}>
              Execução: {execPercent}%
            </Typography>
          </Box>
        </Box>

        {/* ROW 2: Indicadores sociais / Atendimento */}
        <Box sx={{ ...cardBase, gridColumn: { xs: "span 12", md: "span 7" }, padding: "16px" }}>
          <Typography sx={{ fontWeight: 800, fontSize: 13, color: "#2F2B3D" }}>
            Indicadores Sociais (IBGE)
          </Typography>
          <Typography sx={{ fontSize: 12, color: "#6F6B7D", mt: 0.3 }}>
            Educação • Desenvolvimento Humano • Saúde
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Box>
              <Typography sx={{ fontWeight: 900, fontSize: 22 }}>
                IDHM {String(aragoiania.idhm2010).replace(".", ",")}
              </Typography>
              <Typography sx={{ fontSize: 12, color: "#6F6B7D" }}>
                Índice de desenvolvimento humano (2010)
              </Typography>
            </Box>
            <MiniBars />
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, mt: 2 }}>
            {[
              ["Escolarização 6–14", `${String(aragoiania.escolarizacao6a14).replace(".", ",")}%`],
              ["Mortalidade infantil", `${String(aragoiania.mortalidadeInfantil).replace(".", ",")}‰`],
              ["PIB per capita", formatBRL(aragoiania.pibPerCapita)],
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
              Atendimento ao Cidadão
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#6F6B7D", mt: 0.3 }}>
              Contatos oficiais — Prefeitura
            </Typography>

            <Typography sx={{ fontWeight: 900, fontSize: 20, mt: 2 }}>
              {aragoiania.atendimento.telefone}
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#6F6B7D" }}>Telefone</Typography>

            <Box sx={{ mt: 2, display: "grid", gap: 1 }}>
              {[
                ["E-mail", aragoiania.atendimento.email],
                ["Horário", aragoiania.atendimento.horario],
                ["Endereço", aragoiania.atendimento.endereco],
              ].map(([k, v]) => (
                <Box key={k} sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                  <Typography sx={{ fontSize: 12, color: "#6F6B7D", minWidth: 70 }}>{k}</Typography>
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: "#2F2B3D",
                      textAlign: "right",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: 240,
                    }}
                    title={v}
                  >
                    {v}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <DonutMock />
        </Box>

        {/* ROW 3 */}
        <Box sx={{ ...cardBase, gridColumn: { xs: "span 12", md: "span 4" }, padding: "16px" }}>
          <Typography sx={{ fontWeight: 800, fontSize: 13, color: "#2F2B3D" }}>
            Acesso Rápido (Prefeitura)
          </Typography>
          <Typography sx={{ fontSize: 12, color: "#6F6B7D", mt: 0.3 }}>
            Serviços principais e transparência
          </Typography>

          <Box sx={{ mt: 2, display: "grid", gap: 1.3 }}>
            {[
              ["Nota Fiscal", "Emissão e dúvidas"],
              ["IPTU", "Emissão de guia"],
              ["Certidão Negativa", "Consulta rápida"],
              ["Ouvidoria / SIC", "Solicitações e acompanhamento"],
            ].map(([c, v]) => (
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
                <Typography sx={{ fontSize: 12, fontWeight: 800, color: "#22C55E" }}>OK</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ ...cardBase, gridColumn: { xs: "span 12", md: "span 4" }, padding: "16px" }}>
          <Typography sx={{ fontWeight: 800, fontSize: 13, color: "#2F2B3D" }}>
            PIB per capita (IBGE)
          </Typography>

          <Typography sx={{ fontWeight: 900, fontSize: 28, mt: 1 }}>
            {formatBRL(aragoiania.pibPerCapita)}
          </Typography>
          <Typography sx={{ fontSize: 12, color: "#22C55E", fontWeight: 700 }}>
            Referência: 2023
          </Typography>

          <Box sx={{ mt: 2 }}>
            <MiniBars height={90} />
          </Box>
        </Box>

        <Box sx={{ ...cardBase, gridColumn: { xs: "span 12", md: "span 4" }, padding: "16px" }}>
          <Typography sx={{ fontWeight: 800, fontSize: 13, color: "#2F2B3D" }}>
            Educação & Saúde (IBGE)
          </Typography>

          <Box sx={{ mt: 2, display: "grid", gap: 1.2 }}>
            {[
              ["Escolarização 6–14", `${String(aragoiania.escolarizacao6a14).replace(".", ",")}% (2022)`],
              ["Mortalidade infantil", `${String(aragoiania.mortalidadeInfantil).replace(".", ",")}‰ (2023)`],
              ["População estimada", `${formatNumber(aragoiania.populacaoEstimada)} (2025)`],
              ["Densidade demográfica", `${String(aragoiania.densidadeHabKm2).replace(".", ",")} hab/km² (2022)`],
            ].map(([k, v]) => (
              <Box key={k} sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: 12, color: "#6F6B7D" }}>{k}</Typography>
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 800 }}>{v}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ROW FINAL: tabela */}
        <Box sx={{ ...cardBase, gridColumn: "span 12", padding: "16px" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography sx={{ fontWeight: 900, fontSize: 14, color: "#2F2B3D" }}>
              Painel de Gestão — {aragoiania.nome}/{aragoiania.uf}
            </Typography>

            <Box
              sx={{
                width: 280,
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
              Buscar serviço / secretaria
            </Box>
          </Box>

          {/* header */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "2.2fr 1.2fr 1.2fr 1.2fr 0.6fr",
              gap: 2,
              px: 1,
              py: 1,
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              color: "#6F6B7D",
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            <Box>ÁREA / SERVIÇO</Box>
            <Box>RESPONSÁVEL</Box>
            <Box>FOCO</Box>
            <Box>STATUS</Box>
            <Box>AÇÃO</Box>
          </Box>

          {[
            ["Ouvidoria / SIC", "Ouvidoria", "Atendimento", "85%"],
            ["Nota Fiscal (NFS-e)", "Finanças", "Serviços", "62%"],
            ["IPTU (Guia)", "Finanças", "Arrecadação", "74%"],
            ["Educação", "SME", "Escolas", "56%"],
            ["Saúde", "SMS", "ESFs", "68%"],
          ].map((row, idx) => (
            <Box
              key={idx}
              sx={{
                display: "grid",
                gridTemplateColumns: "2.2fr 1.2fr 1.2fr 1.2fr 0.6fr",
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
                  <Box sx={{ width: row[3], height: "100%", bgcolor: "rgba(115,103,240,0.95)" }} />
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
