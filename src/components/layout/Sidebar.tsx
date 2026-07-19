import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Building2, 
    User, 
    LogOut, 
    Menu, 
    X, 
    Droplet 
} from 'lucide-react';

interface SidebarProps {
    // We will make this dynamic later based on real auth roles ('donor' | 'hospital')
    userRole?: 'donor' | 'hospital';
}

const Sidebar: React.FC<SidebarProps> = ({ userRole = 'donor' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    // Dynamic navigation links based on user role
    const donorLinks = [
        { label: 'Donor Dashboard', path: '/donor-dashboard', icon: LayoutDashboard },
    ];

    const hospitalLinks = [
        { label: 'Hospital Portal', path: '/hospital-dashboard', icon: Building2 },
    ];

    const links = userRole === 'hospital' ? hospitalLinks : donorLinks;

    const handleLogout = () => {
        // Mock logout for now
        alert('Logging out...');
        navigate('/login');
    };

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile Header Toggle */}
            <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-2 font-bold text-red-600 text-lg">
                    <Droplet className="fill-current w-5 h-5" />
                    <span>RedHope</span>
                </div>
                <button onClick={toggleSidebar} className="p-1 rounded-md text-gray-600 hover:bg-gray-100">
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Sidebar Desktop Wrapper */}
            <div className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out flex flex-col justify-between
                md:translate-x-0 md:sticky md:h-screen
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Upper Branding & Navigation Section */}
                <div>
                    {/* Header Logo */}
                    <div className="hidden md:flex items-center gap-2 p-6 font-bold text-red-600 text-xl border-b border-gray-50">
                        <Droplet className="fill-current w-6 h-6" />
                        <span>RedHope</span>
                    </div>

                    {/* Navigation Items */}
                    <nav className="p-4 space-y-1">
                        {links.map((link) => {
                            const Icon = link.icon;
                            const isActive = location.pathname === link.path;
                            return (
                                <button
                                    key={link.path}
                                    onClick={() => {
                                        navigate(link.path);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                        isActive 
                                            ? 'bg-red-50 text-red-600' 
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {link.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer Controls Section */}
                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Mobile Overlay Background Drop shadow */}
            {isOpen && (
                <div 
                    onClick={toggleSidebar} 
                    className="fixed inset-0 bg-black/20 z-30 md:hidden transition-opacity"
                />
            )}
        </>
    );
};

export default Sidebar;