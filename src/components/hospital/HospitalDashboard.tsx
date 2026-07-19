import React from 'react';
import BloodStock from './BloodStock';
import BloodRequestForm from './BloodRequestForm';
import { Building2 } from 'lucide-react';

const HospitalDashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                <Building2 className="w-8 h-8 text-red-600" />
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Hospital Portal</h2>
                    <p className="text-sm text-gray-500">Manage blood stock levels and outgoing requests.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left side: Blood Inventory (Takes up 2 columns on larger screens) */}
                <div className="lg:col-span-2">
                    <BloodStock />
                </div>
                
                {/* Right side: Request Form */}
                <div className="lg:col-span-1">
                    <BloodRequestForm />
                </div>
            </div>
        </div>
    );
};

export default HospitalDashboard;