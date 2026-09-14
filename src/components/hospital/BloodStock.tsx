import React, { useState, useEffect } from 'react';
import { Droplet, AlertTriangle, Edit2, Check, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface BloodStockItem {
    bloodType: string;
    quantityBag: number;
    status: string;
}

const INITIAL_STOCK: BloodStockItem[] = [
    { bloodType: 'O+', quantityBag: 0, status: 'Out of Stock' },
    { bloodType: 'O-', quantityBag: 0, status: 'Out of Stock' },
    { bloodType: 'A+', quantityBag: 0, status: 'Out of Stock' },
    { bloodType: 'A-', quantityBag: 0, status: 'Out of Stock' },
    { bloodType: 'B+', quantityBag: 0, status: 'Out of Stock' },
    { bloodType: 'B-', quantityBag: 0, status: 'Out of Stock' },
    { bloodType: 'AB+', quantityBag: 0, status: 'Out of Stock' },
    { bloodType: 'AB-', quantityBag: 0, status: 'Out of Stock' },
];

// Custom threshold status evaluator
const getStockStatus = (qty: number): string => {
    if (qty === 0) return 'Out of Stock';
    if (qty < 10) return 'Critical';
    if (qty <= 25) return 'Low';
    return 'Good';
};

const BloodStock: React.FC = () => {
    const [stock, setStock] = useState<BloodStockItem[]>(INITIAL_STOCK);
    const [editingType, setEditingType] = useState<string | null>(null);
    const [tempValue, setTempValue] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchStock();
    }, []);

    const fetchStock = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('hospital_stock')
                .select('*')
                .eq('hospital_id', user.id);

            if (!error && data && data.length > 0) {
                const updated = INITIAL_STOCK.map(item => {
                    const found = data.find(d => d.blood_type === item.bloodType);
                    const qty = found ? found.quantity_bags : 0;
                    return {
                        bloodType: item.bloodType,
                        quantityBag: qty,
                        status: getStockStatus(qty)
                    };
                });
                setStock(updated);
            }
        } catch (err) {
            console.error('Error fetching stock:', err);
        }
    };

    const handleSaveEdit = async (bloodType: string) => {
        const qty = parseInt(tempValue, 10);
        if (isNaN(qty) || qty < 0) {
            alert('Please enter a valid positive number');
            return;
        }

        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase
                .from('hospital_stock')
                .upsert({
                    hospital_id: user.id,
                    blood_type: bloodType,
                    quantity_bags: qty,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'hospital_id,blood_type' });

            if (error) throw error;

            setStock(prev => prev.map(item => {
                if (item.bloodType === bloodType) {
                    return {
                        ...item,
                        quantityBag: qty,
                        status: getStockStatus(qty)
                    };
                }
                return item;
            }));

            setEditingType(null);
            setTempValue('');

            // Dispatches window event so parent dashboard updates shortage stats automatically
            window.dispatchEvent(new Event('stockUpdated'));
        } catch (err: any) {
            console.error('Error updating stock:', err);
            alert('Failed to update stock: ' + (err.message || 'Database error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                    <Droplet className="w-5 h-5 text-red-600" />
                    Blood Inventory Status
                </h3>
                <span className="text-xs text-gray-400">Click edit icon to adjust inventory</span>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Blood Type</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stock (Bags)</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {stock.map((item) => (
                            <tr key={item.bloodType} className="hover:bg-gray-50/50">
                                <td className="px-4 py-3 font-bold text-gray-800">{item.bloodType}</td>
                                <td className="px-4 py-3 text-gray-600 font-medium">
                                    {editingType === item.bloodType ? (
                                        <input
                                            type="number"
                                            value={tempValue}
                                            onChange={(e) => setTempValue(e.target.value)}
                                            className="w-20 px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-red-500 outline-none"
                                            autoFocus
                                        />
                                    ) : (
                                        `${item.quantityBag} bags`
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        item.status === 'Good' ? 'bg-green-100 text-green-800' :
                                        item.status === 'Low' ? 'bg-yellow-100 text-yellow-800' :
                                        item.status === 'Critical' ? 'bg-orange-100 text-orange-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {item.status !== 'Good' && <AlertTriangle className="w-3 h-3 mr-1" />}
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    {editingType === item.bloodType ? (
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => handleSaveEdit(item.bloodType)}
                                                disabled={loading}
                                                className="p-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                                                title="Save"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setEditingType(null)}
                                                className="p-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                                                title="Cancel"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setEditingType(item.bloodType);
                                                setTempValue(item.quantityBag.toString());
                                            }}
                                            className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
                                            title="Edit Stock"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    )}
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