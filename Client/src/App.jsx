import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Root from "./Layouts/Root";
import Error from "./pages/Error";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import VerifyEmail from "./pages/VerifyEmail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> },
      { path: '/contact', element: <Contact /> },
      { path: '/profile', element: <Profile /> },
      { path: "/verify-email", element: <VerifyEmail /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;