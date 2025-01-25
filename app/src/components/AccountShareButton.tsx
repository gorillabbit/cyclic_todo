import {
    Avatar,
    Box,
    Button,
    Chip,
    Dialog,
    DialogContent,
    TextField,
    Tooltip,
} from '@mui/material';
import { ChangeEvent, JSX, memo, useState, useEffect } from 'react';
import { updateDocAccount, db } from '../firebase';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { AccountLinkType, AccountType } from '../types';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAccount } from '../hooks/useData';
import { getAccounts } from '../utilities/apiClient';

// TODO: メアドがlinked_accountsなどになくなったので機能していない
const validateEmail = (email: string, account: AccountType): string => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) return '無効なメールアドレスです';
    if (email === account.email) return '自分のメールアドレスです';
    if (account.linked_accounts.some((l) => l === email)) return 'すでにリンクされています';
    if (account.send_request.includes(email)) return 'すでにリンク依頼を出しています';
    if (account.receive_request.some((r) => r === email)) return 'すでにリンク依頼を受けています';
    return '';
};

const AccountShareButton = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>();
    const [linked_accounts, setlinked_accounts] = useState<AccountLinkType[]>([]);
    const [receive_requests, setreceive_requests] = useState<AccountLinkType[]>([]);

    const { Account } = useAccount();

    useEffect(() => {
        if (!Account) return;
        const fetchAccounts = async () => {
            try {
                const data = await getAccounts([{ field: 'id', value: Account.linked_accounts }]);
                setlinked_accounts(
                    data.map((account) => ({
                        id: account.id,
                        email: account.email,
                        name: account.name,
                        icon: account.icon,
                    }))
                );
                const receive_requests = await getAccounts([
                    { field: 'id', value: Account.receive_request },
                ]);
                setreceive_requests(
                    receive_requests.map((account) => ({
                        id: account.id,
                        email: account.email,
                        name: account.name,
                        icon: account.icon,
                    }))
                );
            } catch (error) {
                console.error('アカウント取得エラー:', error);
            }
        };

        if (Account?.linked_accounts?.length) {
            fetchAccounts();
        }
    }, [Account?.linked_accounts, Account?.receive_request]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value } = e.target;
        if (!Account) return;
        setEmail(value);
        setError(validateEmail(value, Account));
    };

    const AccountCollection = collection(db, 'Accounts');
    const getAccountDoc = async (id: string) => {
        const accountDoc = await getDoc(doc(AccountCollection, id));
        if (!accountDoc.exists()) throw new Error('Document not found');
        return { ...accountDoc.data(), id: accountDoc.id } as AccountType;
    };

    const sendLinkRequests = async () => {
        if (!Account) return;
        if (!email) return setError('メールアドレスが入力されていません');

        const q = query(AccountCollection, where('email', '==', email));
        const targetAccountDoc = await getDocs(q);
        if (targetAccountDoc.empty) return setError('入力対象はアカウントを持っていません');

        updateDocAccount(Account.id, {
            send_request: [...Account.send_request, email],
        });
        const targetDoc = targetAccountDoc.docs[0];
        updateDocAccount(targetDoc.id, {
            receive_request: [...targetDoc.data().receive_request, Account],
        });
        setEmail('');
    };

    const refuseRequest = (receivedRequest: AccountLinkType) => {
        if (!Account) return;
        updateDocAccount(Account.id, {
            receive_request: Account.receive_request.filter((r) => r !== receivedRequest.id),
        });
        getAccountDoc(receivedRequest.id).then((doc) => {
            updateDocAccount(doc.id, {
                send_request: doc.send_request.filter((r) => r !== Account.email),
            });
        });
    };

    const acceptRequest = async (receive_request: AccountLinkType) => {
        if (!Account) return;
        updateDocAccount(Account.id, {
            linked_accounts: [...Account.linked_accounts, receive_request.id],
            receive_request: Account.receive_request.filter((r) => r !== receive_request.id),
        });
        getAccountDoc(receive_request.id).then((doc) => {
            updateDocAccount(doc.id, {
                linked_accounts: [...doc.linked_accounts, Account.id],
                send_request: doc.send_request.filter((r) => r !== Account.email),
            });
        });
    };

    const cancelRequest = (request: string) => {
        if (!Account) return;
        updateDocAccount(Account.id, {
            send_request: Account.send_request.filter((r) => r !== request),
        });
        const q = query(AccountCollection, where('email', '==', request));
        getDocs(q).then((docs) => {
            if (docs.empty) return;
            const targetDoc = docs.docs[0];
            updateDocAccount(targetDoc.id, {
                receive_request: targetDoc
                    .data()
                    .receive_request.filter((r: AccountLinkType) => r.id !== Account.id),
            });
        });
    };

    const unlinkAccount = (linkedAccount: AccountLinkType) => {
        if (!Account) return;
        updateDocAccount(Account.id, {
            linked_accounts: Account.linked_accounts.filter((a) => a !== linkedAccount.id),
        });
        getAccountDoc(linkedAccount.id).then((doc) => {
            updateDocAccount(doc.id, {
                linked_accounts: doc.linked_accounts.filter((a) => a !== Account.id),
            });
        });
    };

    const ChipWrapper = memo(
        ({
            tooltipTitle,
            label,
            avatar,
            icon,
            cancelTooltipTitle,
            deleteAction,
        }: {
            tooltipTitle: string;
            label: string;
            avatar?: JSX.Element;
            icon?: JSX.Element;
            cancelTooltipTitle: string;
            deleteAction: () => void;
        }) => (
            <Box m={1}>
                <Tooltip title={tooltipTitle} placement="top">
                    <Chip
                        variant="outlined"
                        label={label}
                        {...(icon ? { icon } : {})}
                        {...(avatar ? { avatar } : {})}
                        deleteIcon={
                            <Tooltip title={cancelTooltipTitle}>
                                <CancelIcon />
                            </Tooltip>
                        }
                        onDelete={deleteAction}
                    />
                </Tooltip>
            </Box>
        )
    );

    return (
        <>
            <Button sx={{ m: 1 }} variant="contained" onClick={() => setOpen(true)}>
                共有
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogContent>
                    {linked_accounts.map((linkedAccount) => (
                        <ChipWrapper
                            key={linkedAccount.id}
                            tooltipTitle={linkedAccount.id}
                            label={linkedAccount.id}
                            avatar={<Avatar src={linkedAccount.id} />}
                            cancelTooltipTitle="解除"
                            deleteAction={() => unlinkAccount(linkedAccount)}
                        />
                    ))}

                    {receive_requests.map((receive_request) => (
                        <ChipWrapper
                            key={receive_request.id}
                            tooltipTitle={receive_request.id}
                            label={receive_request.id}
                            icon={
                                <Tooltip title="承認する">
                                    <Box
                                        sx={{ cursor: 'pointer' }}
                                        onClick={() => acceptRequest(receive_request)}
                                    >
                                        <CheckCircleOutlineIcon />
                                    </Box>
                                </Tooltip>
                            }
                            cancelTooltipTitle="拒否する"
                            deleteAction={() => refuseRequest(receive_request)}
                        />
                    ))}

                    {Account?.send_request?.map((send_request) => (
                        <ChipWrapper
                            key={send_request}
                            tooltipTitle=""
                            label={send_request}
                            icon={<Box>送信済み</Box>}
                            cancelTooltipTitle="キャンセル"
                            deleteAction={() => cancelRequest(send_request)}
                        />
                    ))}
                    <Box display="flex" flexDirection="column" gap={1}>
                        <TextField
                            label="共有するアカウントのメールアドレス"
                            fullWidth
                            value={email}
                            onChange={handleChange}
                            error={!!error}
                            helperText={error}
                        />
                        <Box>
                            <Button color="error" onClick={() => setOpen(false)}>
                                閉じる
                            </Button>
                            <Button disabled={!!error} onClick={sendLinkRequests}>
                                リンク申請
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AccountShareButton;
