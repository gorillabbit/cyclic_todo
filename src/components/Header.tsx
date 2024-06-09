import { Box } from "@mui/material";
import AccountChip from "./AccountChip";
import CalendarSignInButton from "./CalendarSignInButton";
import AccountShareButton from "./AccountShareButton";

const Header = ({
  setIsGapiMounted,
}: {
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
      <AccountChip />
      <CalendarSignInButton setIsGapiMounted={setIsGapiMounted} />
      <AccountShareButton />
    </Box>
  );
};

export default Header;
