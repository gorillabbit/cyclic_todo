import Clock from "./Clock.js";
import { Box } from "@mui/material";
import SignInForm from "./SignInForm";
import CalendarSignInButton from "./CalendarSignInButton";

const Header = ({setUser, setIsGapiMounted}) => {
  return (
    <Box p={1} mb={1}  color="white" bgcolor="#4caf50">
      <Clock />
      <Box gap={1} display='flex' justifyContent='center' alignItems='center'>
        <SignInForm setUser={setUser} />
        <CalendarSignInButton setIsGapiMounted={setIsGapiMounted} />
      </Box>
    </Box>
  );
};

export default Header;
