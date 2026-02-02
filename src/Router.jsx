import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import App from "./App";
import AuthLayout from "../src/components/AuthLayout";
import Login from "./scenes/login";
import Cadastro from "./scenes/cadastro";
import User from "./scenes/usuario";
import Dashboard from "./scenes/dashboard";
import Relatorios from "./scenes/relatorios";
import PainelIndustrias from "./scenes/painel-industrias";
import Kanban from "./scenes/kanban";
import Home from "./scenes/home";
import Homesaude from "./scenes/homesaude";
import Arquivos from "./scenes/arquivos";
import VendasDevolucao from "./scenes/vendasdevolucao";
import RelatorioTrade from "./scenes/relatoriotrade";
import Projetos from "./scenes/projetos";
import Projetos2 from "./scenes/projetos2";
import CadastroProjetos from "./scenes/cadastroprojetos";
import ListaProjetos from "./scenes/listaprojetos";
import ListaProjetos2 from "./scenes/listaprojetos2";
import Diretriz from "./scenes/diretrizes";
import DashboardProjeto from "./scenes/dashboardprojeto";
import DataProjeto from "./components/DataProjeto";
import UserDetalhe from "./components/UserDetalhe";
import FluxoGrama from "./components/FluxoGrama";
import Listafluxograma from "./scenes/Listafluxograma";
import Roteirizacao from "./scenes/roteirizacao";
import Monitoramento from "./scenes/monitoramento";
import CadastroAreas from "./scenes/cadastroAreas";
import Planejamento from "./scenes/planejamento";
import DashboardPlanejamento from "./scenes/dashboardplanejamento";
import DataPlanejamento from "./components/DataPlanejamento";
import PlanejamentoGeral from "./scenes/planejamentoGeral";
import Eapplanejamento from "./scenes/eapplanejamento";
import ManuaisCSC from "./scenes/ManuaisCSC";
import Manuais from "./scenes/Manuais";
import VendastotalTrade from "./scenes/vendastotaltrade";
import Capatarefas from "./scenes/capatarefas";
import Capaarquivos from "./scenes/capaarquivos";
import Csc from "./scenes/csc";
import Arquivosareas from "./scenes/arquivosareas";
import Relatoriotrade2 from "./scenes/relatoriostrade";
import PainelIndustriasTrade from "./scenes/painel-industriasTrade";
import MonitoramentoVendedor from "./scenes/monitoramentovendedor";

import {
  Team,
  Invoices,
  Contacts,
  Bar,
  Line,
  Pie,
  FAQ,
  Geography,
  Calendar,
  Stream,
} from "./scenes";

import PrivateRoute from "./components/PrivateRoute";

// ✅ CRIE/APONTE PARA A TELA DE DETALHE
// Exemplo de caminho (ajuste conforme seu projeto):
import RelatoriosSaudeDetalhe from "./scenes/RelatoriosSaudeDetalhe";
// (Opcional futuramente)
// import RelatoriosIluminacaoDetalhe from "./scenes/relatorios-iluminacao-detalhe";
// import RelatoriosTransporteDetalhe from "./scenes/relatorios-transporte-detalhe";

const router = createBrowserRouter(
  [
    {
      element: <AuthLayout />,
      children: [{ path: "/login", element: <Login /> }],
    },
    {
      element: <App />,
      children: [
        { path: "/cadastro", element: <PrivateRoute><Cadastro /></PrivateRoute> },
        { path: "/home", element: <PrivateRoute><Home /></PrivateRoute> },
        { path: "/Homesaude", element: <PrivateRoute><Homesaude /></PrivateRoute> },
        { path: "/planejamentogeral", element: <PrivateRoute><PlanejamentoGeral /></PrivateRoute> },
        { path: "/arquivosareas", element: <PrivateRoute><Arquivosareas /></PrivateRoute> },
        { path: "/relatoriotrade2", element: <PrivateRoute><Relatoriotrade2 /></PrivateRoute> },
        { path: "/monitoramentovendedor", element: <PrivateRoute><MonitoramentoVendedor /></PrivateRoute> },
        { path: "/painelindustriastrade", element: <PrivateRoute><PainelIndustriasTrade /></PrivateRoute> },
        { path: "/csc", element: <PrivateRoute><Csc /></PrivateRoute> },
        { path: "/capatarefas", element: <PrivateRoute><Capatarefas /></PrivateRoute> },
        { path: "/capaarquivos", element: <PrivateRoute><Capaarquivos /></PrivateRoute> },
        { path: "/manuaisCSC", element: <PrivateRoute><ManuaisCSC /></PrivateRoute> },
        { path: "/manuais", element: <PrivateRoute><Manuais /></PrivateRoute> },
        { path: "/eapplanejamento", element: <PrivateRoute><Eapplanejamento /></PrivateRoute> },
        { path: "/dataplanejamento", element: <PrivateRoute><DataPlanejamento /></PrivateRoute> },
        { path: "/dashboardplanejamento/:id", element: <PrivateRoute><DashboardPlanejamento /></PrivateRoute> },
        { path: "/dashboard", element: <PrivateRoute><Dashboard /></PrivateRoute> },
        { path: "/planejamento", element: <PrivateRoute><Planejamento /></PrivateRoute> },
        { path: "/user", element: <PrivateRoute><User /></PrivateRoute> },
        { path: "/painelindustrias", element: <PrivateRoute><PainelIndustrias /></PrivateRoute> },
        { path: "/dashboardprojeto/:id", element: <PrivateRoute><DashboardProjeto /></PrivateRoute> },
        { path: "/vendasdevolucao", element: <PrivateRoute><VendasDevolucao /></PrivateRoute> },
        { path: "/relatoriotrade", element: <PrivateRoute><RelatorioTrade /></PrivateRoute> },
        { path: "/cadastroprojetos", element: <PrivateRoute><CadastroProjetos /></PrivateRoute> },
        { path: "/dataprojeto", element: <PrivateRoute><DataProjeto /></PrivateRoute> },
        { path: "/diretriz", element: <PrivateRoute><Diretriz /></PrivateRoute> },
        { path: "/listaprojetos", element: <PrivateRoute><ListaProjetos /></PrivateRoute> },
        { path: "/listaprojetos2", element: <PrivateRoute><ListaProjetos2 /></PrivateRoute> },
        { path: "/projetos", element: <PrivateRoute><Projetos /></PrivateRoute> },
        { path: "/projetos2", element: <PrivateRoute><Projetos2 /></PrivateRoute> },
        { path: "/monitoramento", element: <PrivateRoute><Monitoramento /></PrivateRoute> },

        // ✅ LISTA
        { path: "/relatorios", element: <PrivateRoute><Relatorios /></PrivateRoute> },

        // ✅ DETALHE (resolve o 404)
        { path: "/relatorios/saude/:id", element: <PrivateRoute><RelatoriosSaudeDetalhe /></PrivateRoute> },

        // (Opcional futuramente)
        // { path: "/relatorios/iluminacao/:id", element: <PrivateRoute><RelatoriosIluminacaoDetalhe /></PrivateRoute> },
        // { path: "/relatorios/transporte/:id", element: <PrivateRoute><RelatoriosTransporteDetalhe /></PrivateRoute> },

        { path: "/roteirizacao", element: <PrivateRoute><Roteirizacao /></PrivateRoute> },
        { path: "/arquivos", element: <PrivateRoute><Arquivos /></PrivateRoute> },
        { path: "/kanban", element: <PrivateRoute><Kanban /></PrivateRoute> },
        { path: "/team", element: <PrivateRoute><Team /></PrivateRoute> },
        { path: "/contacts", element: <PrivateRoute><Contacts /></PrivateRoute> },
        { path: "/invoices", element: <PrivateRoute><Invoices /></PrivateRoute> },
        { path: "/fluxograma", element: <PrivateRoute><FluxoGrama /></PrivateRoute> },
        { path: "/listafluxograma", element: <PrivateRoute><Listafluxograma /></PrivateRoute> },
        { path: "/calendar", element: <PrivateRoute><Calendar /></PrivateRoute> },
        { path: "/cadastroareas", element: <PrivateRoute><CadastroAreas /></PrivateRoute> },
        { path: "/bar", element: <PrivateRoute><Bar /></PrivateRoute> },
        { path: "/pie", element: <PrivateRoute><Pie /></PrivateRoute> },
        { path: "/stream", element: <PrivateRoute><Stream /></PrivateRoute> },
        { path: "/line", element: <PrivateRoute><Line /></PrivateRoute> },
        { path: "/faq", element: <PrivateRoute><FAQ /></PrivateRoute> },
        { path: "/geography", element: <PrivateRoute><Geography /></PrivateRoute> },
        { path: "/vendastotaltrade", element: <PrivateRoute><VendastotalTrade /></PrivateRoute> },
        { path: "/usuario/editar", element: <PrivateRoute><UserDetalhe /></PrivateRoute> },
      ],
    },
    {
      path: "/",
      element: <Navigate to="/login" />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
