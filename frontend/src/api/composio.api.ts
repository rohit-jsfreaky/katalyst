import { apiClient } from "./http";

// --------------------
//  CHECK STATUS
// --------------------
export const checkCalendarStatus = async (userId: string) => {
  const res = await apiClient.get(`/api/calendar/status/${userId}`);
  return res.data;
};

// --------------------
//  START CONNECTION
// --------------------
export const connectCalendar = async (userId: string) => {
  const res = await apiClient.get(`/api/calendar/connect/${userId}`);
  return res.data;
};

// --------------------
//  GET EVENTS
// --------------------
export const getCalendarEvents = async (userId: string) => {
  const res = await apiClient.get(`/api/calendar/events/${userId}`);
  return res.data;
};
