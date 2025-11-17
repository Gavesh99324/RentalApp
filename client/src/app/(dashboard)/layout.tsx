import React from 'react';
import Navbar from '@/components/Navbar';
import { NAVBAR_HEIGHT } from '@/lib/constants';

const DashboardLayout = () => {
  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: `${NAVBAR_HEIGHT}`}}>

      </div>
    </div>
  )
}

export default DashboardLayout;
