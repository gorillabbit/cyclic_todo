import { getAuth, signOut } from 'firebase/auth';
import { app } from '../firebase';
import { Avatar, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAccountStore } from '../stores/accountStore';

const AccountChip = () => {
    const auth = getAuth(app);
    const { Account } = useAccountStore();

    return Account ? (
        <Chip avatar={<Avatar src={''} alt="アイコン" />} onDelete={() => signOut(auth)} />
    ) : (
        <Link to="/login">ログイン</Link>
    );
};

export default AccountChip;
