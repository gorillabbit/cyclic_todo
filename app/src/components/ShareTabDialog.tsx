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
} from '@mui/material';
import { memo, useCallback, useState } from 'react';
import { db, updateDocAccount } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAccount, useTab } from '../hooks/useData';

type PlainShareTabDialogProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    linked_accounts: string[];
    checked: number[];
    handleCheckbox: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleShareButton: () => void;
    tabshared_accounts: string[];
};

const PlainShareTabDialog = memo(
    ({
        open,
        setOpen,
        linked_accounts,
        checked,
        handleCheckbox,
        handleShareButton,
        tabshared_accounts,
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
                        {linked_accounts?.map((account, index) => (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={handleCheckbox}
                                        value={index}
                                        checked={
                                            tabshared_accounts.includes(account) ||
                                            checked.includes(index)
                                        }
                                        disabled={tabshared_accounts.includes(account)}
                                    />
                                }
                                label={account}
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

    const handleCheckbox = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setChecked((prev) =>
            e.target.checked
                ? [...prev, Number(e.target.value)]
                : prev.filter((num) => num !== Number(e.target.value))
        );
    }, []);

    const handleShareButton = useCallback(() => {
        if (!Account) return;
        checked.forEach((index) => {
            getDoc(doc(db, 'Accounts', Account.linked_accounts[index])).then((docSnap) => {
                if (!docSnap.exists()) return;
                updateDocAccount(docSnap.id, {
                    use_tab_ids: [...docSnap.data().use_tab_ids, tab.id],
                });
            });
            // updateDocTab(tab.id, {
            //     shared_accounts: [...tab.shared_accounts, Account.linked_accounts[index]],
            // });
        });
        setOpen(false);
    }, [Account, checked, tab]);

    const tabshared_accounts = tab.shared_accounts.map((account) => account.id);

    const linked_accounts = Account?.linked_accounts ?? [];
    return (
        <PlainShareTabDialog
            {...{
                open,
                setOpen,
                linked_accounts,
                checked,
                handleCheckbox,
                handleShareButton,
                tabshared_accounts,
            }}
        />
    );
};

export default ShareTabDialog;
