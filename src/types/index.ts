export interface Profile {
    id: string;
    full_name: string;
    blood_type?: string;
    date_of_birth?: string;
    phone_number?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    is_donor: boolean;
    is_hospital: boolean;
    created_at: string;
    updated_at: string;
}

export interface Donation {
    id: string;
    donor_id: string;
    hospital_id?: string;
    blood_type: string;
    quantity_ml: number;
    donation_date: string;
    status: 'pending' | 'completed' | 'cancelled';
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface BloodRequest {
    id: string;
    hospital_id: string;
    blood_type: string;
    quantity_ml: number;
    urgency: 'normal' | 'urgent' | 'emergency';
    status: 'open' | 'fulfilled' | 'cancelled';
    request_date: string;
    expiry_date?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface Notification {
    id: string;
    user_id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'emergency';
    read: boolean;
    created_at: string;
}