import React from 'react';
import * as AiIcons from "react-icons/ai";

export const SidebarData = [
  {
    title: 'Predict',
    path: '/predict',
    icon: <AiIcons.AiFillFileText className='sidebar-icon'/>,
    cName: 'nav-text'
  },
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <AiIcons.AiFillDashboard className='sidebar-icon'/>,
    cName: 'nav-text'
  }
]