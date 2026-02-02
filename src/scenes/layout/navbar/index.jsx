import React, { useEffect, useState, useContext } from "react";
import { Box, IconButton, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import { NotificationsOutlined, SettingsOutlined } from "@mui/icons-material";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { authFokus360, dbFokus360 as db } from "../../../data/firebase-config";
import { Badge, Popover, List, ListItem, ListItemText } from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { updateDoc } from "firebase/firestore"; // IMPORTAR updateDoc
import { NotificationContext } from "../../../context/NotificationContext";
import TaskIcon from '@mui/icons-material/Task';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { onAuthStateChanged, signOut } from "firebase/auth";


import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom'; // Certifique-se de importar o Link
import { Avatar } from "@mui/material";

//Importando o contador de data
import { getDataHojeFormatada } from "../../../utils/formatDate";

const Navbar = () => {
  const theme = useTheme();
  const { notifications, setNotifications } = useContext(NotificationContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const isXsDevices = useMediaQuery("(max-width:466px)");
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const navigate = useNavigate(); // Para redirecionar após logout
   const [userRole, setUserRole] = useState(""); // Armazena o perfil do usuário logado
   const [userName, setUserName] = useState("");
   const [formValues, setFormValues] = useState({
     username: "",
     email: "",
     role: "",
     unidade: "",
     photoURL: "",
   });
     

   // esconde o botão do usuário logado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authFokus360, async (currentUser) => {

      if (currentUser) {
        try {
          const docRef = doc(db, 'user', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserRole(data.role);
          } else {
            console.error('Dados do usuário não encontrados!');
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        }
      } else {
        setUserRole('');
      }
    });

    return () => unsubscribe();
  }, []);



//buscar notificações não lidas para o user.uid
useEffect(() => {
  const fetchNotifications = async () => {
    if (!user) return;

    const q = query(
      collection(db, "notificacoes"),
      where("userId", "==", user.uid),
      where("lido", "==", false)
    );
    const querySnapshot = await getDocs(q);
    setNotifications(
      querySnapshot.docs.map((doc) => ({
        id: doc.id,
        mensagem: doc.data().mensagem,
      }))
    );
  };

  fetchNotifications();
}, [user]);




const handleNotificationsClick = async (event) => {
  setAnchorEl(event.currentTarget);
  
  // Recarregar as notificações toda vez que abrir
  const q = query(
    collection(db, "notificacoes"),
    where("userId", "==", user.uid),
    where("lido", "==", false)
  );
  const querySnapshot = await getDocs(q);
  setNotifications(
    querySnapshot.docs.map((doc) => ({
      id: doc.id,
      mensagem: doc.data().mensagem,
    }))
  );
};



// Fechar popup
const handleNotificationsClose = () => {
  setAnchorEl(null);
};

const open = Boolean(anchorEl);


// pega os dados do usuário logado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authFokus360, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Buscar username no Firestore
        try {
          const docRef = doc(db, "user", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUsername(docSnap.data().username);
          } else {
          }
        } catch (error) {}
      } else {
        setUser(null);
        setUsername("");
      }
    });

    return () => unsubscribe();
  }, []);


//FUNÇÃO PARA BUSCAR A FOTO DO USUÁRIO NO BANCO
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authFokus360, async (currentUser) => {
      if (currentUser) {
        try {
          const docRef = doc(db, "user", currentUser.uid);
          const docSnap = await getDoc(docRef);
  
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFormValues({
              photoURL: data.photoURL || "",    // Define o photoURL no estado
              username: data.username || "",
              // ...outros campos, se necessário
            });
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
        }
      }
    });
  
    return () => unsubscribe();
  }, []);
  

// função para marcar notificação como lida
  const handleMarkAsRead = async (notificationId) => {
    try {
      const notifRef = doc(db, "notificacoes", notificationId);
      await updateDoc(notifRef, { lido: true });
  
      // Atualizar localmente (remove a notificação da lista atual)
      setNotifications((prev) =>
        prev.filter((notif) => notif.id !== notificationId)
      );
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
    }
  };


  return (
    <>

<Popover
  open={open}
  anchorEl={anchorEl}
  onClose={handleNotificationsClose}
  anchorOrigin={{
    vertical: "bottom",
    horizontal: "right",
  }}
>
<List
  sx={{
    width: "300px",
    maxHeight: "300px",
    overflowY: "auto",
  }}
>
  {notifications.length === 0 ? (
    <ListItem>
      <ListItemText primary="Nenhuma notificação" />
    </ListItem>
  ) : (
    notifications.map((noti, index) => (
      <ListItem
        key={noti.id}
        button
        onClick={() => handleMarkAsRead(noti.id)}
        sx={{
          backgroundColor: index % 2 === 0 ? "#ffffff" : "#f5f5f5",
          "&:hover": {
            backgroundColor: "#e0e0e0",
          },
        }}
      >
        <TaskIcon sx={{ color: "#5f53e5", marginRight: 1 }} />
        <ListItemText primary={noti.mensagem} />
      </ListItem>
    ))
  )}
</List>

</Popover>



      

      <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          p={5} // Diminui padding
          sx={{
            backgroundColor: "#e8e5e5",
            height: "60px", // Altura menor
          }}
      >
        {/* Conteúdo do Box */}

        
        <Box display="flex" alignItems="center" gap={2}>
          {/* Campo de Pesquisa */}


          {/* 

          //campo pesquisa global
          <Box
            display="flex"
            alignItems="center"
            bgcolor="#ffffff" // Fundo branco para o box
            padding="4px"
            sx={{
              display: `${isXsDevices ? "none" : "flex"}`,
            }}
          >
            <InputBase placeholder="Pesquisar..." sx={{ ml: 2, flex: 1 }} />
          </Box>

          <IconButton
            type="button"
            sx={{
              p: 0.7,
              bgcolor: "#312783", // Fundo azul
              color: "#00ebf7", // Ícone branco
              borderRadius: "1%", // Faz o botão ser circular
              marginLeft: "-7%", // Faz o botão ser
              padding: "8px",
              "&:hover": {
                bgcolor: "#4a43cc", // Efeito hover (opcional)
              },
            }}
          >
            <SearchOutlined />
          </IconButton>
          */}
          

          
        </Box>

        {/* Parte direita */}
        <Box display="flex" alignItems="center" gap={2}>
         

          {/* Linha vertical */}
          <Box
            sx={{
              width: "1px",
              height: "35px", // Ajuste conforme necessário
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              marginLeft: "20px",
              marginRight: "10px",
            }}
          />

          <IconButton onClick={handleNotificationsClick}>
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsOutlined />
            </Badge>
          </IconButton>


          {userRole === "08" && (
            <IconButton
              component={Link}
              to="/contacts"
              sx={{
                color: "#4B0F8A",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <SettingsOutlined />
            </IconButton>
          )}


          <Avatar
            src={formValues.photoURL || ""}
            sx={{
              width: 45,
              height: 45,
              border: "2px solid #9d9d9c",
              borderRadius: 3,  // Define formato quadrado
            }}
          />


          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              color={theme.palette.text.secondary}
            >
              {user ? `Olá, ${username}` : ""}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Toolbar
        sx={{
          "&.MuiToolbar-root": {
            // &.MUI É A BIBLIOTECA
            height: "25px", // Define a altura fixa
            minHeight: "20px", // Define a altura mínima
            padding: "0", // Remove o padding
          },
          alignSelf: "center",
          backgroundColor: "#4B0F8A",
          width: "100%",
        }}
      >
        <IconButton size="large" edge="start" color="inherit" aria-label="menu">
          <ArrowCircleRightIcon
            sx={{
              color: "#91e011",
              marginLeft: "15px",
              fontSize: "15px",
              marginLeft: "38px",
            }}
          />
        </IconButton>
        <Typography
          variant="h8"
          component="div"
          marginTop="3px"
          sx={{
            flexGrow: 1,
            color: "#c2c2c2",
            fontSize: "10px",
            marginBottom: "3px",
          }}
        >
          PREFEITURA DE ARAGOIANIA | INOVAÇÃO E PROGRESSO PARA TODOS
        </Typography>

        <IconButton size="large" edge="start" color="inherit" aria-label="menu">
          <CalendarMonthIcon
            sx={{
              color: "#91e011",
              marginLeft: "15px",
              fontSize: "18px",
              marginLeft: "38px",
            }}
          />
        </IconButton>

        <Typography variant="body2" sx={{ color: "#c8c6c6", flexGrow: 0.05 }}>
              Data atual: {getDataHojeFormatada().split("-").reverse().join("/")}
            </Typography>
      </Toolbar>
    </>
  );
};

export default Navbar;

//{user ? `Olá, ${username || user.email}` : "Usuário não logado"}
//boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)"
//background: "linear-gradient(to right, #d8d8d8, #ffffff)",
