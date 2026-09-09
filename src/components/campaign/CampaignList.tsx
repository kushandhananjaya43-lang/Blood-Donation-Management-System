import React from 'react';
import { Calendar, MapPin, Users, HeartHandshake } from 'lucide-react';

const CampaignList: React.FC = () => {
  const campaigns = [
    {
      id: 1,
      title: 'City Center Blood Drive',
      organizer: 'Red Cross Society',
      location: 'Community Hall, Main St.',
      date: '2026-04-15',
      target: '50 units',
    },
    {
      id: 2,
      title: 'University Campus Drive',
      organizer: 'Rotaract Club',
      location: 'Student Center Gym',
      date: '2026-04-22',
      target: '100 units',
    },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Upcoming Blood Campaigns</h1>
        <p className="text-gray-600">Find blood drives near you and register to save lives.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((c) => (
          <div key={c.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-bold text-gray-800">{c.title}</h2>
                <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded font-medium">Upcoming</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Organized by {c.organizer}</p>

              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{c.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{c.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>Target Goal: {c.target}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => alert(`Registered for ${c.title}!`)}
              className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <HeartHandshake className="w-4 h-4" />
              Register as Donor
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignList;