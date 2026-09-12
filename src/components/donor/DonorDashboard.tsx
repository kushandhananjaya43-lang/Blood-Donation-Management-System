import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import type { Donation } from '../../types';
import { Heart, Calendar, Droplet, Loader2, User, Phone, MapPin, Edit3, AlertCircle } from 'lucide-react';
import DonorProfileForm from './DonorProfileForm';

interface HospitalRequest {
    id: string;
    hospital_id: string;
    blood_group: string;
    units_required: number;
    urgency: string;
    status: string;
    created_at?: string;
}

const DonorDashboard: React.FC = () => {
    const { profile, loading: authLoading } = useAuth();
    const [donations, setDonations] = useState<Donation[]>([]);
    const [urgentRequests, setUrgentRequests] = useState<HospitalRequest[]>([]);
    const [showEditForm, setShowEditForm] = useState(false);
    const [stats, setStats] = useState({
        totalDonations: 0,
        totalML: 0,
        lastDonation: '',
    });

    useEffect(() => {
        if (profile?.id) {
            fetchDonations();
            fetchUrgentRequests();
        }
    }, [profile]);

    const fetchDonations = async () => {
        try {
            const { data, error } = await supabase
                .from('donations')
                .select('*')
                .eq('donor_id', profile?.id)
                .order('donation_date', { ascending: false });

            if (!error && data) {
                setDonations(data);
                const totalDonations = data.length;
                const totalML = data.reduce((sum, d) => sum + (d.quantity_ml || 450), 0);
                const lastDonation = data[0]?.donation_date || '';
                setStats({ totalDonations, totalML, lastDonation });
            }
        } catch (error) {
            console.error('Error fetching donations:', error);
        }
    };

    const fetchUrgentRequests = async () => {
        try {
            let query = supabase
                .from('blood_requests')
                .select('*')
                .neq('status', 'fulfilled')
                .order('created_at', { ascending: false })
                .limit(3);

            if (profile?.blood_group) {
                query = query.eq('blood_group', profile.blood_group);
            }

            const { data, error } = await query;
            if (!error && data) {
                setUrgentRequests(data);
            }
        } catch (error) {
            console.error('Error fetching urgent blood requests:', error);
        }
    };

    if (authLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
                <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                <p className="text-sm text-gray-500">Loading donor profile...</p>
            </div>
        );
    }

    const isProfileIncomplete = !profile?.blood_group || !profile?.location || !profile?.phone;

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-red-100 rounded-full">
                        <Heart className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Donations</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.totalDonations}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                        <Droplet className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Blood Donated</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.totalML} ml</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-full">
                        <Calendar className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Last Donation</p>
                        <p className="text-2xl font-bold text-gray-800">
                            {stats.lastDonation ? new Date(stats.lastDonation).toLocaleDateString() : 'Never'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Profile Overview Card / Edit Form Toggle */}
            {isProfileIncomplete || showEditForm ? (
                <DonorProfileForm 
                    onSaveSuccess={() => {
                        setShowEditForm(false);
                        fetchDonations();
                    }} 
                />
            ) : (
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b pb-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Donor Profile Details</h3>
                            <p className="text-xs text-gray-500">Your verified donor credentials</p>
                        </div>
                        <button
                            onClick={() => setShowEditForm(true)}
                            className="flex items-center gap-1.5 text-xs text-red-600 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg font-medium transition-colors"
                        >
                            <Edit3 className="w-3.5 h-3.5" />
                            Edit Profile
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500">Full Name</p>
                            <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5 mt-1">
                                <User className="w-4 h-4 text-gray-400" />
                                {profile?.full_name || 'Not provided'}
                            </p>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500">Phone Number</p>
                            <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5 mt-1">
                                <Phone className="w-4 h-4 text-gray-400" />
                                {profile?.phone || 'Not provided'}
                            </p>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500">Blood Group</p>
                            <p className="text-sm font-semibold text-red-600 flex items-center gap-1.5 mt-1">
                                <Droplet className="w-4 h-4 text-red-500 fill-red-500" />
                                {profile?.blood_group || 'Not selected'}
                            </p>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500">City / Location</p>
                            <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5 mt-1">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                {profile?.location || 'Not provided'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Urgent Hospital Requests */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        Urgent Blood Requests {profile?.blood_group && `(${profile.blood_group})`}
                    </h3>
                </div>

                {urgentRequests.length === 0 ? (
                    <p className="text-gray-400 text-center py-6 text-sm">No matching urgent hospital blood requests right now.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {urgentRequests.map((req) => (
                            <div key={req.id} className="p-4 border border-red-100 bg-red-50/30 rounded-xl space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-red-600 text-lg">{req.blood_group}</span>
                                    <span className="text-xs uppercase bg-red-100 text-red-700 px-2 py-0.5 rounded font-semibold">
                                        {req.urgency || 'Urgent'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 font-medium">{req.units_required} units required</p>
                                <p className="text-xs text-gray-500 capitalize">Status: {req.status}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recent Donations */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Donations</h3>
                <div className="space-y-3">
                    {donations.length === 0 ? (
                        <p className="text-gray-400 text-center py-6 text-sm">No donations logged yet.</p>
                    ) : (
                        donations.slice(0, 5).map((donation) => (
                            <div
                                key={donation.id}
                                className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">Blood Group: {donation.blood_type || profile?.blood_group}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {donation.donation_date ? new Date(donation.donation_date).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                        {donation.quantity_ml || 450} ml
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default DonorDashboard;