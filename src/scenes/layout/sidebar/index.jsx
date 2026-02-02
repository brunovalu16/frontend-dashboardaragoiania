import React, { useContext, useState, useEffect } from "react";
import { Box, IconButton, Button, Divider, useTheme } from "@mui/material";
import { Menu, MenuItem, Sidebar, SubMenu  } from "react-pro-sidebar";
import {
  MenuOutlined,
  Home as HomeIcon,
  Person as PersonIcon,
  Assessment as AssessmentIcon,
  PieChart as PieChartIcon,
  Source as SourceIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  PowerSettingsNew as LogoutIcon,
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import HeatPumpIcon from '@mui/icons-material/HeatPump';


import { useNavigate, Link } from "react-router-dom";
import logo from "../../../assets/images/fokus360cinza.png";
import { tokens } from "../../../theme";
import { authFokus360, dbFokus360 as db } from "../../../data/firebase-config";

import { ToggledContext } from "../../../App";
import { signOut, onAuthStateChanged } from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";
import icon_logo from "../../../assets/images/fokus360cinza.png";



const SideBar = () => {
  const [userRole, setUserRole] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const { toggled, setToggled } = useContext(ToggledContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [isLoadingRole, setIsLoadingRole] = useState(true); // Adiciona o estado de carregamento
  const [openProjetos, setOpenProjetos] = useState(false);
  const [openCsc, setOpenCsc] = useState(false);



  

   // Obter o perfil do usuário logado
   useEffect(() => {
    const unsubscribe = onAuthStateChanged(authFokus360, async (currentUser) => {
      if (currentUser) {
        try {
          const docRef = doc(db, "user", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const role = docSnap.data().role;
            setUserRole(role);
          } else {
            //console.error("Dados do usuário não encontrados!");
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
        } finally {
          setIsLoadingRole(false); // Finaliza o carregamento
        }
      } else {
        setUserRole("");
        setIsLoadingRole(false); // Finaliza o carregamento mesmo sem usuário logado
      }
    });

    return () => unsubscribe();
  }, []);



  const handleLogout = async () => {
    try {
      // Realiza o logout no Firebase
      await signOut(authFokus360);
  
      // Remove o estado de autenticação armazenado
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
  
      // Redireciona o usuário para a página de login
      navigate("/login");
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };
  

  return (
    <Sidebar
      backgroundColor="#f2f0f0"
      rootStyles={{
        border: 0,
        height: "100vh",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        width: collapsed ? "60px" : "250px", // Ajusta dinamicamente
        transition: "width 0.3s ease", // Transição suave
      }}
      collapsed={collapsed}
      onBackdropClick={() => setToggled(false)}
      toggled={toggled}
      breakPoint="md"
    >
      {/* Botão de Recolher */}
      <IconButton
        onClick={() => setCollapsed(!collapsed)}
        sx={{
          color: "#312783",
          margin: "15px auto", // Centraliza horizontalmente
          marginLeft: "20px",
          transition: "all 0.3s ease", // Suaviza a transição
        }}
      >
        <MenuOutlined />
      </IconButton>

      {/* Imagem no Topo */}
      {!collapsed && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{
            transition: "all 0.8s ease", // Transição suave
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              width: "150px", // Tamanho da logo
              height: "auto",
              marginTop: "10px",
              marginBottom: "20px",
            }}
          />
        </Box>
      )}

      <Divider
        sx={{
          backgroundColor: colors.gray[1000],
          height: "1px",
          width: "50%",
          margin: "20px auto",
        }}
      />

      {/* Itens do Menu */}
      <Box
        mb={5}
        pl={collapsed ? undefined : "19%"}
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1, // Adicionado para expandir o menu corretamente
          gap: "0px",
          marginLeft: "3px",
        }}
      >
<Menu
  menuItemStyles={{
    button: {
      color: "#4B0F8A",
      backgroundColor: "#f2f0f0",
      ":hover": {
        color: "#bbbbbb",
        background: "transparent",
        transition: ".4s ease",
      },
    },
  }}
>
  <MenuItem
    component={<Link to="/homesaude" />}
    icon={<AssessmentIcon sx={{ fontSize: 25 }} />}>
    SAÚDE
  </MenuItem>

  
 



  {/* SUBMENU DE PROJETOS */}
  
  <div
  onMouseEnter={() => setOpenProjetos(true)}
  onMouseLeave={() => setOpenProjetos(false)}
>
  {!collapsed ? (
    <SubMenu
      open={openProjetos}
      label="Projetos"
      icon={<PieChartIcon />}
      menuItemStyles={{
        button: {
          padding: "5px 10px",
          fontSize: "13px",
          margin: "1px 0",
          ":hover": {
            color: "#22d3ee",
          },
        },
      }}
    >
      <MenuItem
        component={<Link to="/projetos2" />}
        style={{
          padding: "5px 10px",
          fontSize: "13px",
          margin: "2px 0",
        }}
      >
        Projetos
      </MenuItem>

      <MenuItem
        component={<Link to="/projetos" />}
        style={{
          padding: "5px 10px",
          fontSize: "13px",
          margin: "2px 0",
        }}
      >
        Planejamento Estratégico
      </MenuItem>
    </SubMenu>
  ) : (
    <Tooltip
      title={
        <Box display="flex" flexDirection="column">
          <Link to="/projetos" style={{ color: "#fff", textDecoration: "none", padding: "4px" }}>
            Todos os Projetos
          </Link>
          <Link
            to="/projetos"
            style={{ color: "#fff", textDecoration: "none", padding: "4px" }}
          >
            Planejamento Estratégico
          </Link>
        </Box>
      }
      placement="right"
      arrow
    >
      <MenuItem icon={<PieChartIcon />} />
    </Tooltip>
  )}
</div>

<MenuItem component={<Link to="/capaarquivos" />} icon={<SourceIcon />}>
    Arquivos
  </MenuItem>

  <MenuItem component={<Link to="/capatarefas" />} icon={<AssignmentTurnedInIcon />}>
    Tarefas
  </MenuItem>

  <MenuItem component={<Link to="/csc" />} icon={<HeatPumpIcon />}>
    CSC
  </MenuItem>





{/* SUBMENU DE CSC */}


</Menu>



        {/** 
          <MenuItem component={<Link to="/monitoramento" />} icon={<LocationOnIcon sx={{ fontSize: 28 }} />}>
            Monitoramento
          </MenuItem>
          */}
      </Box>

      {/* Rodapé */}
      <Box
        sx={{
          position: "relative", // Alterado de "absolute" para "relative"
          bottom: 0,
          width: "100%",
          padding: "10px",
          marginTop: "auto", // Isso empurra o botão de logout para o final
        }}
      >
        {/* Botão de Logout */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "10px",
          }}
        >
          <Button
            variant="contained"
            color="error"
            onClick={handleLogout}
            sx={{
              width: collapsed ? "3px" : "50%",
              borderRadius: "5px",
              height: "40px",
              padding: "10px",
              marginBottom: "15px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "#f2f0f0",
              boxShadow: "none",
              transition: "all 0.1s ease", // Transição suave
              ":hover": {
                backgroundColor: "#f2f0f0",
                boxShadow: "none",
              },
            }}
          >
            <LogoutIcon
              sx={{
                fontSize: "25px",
                color: "#c71339",
                ":hover": {
                  boxShadow: "none",
                  color: "#bbbbbb",
                  transition: "all 0.3s ease", // Transição suave
                },
              }}
            />
            {!collapsed && ""}
          </Button>
        </Box>

        <Divider
          sx={{
            backgroundColor: colors.gray[1000],
            height: "1px",
            width: "50%",
            margin: "10px auto",
          }}
        />

        {/* Imagem no Rodapé */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: "10px",
          }}
        >
          <img
            src={icon_logo}
            alt="Logo"
            style={{
              maxWidth: "60px",
              height: "auto",
            }}
          />
        </Box>
      </Box>
    </Sidebar>
  );
};

export default SideBar;




{/**

 Ocultar apenas para o perfil "07 Projetos" 

    {userRole !== "" && (
      <MenuItem>
        <Link
          to="/relatorios"
          style={{
            textDecoration: "none",
            color: "inherit",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <AssessmentIcon />
          Relatórios
        </Link>
      </MenuItem>
    )}
  
  */}
