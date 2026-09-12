import React, { useState } from 'react';
import { Calendar, MapPin, Target, Building2, PlusCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase'; // Ensure this relative path matches your supabase client location

const CreateCampaignForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [targetUnits, setTargetUnits] = useState('');
  const [hospital, setHospital] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Fetch current authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User session not found. Please log in again.');
      }

      // 2. Insert into campaign_drives table matching schema columns
      const { error } = await supabase
        .from('campaign_drives')
        .insert([
          {
            organizer_id: user.id,
            title: title,
            location: location,
            drive_date: date,
            target_donations: parseInt(targetUnits, 10),
          }
        ]);

      if (error) throw error;

      alert('Campaign scheduled successfully!');

      // 3. Clear all input fields back to empty state
      setTitle('');
      setLocation('');
      setDate('');
      setTargetUnits('');
      setHospital('');

    } catch (error: any) {
      console.error('Error saving campaign:', error);
      alert(`Failed to schedule campaign: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-100 my-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
          <PlusCircle className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Schedule New Blood Drive</h1>
          <p className="text-sm text-gray-500">Create a campaign to collect blood donations from local donors.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Title</label>
          <input
            type="text"
            required
            disabled={loading}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Annual Community Blood Drive"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Venue / Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              required
              disabled={loading}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Central Community Center Hall"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Drive Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                required
                disabled={loading}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Blood Units</label>
            <div className="relative">
              <Target className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                required
                disabled={loading}
                value={targetUnits}
                onChange={(e) => setTargetUnits(e.target.value)}
                placeholder="e.g. 100"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-50"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Partner Hospital</label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              required
              disabled={loading}
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-500 bg-white disabled:bg-gray-50"
            >
              <option value="">Select a partner hospital to receive blood</option>
              <option value="city-general">City General Hospital</option>
              <option value="national-blood-bank">National Blood Bank</option>
              <option value="lanka-hospital">Lanka General Hospital</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition-colors mt-4 flex items-center justify-center gap-2 disabled:bg-red-400"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Publishing Campaign...</span>
            </>
          ) : (
            <span>Publish Campaign Drive</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateCampaignForm;