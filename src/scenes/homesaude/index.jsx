import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import { Link } from 'react-router-dom';
import capasistema360relatorios from "../../assets/images/capasistema360relatorios.webp";


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


const Homesaude = () => {
  const [userRole, setUserRole] = useState("");



  //serve para buscar o papel (role) do usuário logado e armazenar esse valor no estado
  // do componente (userRole), assim que o componente Home for carregado na tela.

   useEffect(() => {
    const role = localStorage.getItem("userRole"); // Aqui busca o role do usuário logado
    if (role) setUserRole(role);
  }, []);

  return (
    <>
      {/* Conteúdo Principal */}
      <Box
        sx={{
          marginLeft: "40px",
          marginTop: "10px",
          width: "calc(100% - 80px)", // Para ajustar à tela considerando o margin de 40px
          minHeight: "50vh",
          padding: "15px",
          paddingLeft: "30px",
          borderRadius: "20px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          bgcolor: "#f2f0f0",
          overflowX: "hidden",
        }}
      >


        
        <Box display="flex" alignItems="center" gap={1}>
          <PlayCircleFilledIcon sx={{ color: "#949494", fontSize: 25 }} />
            <Typography
                color="#858585">SISTEMA | PREFEITURA DE ARAGOIANIA
            </Typography>
        </Box>

        
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "90%",
            marginBottom: "40px",
            marginTop: "15px",
          }}
        >
        </Box>
        

        {/* Estrutura da Imagem */}
        <div style={{ position: "relative", width: "100%", top: "-40px" }}>
          <img
            src={capasistema360relatorios}
            alt="Relatório de Vendas e Devoluções"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            }}
          />


          {/* Links sobrepostos */}
          <Box
            sx={{
              position: "absolute",
              top: "45%", // Posição para "Novo Projeto" 
            }}
          >
            <Link
              to={Object.keys(roleToLabelMap).includes(userRole) ? "/painelindustrias" : "/relatorios"}
              style={{
                backgroundColor: "transparent",  
                color: "transparent",
                textDecoration: "none",
                fontWeight: "bold",
                marginLeft: "60px",
                alignContent: "center",
                paddingRight: "500px",
                paddingBottom: "170px",
              }}
            >
              Novo Projeto
            </Link>

          </Box>

          <Box
            sx={{
              position: "absolute",
              top: "38%", // Posição para "Resumo Geral"
              right: "5%",
              height: "150px",
            }}
          >
            <a
              href="#"
              style={{
                padding: "10px 20px",
                backgroundColor: "transparent",
                color: "transparent",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold",
                paddingRight: "250px",
                paddingBottom: "30px",
              }}
            >
              Resumo Geral
            </a>
          </Box>


          <Box
            sx={{
              position: "absolute",
              top: "48%", // Posição para "Resumo Projetos"
              right: "6%",
            }}
          >
            <a
              href="#"
              style={{
                backgroundColor: "transparent",
                color: "transparent",
                textDecoration: "none",
                fontWeight: "bold",
                paddingRight: "280px",
                paddingBottom: "50px",
              }}
            >
              Projetos
            </a>
          </Box>
        </div>
      </Box>
    </>
  );
};

export default Homesaude;
