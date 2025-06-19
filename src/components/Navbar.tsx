// Import necessary Material-UI components for navigation bar
import { AppBar, Toolbar, Box, Button, IconButton, Menu, MenuItem } from "@mui/material";
// Import account circle icon for logged in users
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// Import React hooks for state and side effects
import { useContext, useEffect, useState } from "react";
// Import routing hooks from react-router-dom
import { useLocation, useNavigate } from "react-router-dom";
import MyContext from "../context/context";

// Styles object to store reusable styles
const baseButtonStyle = {
  padding: "8px 16px",
  width: "100%",
  justifyContent: "flex-start",
  textTransform: "none",
  borderRadius: "8px",
  transition: "all 0.2s ease-in-out",
};

const styles: Record<string, any> = {
  // Base button styles
  button: baseButtonStyle,
  // Yellow "Get Hired" button styles
  getHiredButton: {
    backgroundColor: "#FFD700",
    color: "#000",
    "&:hover": {
      backgroundColor: "#FFC107",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    },
  },
  // Blue authentication button styles
  authButton: {
    backgroundColor: "#1E90FF",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#007BFF",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    },
  },
  // Red logout button styles 
  logoutButton: {
    backgroundColor: "#D84040",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#A31D1D",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    },
  },
  // Profile button styles
  profileButton: {
    backgroundColor: "#1E90FF",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#007BFF",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    },
  },
  // Menu styles
  menu: {
    mt: 1.5,
    borderRadius: "12px",
    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
    minWidth: 200,
    padding: "8px",
    "& .MuiList-root": {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    }
  },
  // Menu item styles
  menuItem: {
    ...baseButtonStyle,
    justifyContent: "flex-start",
    width: "100%",
    margin: 0,
    borderRadius: "8px",
  }
};

// Navbar component definition
const Navbar = () => {
  // State for menu anchor element
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { isLogin, user, logout } = useContext(MyContext)!;
  // State for loading status
  const [isLoading, setIsLoading] = useState(true);
  // Hook for programmatic navigation
  const navigate = useNavigate();
  // Hook for accessing current route location
  const location = useLocation();
  // Array of paths that require authentication
  const privatePaths = ["/get_hired_form"];

  // default image path for user profile if user profile image not present
  const defaultImg = "/images/user.png";



  // Function to handle user logout
  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  useEffect(() => {
    if (!isLogin) {
      navigate("/");
    }
  }, [isLogin]);

  // Function to handle menu open
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Function to handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Render navigation bar
  return (
    // Main app bar component with transparent background and no elevation
    <AppBar position="static" color="transparent" elevation={0} sx={{ maxWidth: "1440px", margin: "0 auto", width: "100%" }}>
      <Toolbar sx={{
        minHeight: "64px !important",
        margin: "0 auto",
        "&.MuiToolbar-root": {
          padding: 0,
          margin: 0,
        },
        "&.MuiToolbar-gutters": {
          padding: 0,
          margin: 0,
        }
      }}>
        {/* Logo container */}
        <Box sx={{ flexGrow: 1, padding: "0px" }} onClick={() => navigate("/")}>
          <img
            src="/images/skillip-HRL-Dark.png"
            alt="Skillip Logo"
            style={{ height: 22, width: "auto" }}
          />
        </Box>

        {/* Desktop navigation menu (hidden on mobile) */}
        <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 2, alignItems: "center" }}>
          {/* Get Hired button with yellow background */}
          <Button
            sx={{ ...styles.button, ...styles.getHiredButton, width: "auto" }}
            onClick={() => navigate("/get_hired_form")}
          >
            Get Hired
          </Button>

          {/* Conditional rendering based on auth state */}
          {!isLogin ? (
            // Show login button if not logged in
            <Button
              sx={{ ...styles.button, ...styles.authButton, width: "auto" }}
              onClick={() => navigate("/login")}
            >
              Sign Up | Login
            </Button>
          ) : (
            // Show user menu if logged in
            <Box>
              {/* User icon button */}
              <IconButton
                onClick={handleMenuOpen}
                sx={{
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": { transform: "scale(1.1)" }
                }}
              >
                {/* Conditional rendering of user profile image or default icon */}
                {isLogin ? (
                  user?.profileImageUrl ?
                    <img src={user.profileImageUrl} alt="profile image" style={{ height: "40px", borderRadius: "50%" }}
                      onError={(e) => {
                        // if internet image is not loaded the fall back to default
                        (e.target as HTMLImageElement).src = defaultImg;
                      }}
                    />
                    : <img src={defaultImg} alt="profile image" style={{ height: "40px", borderRadius: "50%" }} />
                ) : (
                  <img src={defaultImg} alt="profile image" style={{ height: "40px", borderRadius: "50%" }} />
                )}
              </IconButton>
              {/* Menu component */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                disablePortal
                keepMounted
                disableScrollLock
                disableAutoFocusItem
              >
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate("/profile");
                  }}
                  sx={{ ...styles.menuItem, ...styles.profileButton }}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  sx={{ ...styles.menuItem, ...styles.logoutButton, marginTop: "10px" }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>

        {/* Mobile Menu */}
        <Box sx={{ display: { xs: "block", sm: "none" }, position: "relative", padding: { xs: "0px 8px", sm: "0px" }, margin: "0 auto" }}>
          {/* Mobile menu toggle button */}
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              padding: 0,
              margin: 0,
              transition: "transform 0.2s ease-in-out",
              "&:hover": { transform: "scale(1.1)" }
            }}
          >
            {isLogin ? (
              user?.profileImageUrl ?
                <img src={user.profileImageUrl} alt="profile image" style={{ height: "40px", borderRadius: "50%" }}
                  onError={(e) => {
                    // if internet image is not loaded the fall back to default
                    (e.target as HTMLImageElement).src = defaultImg;
                  }}
                />
                : <img src={defaultImg} alt="profile image" style={{ height: "40px", borderRadius: "50%" }} />
            ) : (
              <img src={defaultImg} alt="profile image" style={{ height: "40px", borderRadius: "50%" }} />
            )}
          </IconButton>

          {/* Mobile Menu component */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{
              sx: styles.menu
            }}
            disablePortal
            keepMounted
            disableScrollLock
            disableAutoFocusItem
          >
            {/* Get Hired button in mobile menu */}
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate('/get_hired_form');
              }}
              sx={{ ...styles.menuItem, ...styles.getHiredButton }}
            >
              Get Hired
            </MenuItem>

            {/* Conditional rendering of auth buttons */}
            {!isLogin ? (
              <Box>
                {/* Sign up button */}
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate("/signup");
                  }}
                  sx={{ ...styles.menuItem, ...styles.authButton }}
                >
                  Sign Up
                </MenuItem>
                {/* Login button */}
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate("/login");
                  }}
                  sx={{ ...styles.menuItem, ...styles.authButton }}
                >
                  Login
                </MenuItem>
              </Box>
            ) : (
              <Box>
                {/* Profile button for logged in users */}
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate("/profile");
                  }}
                  sx={{ ...styles.menuItem, ...styles.profileButton }}
                >
                  Profile
                </MenuItem>
                {/* Logout button for logged in users */}
                <MenuItem
                  onClick={handleLogout}
                  sx={{ ...styles.menuItem, ...styles.logoutButton, marginTop:"10px" }}
                >
                  Logout
                </MenuItem>
              </Box>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

// Export Navbar component
export default Navbar;
