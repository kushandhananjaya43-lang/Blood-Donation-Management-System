import React, { useState } from 'react';
import { PlusCircle, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase'; // Ensure this path correctly targets your Supabase client instance

const BloodRequestForm: React.FC = () => {
    const [formData, setFormData] = useState({
        bloodType: '',
        bagsRequired: '',
        urgency: 'Normal',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        // 1. Frontend validation guards
        const bags = parseInt(formData.bagsRequired, 10);
        if (isNaN(bags) || bags <= 0) {
            setErrorMsg('Please enter a valid number of blood bags (minimum 1).');
            return;
        }
        if (bags > 50) {
            setErrorMsg('For requests greater than 50 bags, please contact the central blood bank directly.');
            return;
        }
        if (!formData.bloodType) {
            setErrorMsg('Please select a target blood group.');
            return;
        }

        setIsLoading(true);
        try {
            // 2. Fetch authenticated user session
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                throw new Error('User session not found. Please log in again.');
            }

            // 3. Insert record into Supabase blood_requests table
            const { error } = await supabase
                .from('blood_requests')
                .insert([
                    {
                        hospital_id: user.id,
                        blood_group: formData.bloodType,
                        units_required: bags,
                        urgency: formData.urgency,
                        status: 'pending',
                    }
                ]);

            if (error) throw error;

            alert(`Emergency request for ${bags} bags of ${formData.bloodType} registered successfully!`);
            
            // Reset form back to initial clean state
            setFormData({ bloodType: '', bagsRequired: '', urgency: 'Normal' });

        } catch (err: any) {
            console.error('Error submitting blood request:', err);
            setErrorMsg(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-red-600" />
                Request Emergency Blood Supply
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error Banner Alert */}
                {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2 animate-fadeIn">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{errorMsg}</span>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Required Blood Group</label>
                    <select
                        value={formData.bloodType}
                        onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                        disabled={isLoading}
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-red-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        <option value="">Select Type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (Bags)</label>
                    <input
                        type="number"
                        min="1"
                        value={formData.bagsRequired}
                        onChange={(e) => setFormData({ ...formData, bagsRequired: e.target.value })}
                        disabled={isLoading}
                        required
                        placeholder="e.g., 5"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Urgency Level</label>
                    <select
                        value={formData.urgency}
                        onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                        disabled={isLoading}
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-red-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        <option value="Normal">Normal (Stock replenishment)</option>
                        <option value="Urgent">Urgent (Surgery planned)</option>
                        <option value="Critical">Critical (Immediate life threat)</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Processing Request...</span>
                        </>
                    ) : (
                        <span>Submit Request</span>
                    )}
                </button>
            </form>
        </div>
    );
};

export default BloodRequestForm;