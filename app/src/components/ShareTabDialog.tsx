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
import { useCallback, useState } from 'react';
import { db, updateDocAccount } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useTab } from '../hooks/useData';
import { useAccountStore } from '../stores/accountStore';

const ShareTabDialog = () => {
    const [open, setOpen] = useState(false);
    const { Account } = useAccountStore();
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
            getDoc(doc(db, 'Accounts', Account.linkedAccounts[index])).then((docSnap) => {
                if (!docSnap.exists()) return;
                updateDocAccount(docSnap.id, {
                    useTabIds: [...docSnap.data().useTabIds, tab.id],
                });
            });
        });
        setOpen(false);
    }, [Account, checked, tab]);

    const tabSharedAccounts = tab.sharedAccounts.map((account) => account.id);

    const linkedAccounts = Account?.linkedAccounts ?? [];
    return (
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
                                            tabSharedAccounts.includes(account) ||
                                            checked.includes(index)
                                        }
                                        disabled={tabSharedAccounts.includes(account)}
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
    );
};

export default ShareTabDialog;
