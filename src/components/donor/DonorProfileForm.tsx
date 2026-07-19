import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { User, Phone, MapPin, Activity, Loader2 } from 'lucide-react';

const DonorProfileForm: React.FC<{ onSaveSuccess?: () => void }> = ({ onSaveSuccess }) => {
    const { profile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [formData, setFormData] = useState({
        fullName: profile?.full_name || '',
        phone: '',
        bloodType: '',
        city: '',
        weight: '',
        hasConditions: 'no',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile?.id) return;

        setMessage(null);

        // 1. Frontend validation guards
        const parsedWeight = parseFloat(formData.weight);
        if (isNaN(parsedWeight) || parsedWeight < 45) {
            setMessage({ type: 'error', text: 'Minimum weight requirement for blood donation is 45 kg.' });
            return;
        }
        if (parsedWeight > 250) {
            setMessage({ type: 'error', text: 'Please enter a realistic weight value.' });
            return;
        }

        // Clean up phone string to check baseline length
        const cleanPhone = formData.phone.trim();
        if (cleanPhone.length < 9) {
            setMessage({ type: 'error', text: 'Please enter a valid phone number (minimum 9 digits).' });
            return;
        }

        setLoading(true);

        try {
            // Update the profile or donor details inside Supabase
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.fullName,
                    phone: cleanPhone,
                    blood_type: formData.bloodType,
                    city: formData.city,
                    weight: parsedWeight,
                    has_medical_conditions: formData.hasConditions === 'yes',
                    updated_at: new Date().toISOString(),
                })
                .eq('id', profile.id);

            if (error) throw error;

            setMessage({ type: 'success', text: 'Profile metrics updated successfully!' });
            if (onSaveSuccess) onSaveSuccess();
        } catch (error: any) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: error.message || 'Failed to update details.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-red-600" />
                Complete Donor Registration
            </h3>

            {message && (
                <div className={`p-4 mb-4 rounded-lg text-sm ${
                    message.type === 'success' 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            disabled={loading}
                            required
                            className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                            placeholder="John Doe"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Contact Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={loading}
                                required
                                className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                                placeholder="+94 XX XXX XXXX"
                            />
                        </div>
                    </div>

                    {/* Blood Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                        <select
                            name="bloodType"
                            value={formData.bloodType}
                            onChange={handleChange}
                            disabled={loading}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                        >
                            <option value="">Select Group</option>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Location/City */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City / Location</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                disabled={loading}
                                required
                                className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                                placeholder="e.g., Colombo"
                            />
                        </div>
                    </div>

                    {/* Weight */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                        <input
                            type="number"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            disabled={loading}
                            required
                            min="45"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                            placeholder="e.g., 65"
                        />
                    </div>
                </div>

                {/* Medical Conditions Toggle */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Do you have any chronic medical conditions or take regular medications?
                    </label>
                    <div className="flex gap-4 mt-1">
                        <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                            <input
                                type="radio"
                                name="hasConditions"
                                value="no"
                                checked={formData.hasConditions === 'no'}
                                onChange={handleChange}
                                disabled={loading}
                                className="text-red-600 focus:ring-red-500 disabled:opacity-50"
                            />
                            No
                        </label>
                        <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                            <input
                                type="radio"
                                name="hasConditions"
                                value="yes"
                                checked={formData.hasConditions === 'yes'}
                                onChange={handleChange}
                                disabled={loading}
                                className="text-red-600 focus:ring-red-500 disabled:opacity-50"
                            />
                            Yes
                        </label>
                    </div>
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed mt-4 h-10"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Saving Profile Details...</span>
                        </>
                    ) : (
                        <span>Save Profile Details</span>
                    )}
                </button>
            </form>
        </div>
    );
};

export default DonorProfileForm;