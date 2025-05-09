import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Box } from "@mui/material";

const AuthLayout = () => {
    const navRoutes = ["/"];
    const location = useLocation();

    return ( 
        <>
            {navRoutes.includes(location.pathname) && <Navbar />}
            <Box maxWidth="xl" sx={{ maxWidth: "1446px", margin: "0 auto", padding: "0 7px" }}>
                <Outlet />
            </Box>
        </>
    );
}

export default AuthLayout;