import React from 'react';
import * as AiIcons from "react-icons/ai";

export const SidebarData = [
  {
    title: 'Predict',
    path: '/Predict',
    icon: <AiIcons.AiFillFileText className='sidebar-icon'/>,
    cName: 'nav-text'
  },
  {
    title: 'Dashboard',
    path: '/Dashboard',
    icon: <AiIcons.AiFillDashboard className='sidebar-icon'/>,
    cName: 'nav-text'
  }
]