// Import necessary routing components from react-router-dom
// Router: Main router component
// Routes: Container for Route definitions
// Route: Individual route definition
// Outlet: Renders child routes
// Navigate: Programmatic navigation
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom'
// Import the HomePage component
// Import the LoginPage component from the pages directory
// Import the SignupPage component
// Import the GetHiredForm component
// Import the ProfilePage component
import { HomePage, LoginPage, SignupPage, GetHiredForm, ProfilePage } from './pages'
// Import the AuthLayout component for authentication related pages
import AuthLayout from './_auth/AuthLayout'
// Import the RootLayout component for main app layout
import RootLayout from './_root/RootLayout'
// Import the NoNavLayout component for pages without navigation
import NoNavLayout from './no_nav/NoNavLayout'

// Define the main App component
const App = () => {
  // PrivateRoute component to protect routes that require authentication
  const PrivateRoute = () => {
    // Check if user token exists in localStorage
    const user = localStorage.getItem("token");
    // If user exists, render child routes (Outlet), otherwise redirect to signin
    return user ? <Outlet /> : <Navigate to={"/signin"} />
  }

  // Return the main app structure
  return (
    <Router>
      {/* Routes component contains all route definitions */}
      <Routes>
        {/* Route with AuthLayout wrapper */}
        <Route element={<AuthLayout />}>
          {/* Home page route */}
          <Route path='/' element={<HomePage />} />
          {/* Routes without navigation bar */}
          <Route element={<NoNavLayout />}>
            {/* Login page route */}
            <Route path='/signin' element={<LoginPage />} />
            {/* Signup page route */}
            <Route path='/signup' element={<SignupPage />} />
          </Route>
        </Route>
        {/* Protected routes that require authentication */}
        <Route element={<PrivateRoute />}>
          {/* Routes with main app layout */}
          <Route element={<RootLayout />}>
            {/* Get hired form route */}
            <Route path='/get_hired_form' element={<GetHiredForm />} />
            <Route path='/profile' element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

// Export the App component as default
export default App