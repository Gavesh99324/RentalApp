 import { usePathname } from 'next/navigation'
import React from 'react'
import { useSidebar } from './ui/sidebar';
import { Building, FileText, Settings } from 'lucide-react';
 
 const AppSidebar = ({ userType }: AppSidebarProps) => {
    const pathname = usePathname();
    const { toggleSidebar, open } = useSidebar();

    const navLinks = 
    userType === "manager"
    ? [
        {icon: Building, label: "Properties", href: "/managers/properties" },
        {icon: FileText, label: "Applications", href: "/managers/applications"},
        {icon: Settings, label: "Settings", href: "/managers/settings"}
    ]
     : []

   return (
     <div>
       Appsidebar
     </div>
   )
 }
 
 export default AppSidebar
 