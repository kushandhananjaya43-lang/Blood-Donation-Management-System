import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, Building2, Megaphone, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const SignUp: React.FC = () => {
    const [accountType, setAccountType] = useState<'donor' | 'hospital' | 'campaign'>('donor');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        // Register user with Supabase Auth & attach metadata
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: accountType,
                },
            },
        });

        if (error) {
            setErrorMsg(error.message);
            setLoading(false);
            return;
        }

        // Redirect based on selected account type
        if (accountType === 'donor') {
            navigate('/donor-dashboard');
        } else if (accountType === 'hospital') {
            navigate('/hospital-dashboard');
        } else if (accountType === 'campaign') {
            navigate('/campaign-dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50 py-12 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                            <span className="text-3xl">🩸</span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Blood Donation Network</h1>
                    <p className="text-sm text-gray-600 mt-1">Connecting donors with those in need</p>
                </div>

                <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">Create an Account</h2>

                {errorMsg && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => setAccountType('donor')}
                                className={`p-2.5 border-2 rounded-lg text-center transition ${accountType === 'donor'
                                        ? 'border-red-600 bg-red-50'
                                        : 'border-gray-200 hover:border-red-300'
                                    }`}
                            >
                                <UserPlus className={`w-5 h-5 mx-auto mb-1 ${accountType === 'donor' ? 'text-red-600' : 'text-gray-400'}`} />
                                <span className={`text-xs font-medium block ${accountType === 'donor' ? 'text-red-600' : 'text-gray-600'}`}>
                                    Donor
                                </span>
                                {accountType === 'donor' && <CheckCircle2 className="w-4 h-4 text-red-600 mx-auto mt-1" />}
                            </button>

                            <button
                                type="button"
                                onClick={() => setAccountType('hospital')}
                                className={`p-2.5 border-2 rounded-lg text-center transition ${accountType === 'hospital'
                                        ? 'border-red-600 bg-red-50'
                                        : 'border-gray-200 hover:border-red-300'
                                    }`}
                            >
                                <Building2 className={`w-5 h-5 mx-auto mb-1 ${accountType === 'hospital' ? 'text-red-600' : 'text-gray-400'}`} />
                                <span className={`text-xs font-medium block ${accountType === 'hospital' ? 'text-red-600' : 'text-gray-600'}`}>
                                    Hospital
                                </span>
                                {accountType === 'hospital' && <CheckCircle2 className="w-4 h-4 text-red-600 mx-auto mt-1" />}
                            </button>

                            <button
                                type="button"
                                onClick={() => setAccountType('campaign')}
                                className={`p-2.5 border-2 rounded-lg text-center transition ${accountType === 'campaign'
                                        ? 'border-red-600 bg-red-50'
                                        : 'border-gray-200 hover:border-red-300'
                                    }`}
                            >
                                <Megaphone className={`w-5 h-5 mx-auto mb-1 ${accountType === 'campaign' ? 'text-red-600' : 'text-gray-400'}`} />
                                <span className={`text-xs font-medium block ${accountType === 'campaign' ? 'text-red-600' : 'text-gray-600'}`}>
                                    Campaign
                                </span>
                                {accountType === 'campaign' && <CheckCircle2 className="w-4 h-4 text-red-600 mx-auto mt-1" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            {accountType === 'donor'
                                ? 'Full Name'
                                : accountType === 'hospital'
                                ? 'Your Name'
                                : 'Organization / Campaign Name'}
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                placeholder={
                                    accountType === 'donor'
                                        ? 'John Doe'
                                        : accountType === 'hospital'
                                        ? 'Dr. Smith'
                                        : 'Red Cross Organization'
                                }
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                placeholder="Minimum 6 characters"
                                required
                                minLength={6}
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Minimum 6 characters</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-red-600 hover:text-red-700 font-medium hover:underline">
                        Sign in
                    </Link>
                </p>

                <p className="text-center text-xs text-gray-400 mt-8 pt-4 border-t border-gray-100">
                    Made by Blood Donation Network
                </p>
            </div>
        </div>
    );
};

export default SignUp;