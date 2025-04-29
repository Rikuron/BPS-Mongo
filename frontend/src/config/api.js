export const API_BASE_URL = 'http://localhost:5002'; // Your current backend port

export const API_ENDPOINTS = {
    BASE_URL: API_BASE_URL,

    // Auth endpoints
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    
    // Staff/Users endpoints
    STAFF: `${API_BASE_URL}/api/staff`,
    
    // Other endpoints
    RESIDENTS: `${API_BASE_URL}/api/residents`,
    ANNOUNCEMENTS: `${API_BASE_URL}/api/announcements`,
    CASES: `${API_BASE_URL}/api/cases`,
    EVENTS: `${API_BASE_URL}/api/events`,
    SEND_EMAIL: `${API_BASE_URL}/api/send-email`,
    RECENT_ACTIVITIES: `${API_BASE_URL}/api/activities/recent`,
};

export default API_BASE_URL;