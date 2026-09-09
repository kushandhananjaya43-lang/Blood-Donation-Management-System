import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  Database, 
  FilePlus, 
  Megaphone, 
  PlusCircle, 
  Calendar,
  LogOut 
} from 'lucide-react';

interface SidebarProps {
  userRole: 'donor' | 'hospital' | 'campaign';
}

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col justify-between p-5 sticky top-0 shrink-0">
      <div className="space-y-6">
        {/* Centered & Proportional Brand Header */}
        <div className="flex flex-col items-center text-center pb-4 border-b border-gray-100">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-2 shadow-sm">
            <span className="text-xl">🩸</span>
          </div>
          <h1 className="text-lg font-bold text-gray-800 tracking-tight">BloodNet</h1>
          <p className="text-xs text-gray-400 font-medium capitalize mt-0.5">{userRole} Portal</p>
        </div>

        {/* Dynamic Navigation Links */}
        <nav className="space-y-1">
          {/* DONOR NAVIGATION */}
          {userRole === 'donor' && (
            <>
              <NavLink
                to="/donor-dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </NavLink>

              <NavLink
                to="/donor/profile"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <User className="w-4 h-4" />
                My Profile
              </NavLink>

              <NavLink
                to="/campaigns"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <Calendar className="w-4 h-4" />
                Blood Campaigns
              </NavLink>
            </>
          )}

          {/* HOSPITAL NAVIGATION */}
          {userRole === 'hospital' && (
            <>
              <NavLink
                to="/hospital-dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </NavLink>

              <NavLink
                to="/hospital/stock"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <Database className="w-4 h-4" />
                Blood Stock
              </NavLink>

              <NavLink
                to="/hospital/request"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <FilePlus className="w-4 h-4" />
                Request Blood
              </NavLink>
            </>
          )}

          {/* CAMPAIGN NAVIGATION */}
          {userRole === 'campaign' && (
            <>
              <NavLink
                to="/campaign-dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <Megaphone className="w-4 h-4" />
                Dashboard
              </NavLink>

              <NavLink
                to="/campaign/create"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <PlusCircle className="w-4 h-4" />
                Schedule Drive
              </NavLink>
            </>
          )}
        </nav>
      </div>

      {/* Logout Link */}
      <div className="border-t border-gray-100 pt-4">
        <NavLink
          to="/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;