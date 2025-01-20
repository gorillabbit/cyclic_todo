import { Box } from '@mui/material';
import AccountChip from './AccountChip';
import CalendarSignInButton from './CalendarSignInButton';
import AccountShareButton from './AccountShareButton';

const Header = () => {
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
            <CalendarSignInButton />
            <AccountShareButton />
        </Box>
    );
};

export default Header;
