import React from 'react';

const CampaignDashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Campaign Organization Dashboard</h1>
          <p className="text-gray-600">Manage blood donation drives, schedule venues, and track donor registrations.</p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Active Campaigns</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">3</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total Registered Donors</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">142</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Collected Blood Units</p>
          <p className="text-3xl font-bold text-red-600 mt-2">85</p>
        </div>
      </div>

      {/* Active Campaigns Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Blood Drives</h2>
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
              <tr>
                <td className="py-3 px-4 font-medium">City Center Blood Drive</td>
                <td className="py-3 px-4">Community Hall, Main St.</td>
                <td className="py-3 px-4">2026-04-15</td>
                <td className="py-3 px-4">50 units</td>
                <td className="py-3 px-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Scheduled</span></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">University Campus Drive</td>
                <td className="py-3 px-4">Student Center Gym</td>
                <td className="py-3 px-4">2026-04-22</td>
                <td className="py-3 px-4">100 units</td>
                <td className="py-3 px-4"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">Pending Partner</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CampaignDashboard;