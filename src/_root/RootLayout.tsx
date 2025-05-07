import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Box } from "@mui/material";

const RootLayout = () => {
    return (
        <>
            <Navbar />
            <Box sx={{ maxWidth: "1446px", margin: "0 auto", width: "100%", padding: "0 7px" }}>
                <Outlet />
            </Box>
        </>
    )
}

export default RootLayout;