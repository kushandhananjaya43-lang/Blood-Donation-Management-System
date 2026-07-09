import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import type { Donation } from '../../types';
import { Heart, Calendar, Droplet } from 'lucide-react';

const DonorDashboard: React.FC = () => {
    const { profile } = useAuth();
    const [donations, setDonations] = useState<Donation[]>([]);
    const [stats, setStats] = useState({
        totalDonations: 0,
        totalML: 0,
        lastDonation: '',
    });

    useEffect(() => {
        if (profile?.id) {
            fetchDonations();
        }
    }, [profile]);

    const fetchDonations = async () => {
        try {
            const { data, error } = await supabase
                .from('donations')
                .select('*')
                .eq('donor_id', profile?.id)
                .order('donation_date', { ascending: false });

            if (error) throw error;
            setDonations(data || []);

            // Calculate stats
            const totalDonations = data?.length || 0;
            const totalML = data?.reduce((sum, d) => sum + d.quantity_ml, 0) || 0;
            const lastDonation = data?.[0]?.donation_date || '';

            setStats({ totalDonations, totalML, lastDonation });
        } catch (error) {
            console.error('Error fetching donations:', error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-red-100 rounded-full">
                            <Heart className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Donations</p>
                            <p className="text-2xl font-bold">{stats.totalDonations}</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Droplet className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Blood Donated</p>
                            <p className="text-2xl font-bold">{stats.totalML} ml</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 rounded-full">
                            <Calendar className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Last Donation</p>
                            <p className="text-2xl font-bold">
                                {stats.lastDonation ? new Date(stats.lastDonation).toLocaleDateString() : 'Never'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Donations */}
            <div className="card">
                <h3 className="text-lg font-semibold mb-4">Recent Donations</h3>
                <div className="space-y-3">
                    {donations.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No donations yet</p>
                    ) : (
                        donations.slice(0, 5).map((donation) => (
                            <div
                                key={donation.id}
                                className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
                            >
                                <div>
                                    <p className="font-medium">Blood Type: {donation.blood_type}</p>
                                    <p className="text-sm text-gray-600">
                                        {new Date(donation.donation_date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        {donation.quantity_ml} ml
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