import Clock from "./Clock.js";
import { Box } from "@mui/material";

const Header = () => {
  return (
    <Box p={1} mb={1} color="white" bgcolor="#4caf50">
      <h1>TODOリスト</h1>
      <Clock />
    </Box>
  );
};

export default Header;
