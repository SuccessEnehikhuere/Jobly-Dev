import { AreaChart, Layers, AppWindow } from 'lucide-react'
import React from 'react'


const links = [
  {
    href: '/add-job',
    label: 'add-job',
    icon: <Layers />,
  },
  {
    href: '/jobs',
    label: 'all jobs',
    icon: <AppWindow />,
  },
  {
    href: '/stats',
    label: 'stats',
    icon: <AreaChart />,
  },
]

export default links