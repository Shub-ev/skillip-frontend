// 1. Import necessary hooks and types from React
// createContext: Creates a Context object for sharing data
// useState: Manages local state in functional components
// useEffect: Handles side effects in components
import { createContext, useState, useEffect } from "react";

// User Interface
import { LoginData, UserInterface } from "../interfaces";

// 2. Define the shape of our context with TypeScript interface
// isLogin: Tracks user authentication status
// setIsLogin: Function to update login state
// uploadProfileImage: Function to handle profile image uploads
interface ContextType {
  isLogin: boolean | null;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  user: UserInterface | null;
  setUser: React.Dispatch<React.SetStateAction<UserInterface | null>>;
  logout: () => void;
  login: (loginData: LoginData) => Promise<void>;
  updateProfileImage: (image: File) => Promise<any>;
}

// 3. Create a new context with the defined type
// Initialize with null as default value
// Will be populated with actual values in the Provider
const MyContext = createContext<ContextType | null>(null);

// 4. Create Provider component that wraps the app and provides context values
// children: React nodes that will have access to context values
export const MyProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize login state as falses
  const [isLogin, setIsLogin] = useState<boolean>(!!localStorage.getItem("user"));
  const [user, setUser] = useState<UserInterface | null>(null);

  // default profile image URL
  // This is a placeholder image that will be used if the user does not have a profile image
  const defaultProfileImage = "/images/user.png";

  useEffect(() => {
    if (isLogin) {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);  

  useEffect(() => {
    console.log("Login State Changed: ", isLogin);
  }, [isLogin]);
  

  // logout function
  const logout = () => {
    try{
      localStorage.removeItem("user");
      setIsLogin(false);
      setUser(null);
    }
    catch(error){
      console.error("Error during logout:", error);
    }
  }

  // login function
  const login = async ( loginData: LoginData ) => {
    try{
      const response = await fetch("http://127.0.0.1:8080/user_auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();
      
      if(!response.ok){
        throw new Error(data.message || "Login failed");
      }

      if(user?.profileImageUrl === ""){
        data.profileImageUrl = defaultProfileImage;
      }

      localStorage.setItem("user", JSON.stringify(data));
      setIsLogin(true);
      // console.log(data);
      setUser(data);
    }
    catch(error){
      throw error;
    }
  }

  // image upload function
  const updateProfileImage = async (image: File) => {
    try {
        // Validation checks
        if (!image || !(image instanceof File)) {
            throw new Error("Invalid image file");
        }
        if (!user?.email) {
            throw new Error("User not authenticated");
        }

        // Create FormData
        const formData = new FormData();
        formData.append("file", image);

        // Get API URL from environment variables
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
            throw new Error("API URL not configured");
        }

        // Make the request with timeout and error handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        console.log(apiUrl, user.email);

        const response = await fetch(
            `${apiUrl}/users/${user.email}/profile-image`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("user")}`,
                },
                body: formData,
                signal: controller.signal
            }
        );

        clearTimeout(timeoutId);

        // Handle response
        const contentType = response.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
            throw new Error("Server response was not JSON");
        }

        const data = await response.json();
        console.log(data);

        if (!response.ok) {
            throw new Error(data.message || `Server error: ${response.status}`);
        }
        
        // Update user state
        setUser((prevUser) => {
          const updatedUser = prevUser ? {
            ...prevUser,
            profileImageUrl: data.profileImageUrl,
            imageUrlExpiration: data.imageUrlExpiration
          } : null;
        
          if (updatedUser) {
            localStorage.setItem("user", JSON.stringify(updatedUser));
          }

          return updatedUser;
        });

        return data;

    } catch (error) {
        if (error instanceof TypeError && error.message === "Failed to fetch") {
            throw new Error("Cannot connect to server. Please check your internet connection.");
        }
        
        if (error instanceof DOMException && error.name === "AbortError") {
            throw new Error("Request timed out. Please try again.");
        }

        console.error("Error uploading profile image:", error);
        throw error instanceof Error ? error : new Error("Unknown error occurred");
    }
  }

  // Render Provider component with context values
  // Makes isLogin, setIsLogin and uploadProfileImage available to children
  return (
    <MyContext.Provider value={{ isLogin, setIsLogin, user, setUser, logout, login, updateProfileImage }}>
      {children}
    </MyContext.Provider>
  )
}

// 5. Export the context for use in other components
// Allows components to consume context values using useContext hook
export default MyContext;