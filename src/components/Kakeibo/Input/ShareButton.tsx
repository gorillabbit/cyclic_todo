import { Box, Button, Checkbox, Dialog } from "@mui/material";
import { memo, useCallback, useState } from "react";
import { useAccount } from "../../Context/AccountContext";
import { AccountType } from "../../../types";

type PlainShareButtonProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  shareAccount: string[];
  handleCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  accessibleAccounts:
    | Pick<AccountType, "email" | "name" | "icon">[]
    | undefined;
};

const PlainShareButton = memo(
  ({
    open,
    setOpen,
    shareAccount,
    handleCheckboxChange,
    accessibleAccounts,
  }: PlainShareButtonProps) => (
    <>
      <Button onClick={() => setOpen(true)}>共有アカウント設定</Button>
      <Dialog open={open}>
        {accessibleAccounts?.map((account) => (
          <Box key={account.email} display="flex">
            <Checkbox value={account.email} onChange={handleCheckboxChange} />
            <Box m={2}>
              {account.name} : {account.email}
            </Box>
          </Box>
        ))}
        <Box m={2}>
          <Button onClick={() => setOpen(false)} color="error">
            キャンセル
          </Button>
          <Button onClick={() => setOpen(false)}>確定</Button>
        </Box>
      </Dialog>
    </>
  )
);

const ShareButton = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [shareAccount, setShareAccount] = useState<string[]>([]);
  const { Account } = useAccount();

  const accessibleAccounts = Account?.linkedAccounts;

  const handleCheckboxChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log(event);
      const value = event.target.value;
      console.log(value);
      setShareAccount((prevItems) =>
        prevItems.includes(value)
          ? prevItems.filter((item) => item !== value)
          : [...prevItems, value]
      );
    },
    []
  );

  const saveChange = useCallback(() => {}, []);
  console.log(shareAccount);
  const plainProps = {
    open,
    setOpen,
    shareAccount,
    handleCheckboxChange,
    accessibleAccounts,
  };
  return <PlainShareButton {...plainProps} />;
};

export default ShareButton;
