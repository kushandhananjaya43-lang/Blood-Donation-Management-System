import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { User, Phone, MapPin, Activity, Loader2, Edit3, Droplet, Mail } from 'lucide-react';

const DonorProfileForm: React.FC<{ onSaveSuccess?: () => void }> = ({ onSaveSuccess }) => {
    const { profile, loading: authLoading, refreshProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        bloodType: '',
        city: '',
    });

    useEffect(() => {
        const loadInitialData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            const userEmail = profile?.email || user?.email || '';

            if (profile || user) {
                setFormData({
                    fullName: profile?.full_name || '',
                    email: userEmail,
                    phone: profile?.phone || '',
                    bloodType: profile?.blood_group || '',
                    city: profile?.location || '',
                });

                // Show read-only view if user already has saved details in Supabase
                const hasSavedData = Boolean(profile?.blood_group || profile?.location || profile?.full_name || profile?.phone);
                
                if (hasSavedData || hasSubmitted) {
                    setIsEditing(false);
                } else {
                    setIsEditing(true);
                }
            }
        };

        loadInitialData();
    }, [profile, hasSubmitted]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        const userId = profile?.id || user?.id;
        const userEmail = formData.email || profile?.email || user?.email;

        if (authError || !userId) {
            setMessage({ type: 'error', text: 'User session not found. Please log in again.' });
            return;
        }

        setLoading(true);

        try {
            const updates = {
                id: userId,
                email: userEmail,
                role: profile?.role || 'donor',
                full_name: formData.fullName,
                phone: formData.phone,
                blood_group: formData.bloodType,
                location: formData.city,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase
                .from('profiles')
                .upsert(updates);

            if (error) throw error;

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setHasSubmitted(true);
            setIsEditing(false);

            if (refreshProfile) {
                await refreshProfile();
            }

            if (onSaveSuccess) {
                onSaveSuccess();
            }
        } catch (error: any) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: error.message || 'Failed to update details.' });
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin text-red-600 mb-2" />
                <p className="text-sm">Loading profile data...</p>
            </div>
        );
    }

    // Read-Only Profile View
    if (!isEditing) {
        return (
            <div className="card max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b pb-4">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Activity className="w-6 h-6 text-red-600" />
                        Donor Profile Details
                    </h3>
                    <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 text-sm text-red-600 border border-red-200 hover:bg-red-50 font-medium py-1.5 px-3 rounded-lg transition-colors"
                    >
                        <Edit3 className="w-4 h-4" />
                        Edit Profile
                    </button>
                </div>

                {message && (
                    <div className="p-4 rounded-lg text-sm bg-green-50 text-green-800 border border-green-200">
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 font-medium">Full Name</p>
                        <p className="text-base font-semibold text-gray-800 flex items-center gap-2 mt-1">
                            <User className="w-4 h-4 text-gray-400" />
                            {profile?.full_name || formData.fullName || 'Not provided'}
                        </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 font-medium">Email Address</p>
                        <p className="text-base font-semibold text-gray-800 flex items-center gap-2 mt-1 truncate">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {formData.email || 'Not provided'}
                        </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 font-medium">Phone Number</p>
                        <p className="text-base font-semibold text-gray-800 flex items-center gap-2 mt-1">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {profile?.phone || formData.phone || 'Not provided'}
                        </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 font-medium">Blood Group</p>
                        <p className="text-base font-semibold text-red-600 flex items-center gap-2 mt-1">
                            <Droplet className="w-4 h-4 text-red-500 fill-red-500" />
                            {profile?.blood_group || formData.bloodType || 'Not selected'}
                        </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                        <p className="text-xs text-gray-500 font-medium">City / Location</p>
                        <p className="text-base font-semibold text-gray-800 flex items-center gap-2 mt-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {profile?.location || formData.city || 'Not provided'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Editable Input Form
    return (
        <div className="card max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Activity className="w-6 h-6 text-red-600" />
                    {profile?.blood_group ? 'Update Profile Details' : 'Complete Donor Registration'}
                </h3>
                {(profile?.blood_group || hasSubmitted) && (
                    <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="text-xs text-gray-500 hover:text-gray-700 underline"
                    >
                        Cancel
                    </button>
                )}
            </div>

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none disabled:bg-gray-50"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                disabled={true} // Email managed by Auth session
                                className="pl-10 w-full p-2 border border-gray-200 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed outline-none"
                                placeholder="user@example.com"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none disabled:bg-gray-50"
                                placeholder="+94 XX XXX XXXX"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                        <select
                            name="bloodType"
                            value={formData.bloodType}
                            onChange={handleChange}
                            disabled={loading}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white disabled:bg-gray-50"
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
                            className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none disabled:bg-gray-50"
                            placeholder="e.g., Colombo"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4 h-10 disabled:bg-red-400"
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