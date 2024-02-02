import Clock from "./Clock.js";
import { Box } from "@mui/material";
import SignInForm from "./SignInForm";

const Header = ({setUser}) => {
  return (
    <Box p={1} mb={1} display='flex' justifyContent='center' alignItems='center' color="white" bgcolor="#4caf50">
      <Clock />
      <SignInForm setUser={setUser} />
    </Box>
  );
};

export default Header;
