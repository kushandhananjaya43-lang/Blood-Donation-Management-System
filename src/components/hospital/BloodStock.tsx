import React from 'react';
import { Droplet, AlertTriangle } from 'lucide-react';

// Mock inventory data for visual layout
const MOCK_STOCK = [
    { bloodType: 'O+', quantityBag: 12, status: 'Good' },
    { bloodType: 'A+', quantityBag: 8, status: 'Good' },
    { bloodType: 'B+', quantityBag: 3, status: 'Low' },
    { bloodType: 'AB+', quantityBag: 1, status: 'Critical' },
    { bloodType: 'O-', quantityBag: 0, status: 'Out of Stock' },
];

const BloodStock: React.FC = () => {
    return (
        <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Droplet className="w-5 h-5 text-red-600" />
                Blood Inventory Status
            </h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Blood Type</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stock (Bags)</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {MOCK_STOCK.map((item) => (
                            <tr key={item.bloodType}>
                                <td className="px-4 py-3 font-semibold text-gray-800">{item.bloodType}</td>
                                <td className="px-4 py-3 text-gray-600">{item.quantityBag} bags</td>
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        item.status === 'Good' ? 'bg-green-100 text-green-800' :
                                        item.status === 'Low' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {item.status !== 'Good' && <AlertTriangle className="w-3 h-3 mr-1" />}
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BloodStock;