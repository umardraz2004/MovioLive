// hooks/useTicket.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { showToast } from "../utils/toast";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

// Fetch user tickets from database
const fetchUserTickets = async () => {
  const { data } = await axios.get(`${baseUrl}/api/tickets/my-tickets`, {
    withCredentials: true,
  });
  console.log("Fetched tickets:", data);
  return data;
};

export function useTicket() {
  const queryClient = useQueryClient();

  // Get user tickets
  const {
    data: ticketsData,
    isLoading: ticketsLoading,
    error: ticketsError,
  } = useQuery({
    queryKey: ["userTickets"],
    queryFn: fetchUserTickets,
    staleTime: 0, // force refetch each time we invalidate
    cacheTime: 0,
  });

  // Create ticket checkout session mutation
  const createTicketCheckoutMutation = useMutation({
    mutationFn: async (eventId) => {
      const res = await axios.post(
        `${baseUrl}/api/checkout/create-ticket-session`,
        { eventId },
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data.success && data.url) {
        // Redirect to Stripe checkout page
        window.location.href = data.url;
      } else {
        showToast(data.error || "Failed to create checkout session", "error");
      }
    },
    onError: (error) => {
      console.error("Ticket checkout error:", error);
      showToast("Error processing checkout. Please try again.", "error");
    },
  });

  // Refetch tickets (useful after successful payment)
  const refetchTickets = () => {
    queryClient.invalidateQueries(["userTickets"]);
  };

  return {
    // Data
    tickets: ticketsData?.tickets || [],
    totalTickets: ticketsData?.totalTickets || 0,
    
    // Loading states
    ticketsLoading,
    isCreatingCheckout: createTicketCheckoutMutation.isLoading,
    
    // Error states
    ticketsError,
    checkoutError: createTicketCheckoutMutation.error,
    
    // Actions
    createTicketCheckout: createTicketCheckoutMutation.mutateAsync,
    refetchTickets,
  };
};