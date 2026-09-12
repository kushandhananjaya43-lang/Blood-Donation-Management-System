import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BloodStock from './BloodStock';
import { Building2, PlusCircle, Package, Clock, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase'; // Adjust relative path as needed

const HospitalDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [recentRequests, setRecentRequests] = useState<any[]>([]);
    const [loadingRequests, setLoadingRequests] = useState(true);
    const [stats, setStats] = useState({
        inventoryStatus: 'Active Monitoring',
        criticalShortages: 'None',
        requestCount: 0,
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoadingRequests(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                // 1. Fetch live requests for the logged-in hospital
                const { data: requests, error } = await supabase
                    .from('blood_requests')
                    .select('*')
                    .eq('hospital_id', user.id)
                    .order('created_at', { ascending: false });

                if (!error && requests) {
                    setRecentRequests(requests.slice(0, 5)); // Get last 5 for display

                    // 2. Dynamically calculate shortage alerts based on pending critical requests
                    const criticalTypes = Array.from(
                        new Set(
                            requests
                                .filter((r) => r.urgency === 'Critical' || r.urgency === 'Urgent')
                                .map((r) => r.blood_group)
                        )
                    );

                    setStats({
                        inventoryStatus: requests.length > 0 ? 'Active Monitoring' : 'Optimal',
                        criticalShortages: criticalTypes.length > 0 ? criticalTypes.join(' / ') : 'None',
                        requestCount: requests.length,
                    });
                }
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoadingRequests(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header with Quick Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
                <div className="flex items-center gap-3">
                    <Building2 className="w-8 h-8 text-red-600 shrink-0" />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Hospital Portal</h2>
                        <p className="text-sm text-gray-500">Manage blood stock levels and view outgoing requests.</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/hospital/request')}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors self-start sm:self-auto"
                >
                    <PlusCircle className="w-5 h-5" />
                    <span>New Blood Request</span>
                </button>
            </div>

            {/* Dynamic KPI Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase">Inventory Status</p>
                        <h4 className="text-lg font-bold text-gray-800">{stats.inventoryStatus}</h4>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase">Critical Shortages</p>
                        <h4 className="text-lg font-bold text-gray-800">{stats.criticalShortages}</h4>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase">Recent Activity</p>
                        <h4 className="text-lg font-bold text-gray-800">
                            {stats.requestCount} {stats.requestCount === 1 ? 'Request Filed' : 'Requests Filed'}
                        </h4>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left side: Blood Inventory */}
                <div className="lg:col-span-2">
                    <BloodStock />
                </div>
                
                {/* Right side: Live Recent Outgoing Requests Summary */}
                <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-red-600" />
                                Recent Requests
                            </h3>
                            <button
                                onClick={() => navigate('/hospital/request')}
                                className="text-xs text-red-600 hover:underline font-medium"
                            >
                                View / Request
                            </button>
                        </div>

                        {loadingRequests ? (
                            <p className="text-sm text-gray-400 py-4 text-center">Loading requests...</p>
                        ) : recentRequests.length > 0 ? (
                            <div className="space-y-3">
                                {recentRequests.map((req) => (
                                    <div key={req.id} className="p-3 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-100">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-gray-800">{req.blood_group}</span>
                                                <span className="text-xs text-gray-500">({req.units_required} bags)</span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-0.5">{req.urgency} urgency</p>
                                        </div>
                                        <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-amber-50 text-amber-700 border border-amber-200 capitalize">
                                            {req.status || 'pending'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400 text-sm">
                                No emergency requests submitted yet.
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => navigate('/hospital/request')}
                        className="w-full mt-4 py-2 border border-dashed border-gray-300 hover:border-red-500 text-gray-600 hover:text-red-600 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
                    >
                        <PlusCircle className="w-4 h-4" />
                        Create Emergency Request
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HospitalDashboard;