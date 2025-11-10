import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Root from "./Layouts/Root";
import Error from "./pages/Error";
import Login from "./pages/Login";
import Prices from "./pages/Prices";
import Events from "./pages/Events";
import Signup from "./pages/Signup";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import VerifyEmail from "./pages/VerifyEmail";
import PaymentSuccess from "./pages/PaymentSuccess";
import PrivateRoute from "./components/PrivateRoute";
import CreateEvents from "./pages/CreateEvents";
import PrivateSubscriptionRoute from "./components/PrivateSubscriptionRoute";
import Theater from "./pages/Theater";
// Add these imports at the top

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/contact", element: <Contact /> },
      {
        path: "/events",
        element: (
          <PrivateRoute>
            <Events />
          </PrivateRoute>
        ),
      },
      {
        path: "/theater",
        element: (
          <PrivateRoute>
            <Theater />
          </PrivateRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      { path: "/verify-email", element: <VerifyEmail /> },
      {
        path: "/prices",
        element: (
          <PrivateRoute>
            <Prices />
          </PrivateRoute>
        ),
      },
      {
        path: "/success",
        element: <PaymentSuccess />,
      },
      {
        path: "/create-event",
        element: (
          <PrivateRoute>
            <PrivateSubscriptionRoute>
              <CreateEvents />
            </PrivateSubscriptionRoute>
          </PrivateRoute>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
