/*!

=========================================================
* Argon Dashboard React - v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from "./pages/Index";
import Home from "./pages/Home";
import Prediction from "./pages/Prediction";
import LaboratoryBoard from "./pages/Dashboard/LaboratoryBoard";
import NotesBoard from "./pages/Dashboard/NotesBoard";

var routes = [
  {
    path: "",
    name: "Home",
    icon: "ni ni-laptop text-info",
    component: <Home/>,
    layout: "/home",
  },
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index/>,
    layout: "/admin",
  },
  {
    path: "/prediction",
    name: "Prediction",
    icon: "ni ni-app text-primary",
    component: <Prediction/>,
    layout: "/admin",
  }
];
export default routes;
