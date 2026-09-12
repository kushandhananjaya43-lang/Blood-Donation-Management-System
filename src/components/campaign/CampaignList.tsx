import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { Calendar, MapPin, Users, HeartHandshake, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface Campaign {
  id: string;
  title: string;
  organizer_id?: string;
  location: string;
  drive_date: string;
  target_donations: number;
  status?: string;
  created_at?: string;
}

const CampaignList: React.FC = () => {
  const { profile } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const userId = profile?.id;

  // Fetch campaigns and user registrations whenever the userId becomes available
  useEffect(() => {
    fetchCampaigns();
  }, [userId]);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      // 1. Fetch campaigns from campaign_drives
      const { data, error } = await supabase
        .from('campaign_drives')
        .select('*')
        .order('drive_date', { ascending: true });

      if (error) throw error;

      // Filter out past campaigns (keeping only today or future dates)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcomingCampaigns = (data || []).filter((c) => {
        if (!c.drive_date) return false;
        const driveDate = new Date(c.drive_date);
        return driveDate >= today;
      });

      setCampaigns(upcomingCampaigns);

      // 2. Fetch existing registrations for this donor
      if (userId) {
        const { data: regData, error: regError } = await supabase
          .from('donations')
          .select('campaign_id')
          .eq('donor_id', userId);

        if (regError) throw regError;

        if (regData) {
          const registered = regData
            .map((r) => r.campaign_id)
            .filter(Boolean) as string[];
          setRegisteredIds(registered);
        }
      }
    } catch (err: any) {
      console.error('Error fetching campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (campaign: Campaign) => {
    if (!userId) {
      setMessage({ type: 'error', text: 'Please log in to register for campaigns.' });
      return;
    }

    setRegisteringId(campaign.id);
    setMessage(null);

    try {
      const { error } = await supabase.from('donations').insert({
        donor_id: userId,
        campaign_id: campaign.id,
        amount_ml: 450,
        donation_date: campaign.drive_date,
        status: 'registered',
      });

      if (error) throw error;

      setRegisteredIds((prev) => [...prev, campaign.id]);
      setMessage({ type: 'success', text: `Successfully registered for "${campaign.title}"!` });
    } catch (err: any) {
      console.error('Error registering for campaign:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to register. Please try again.' });
    } finally {
      setRegisteringId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
        <p className="text-sm text-gray-500">Loading blood campaigns...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Upcoming Blood Campaigns</h1>
        <p className="text-gray-600">Find blood drives near you and register to save lives.</p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {campaigns.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center space-y-2">
          <p className="text-gray-500 font-medium">No active blood drives found.</p>
          <p className="text-xs text-gray-400">Check back later for new upcoming campaigns in your area.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campaigns.map((c) => {
            const isRegistered = registeredIds.includes(c.id);
            const isRegistering = registeringId === c.id;

            return (
              <div
                key={c.id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-bold text-gray-800">{c.title}</h2>
                    <span className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-full font-semibold">
                      {c.status || 'Upcoming'}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{c.location || 'Location Pending'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>
                        {c.drive_date ? new Date(c.drive_date).toLocaleDateString() : 'Date TBD'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>Target Goal: {c.target_donations || 0} units</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleRegister(c)}
                  disabled={isRegistered || isRegistering}
                  className={`w-full text-sm font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition ${
                    isRegistered
                      ? 'bg-green-50 text-green-700 border border-green-200 cursor-default'
                      : 'bg-red-600 hover:bg-red-700 text-white disabled:bg-red-300'
                  }`}
                >
                  {isRegistering ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Registering...</span>
                    </>
                  ) : isRegistered ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Registered</span>
                    </>
                  ) : (
                    <>
                      <HeartHandshake className="w-4 h-4" />
                      <span>Register as Donor</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CampaignList;