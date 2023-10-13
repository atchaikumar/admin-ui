import "./Header.css";
import { Box, Typography } from "@mui/material";

const Header = () => {
    const refreshPage = () =>{
        window.location.reload(false);//refreshes the page and restores the content
      }
    return(
        <>
            <Box className="heading-container">
                <Typography
                 className="main-heading"
                 variant="span"
                 onClick={refreshPage}>
                    Greektrust Admin-ui
                </Typography>
            </Box>
        </>
    );
}

export default Header;
