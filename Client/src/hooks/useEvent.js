// hooks/useEvent.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { showToast } from "../utils/toast";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

// Fetch all events for the authenticated user
const fetchEvents = async () => {
  const { data } = await axios.get(`${baseUrl}/api/event/get-events`, {
    withCredentials: true,
  });
  console.log("Fetched events:", data);
  return data;
};

export function useEvent() {
  const queryClient = useQueryClient();

  // Get events
  const {
    data: eventsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
    staleTime: 0, // force refetch each time we invalidate
    cacheTime: 0,
  });

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: async (eventData) => {
      const res = await axios.post(
        `${baseUrl}/api/event/create-event`,
        eventData,
        { withCredentials: true }
      );
      if (res.status === 201) showToast(res.data.message, "success");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
    },
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async (eventId) => {
      const res = await axios.delete(`${baseUrl}/api/event/${eventId}`, {
        withCredentials: true,
      });
      if (res.status === 200) showToast(res.data.message, "success");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
    },
  });

  return {
    events: eventsData?.events || [],
    totalEvents: eventsData?.totalEvents || 0,
    isLoading,
    error,
    createEvent: createEventMutation.mutateAsync,
    deleteEvent: deleteEventMutation.mutateAsync,
  };
}
