import { Box } from "@mui/material";
import SignInForm from "./SignInForm";
import CalendarSignInButton from "./CalendarSignInButton";
import { User } from "firebase/auth";

const Header = ({
  setUser,
  setIsGapiMounted,
}: {
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  setIsGapiMounted: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Box
      gap={1}
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={1}
      color="white"
      bgcolor="#d8f2d5"
    >
      <SignInForm setUser={setUser} />
      <CalendarSignInButton setIsGapiMounted={setIsGapiMounted} />
    </Box>
  );
};

export default Header;
