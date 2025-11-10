import { useUser } from "../hooks/useUser";
import { Navigate } from "react-router-dom";

const PrivateSubscriptionRoute = ({ children }) => {
  const { user } = useUser();
  return (
    <>
      {user && user.subscriptionStatus !== "inactive" ? (
        children
      ) : (
        <Navigate to="/prices" />
      )}
    </>
  );
};

export default PrivateSubscriptionRoute;
