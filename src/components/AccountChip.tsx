import { getAuth, signOut } from "firebase/auth";
import { app } from "../firebase";
import { Avatar, Chip } from "@mui/material";
import { Link } from "react-router-dom";
import { useAccount } from "../hooks/useData";

const AccountChip = () => {
  const auth = getAuth(app);
  const { Account } = useAccount();

  return Account ? (
    <Chip
      label={Account.name}
      avatar={<Avatar src={Account.icon ?? ""} alt="アイコン" />}
      onDelete={() => signOut(auth)}
    />
  ) : (
    <Link to="/login">ログイン</Link>
  );
};

export default AccountChip;
