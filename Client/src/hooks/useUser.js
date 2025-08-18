// hooks/useUser.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

// Fetch current user
const fetchUser = async () => {
  const { data } = await axios.get(`${baseUrl}/api/auth/me`, {
    withCredentials: true,
  });
  return data.user;
};

export function useUser() {
  const queryClient = useQueryClient();

  // Get current user
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: 0, // 👈 force refetch each time we invalidate
    cacheTime: 0,
  });

  // Update avatar
  const updateAvatarMutation = useMutation({
    mutationFn: async (base64Image) => {
      const { data } = await axios.post(
        `${baseUrl}/api/users/upload-avatar`,
        { userId: user._id, image: base64Image },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      return data;
    },
    onSuccess: () => {
      // 👇 Instead of manually setting avatar, just refetch from backend
      queryClient.invalidateQueries(["user"]);
    },
  });

  // Update user fields (name, email, etc.)
  const updateFieldMutation = useMutation({
    mutationFn: async ({ field, value }) => {
      console.log(field, value);
      const { data } = await axios.patch(
        `${baseUrl}/api/users/${user._id}/${field}`,
        { value },
        { withCredentials: true }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
    },
  });

  return {
    user,
    isLoading,
    error,
    updateAvatar: updateAvatarMutation.mutateAsync,
    updateField: updateFieldMutation.mutateAsync,
  };
}
