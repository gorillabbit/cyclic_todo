import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { memo, useCallback, useState } from "react";
import { AccountLinkType } from "../types";
import { db, updateDocAccount, updateDocTab } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAccount, useTab } from "../hooks/useData";

type PlainShareTabDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  linkedAccounts: AccountLinkType[];
  checked: number[];
  handleCheckbox: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleShareButton: () => void;
  tabSharedAccounts: string[];
};

const PlainShareTabDialog = memo(
  ({
    open,
    setOpen,
    linkedAccounts,
    checked,
    handleCheckbox,
    handleShareButton,
    tabSharedAccounts,
  }: PlainShareTabDialogProps) => (
    <>
      <Button onClick={() => setOpen(true)}>共有</Button>
      <Dialog sx={{ m: 2 }} open={open} onClose={() => setOpen(false)}>
        <DialogTitle>共有するユーザー</DialogTitle>
        <DialogContent>
          <DialogContentText>
            このタブを共有するユーザーを選択してください
          </DialogContentText>
          <FormGroup>
            {linkedAccounts?.map((account, index) => (
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={handleCheckbox}
                    value={index}
                    checked={
                      tabSharedAccounts.includes(account.id) ||
                      checked.includes(index)
                    }
                    disabled={tabSharedAccounts.includes(account.id)}
                  />
                }
                label={account.name}
                key={index}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="error">
            Close
          </Button>
          <Button onClick={handleShareButton} color="primary">
            Share
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
);

const ShareTabDialog = () => {
  const [open, setOpen] = useState(false);
  const { Account } = useAccount();
  const { tab } = useTab();
  const [checked, setChecked] = useState<number[]>([]);

  const handleCheckbox = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setChecked((prev) =>
        e.target.checked
          ? [...prev, Number(e.target.value)]
          : prev.filter((num) => num !== Number(e.target.value))
      );
    },
    []
  );

  const handleShareButton = useCallback(() => {
    if (!Account) return;
    checked.forEach((index) => {
      getDoc(doc(db, "Accounts", Account.linkedAccounts[index].id)).then(
        (docSnap) => {
          if (!docSnap.exists()) return;
          updateDocAccount(docSnap.id, {
            useTabIds: [...docSnap.data().useTabIds, tab.id],
          });
        }
      );
      updateDocTab(tab.id, {
        sharedAccounts: [...tab.sharedAccounts, Account.linkedAccounts[index]],
      });
    });
    setOpen(false);
  }, [Account, checked, tab]);

  const tabSharedAccounts = tab.sharedAccounts.map((account) => account.id);

  const linkedAccounts = Account?.linkedAccounts ?? [];
  return (
    <PlainShareTabDialog
      {...{
        open,
        setOpen,
        linkedAccounts,
        checked,
        handleCheckbox,
        handleShareButton,
        tabSharedAccounts,
      }}
    />
  );
};

export default ShareTabDialog;
