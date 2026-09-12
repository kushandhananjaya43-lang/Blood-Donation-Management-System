import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const CampaignDashboard: React.FC = () => {
  const [drives, setDrives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    totalTargetUnits: 0,
    scheduledDrivesCount: 0,
  });

  useEffect(() => {
    fetchCampaignDrives();
  }, []);

  const fetchCampaignDrives = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('campaign_drives')
          .select('*')
          .eq('organizer_id', user.id)
          .order('drive_date', { ascending: true });

        if (!error && data) {
          setDrives(data);

          // Calculate totals based on exact table columns
          const totalDrives = data.length;
          const targetUnitsSum = data.reduce((sum, item) => sum + Number(item.target_donations || 0), 0);

          setStats({
            activeCampaigns: totalDrives,
            totalTargetUnits: targetUnitsSum,
            scheduledDrivesCount: totalDrives,
          });
        }
      }
    } catch (err) {
      console.error('Error fetching campaign drives:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Campaign Organization Dashboard</h1>
          <p className="text-gray-600">Manage blood donation drives, schedule venues, and track donor registrations.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Active Campaigns</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.activeCampaigns}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total Target Units</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalTargetUnits}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Scheduled Drives</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{stats.scheduledDrivesCount}</p>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Blood Drives</h2>
        
        {loading ? (
          <p className="text-sm text-gray-400 py-4 text-center">Loading campaign drives...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-sm">
                  <th className="py-3 px-4">Drive Name</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Target Units</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
                {drives.length > 0 ? (
                  drives.map((drive) => (
                    <tr key={drive.id}>
                      <td className="py-3 px-4 font-medium">{drive.title || 'Blood Drive'}</td>
                      <td className="py-3 px-4">{drive.location || 'N/A'}</td>
                      <td className="py-3 px-4">{drive.drive_date || 'N/A'}</td>
                      <td className="py-3 px-4">{drive.target_donations ?? 0} units</td>
                      <td className="py-3 px-4">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                          Scheduled
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-400">
                      No campaign drives found. Schedule one to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignDashboard;