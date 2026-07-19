import React from 'react';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
    children: React.ReactNode;
    userRole?: 'donor' | 'hospital';
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, userRole = 'donor' }) => {
    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
            {/* Sidebar persistent left structure */}
            <Sidebar userRole={userRole} />

            {/* Core Viewport Content canvas */}
            <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;