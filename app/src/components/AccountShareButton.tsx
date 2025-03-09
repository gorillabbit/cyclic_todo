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
import { AccountLinkType, AccountType } from '../types';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import { getAccount, updateAccount } from '../api/combinedApi';
import { useAccountStore } from '../stores/accountStore';

// TODO: メアドがlinkedAccountsなどになくなったので機能していない
const validateEmail = (email: string, account: AccountType): string => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) return '無効なメールアドレスです';
    if (email === account.email) return '自分のメールアドレスです';
    if (account.linkedAccounts.some((l) => l === email)) return 'すでにリンクされています';
    if (account.sendRequest.includes(email)) return 'すでにリンク依頼を出しています';
    if (account.receiveRequest.some((r) => r === email)) return 'すでにリンク依頼を受けています';
    return '';
};

const AccountShareButton = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>();
    const [linkedAccounts, setLinkedAccounts] = useState<AccountLinkType[]>([]);
    const [receiveRequests, setReceiveRequests] = useState<AccountLinkType[]>([]);

    const { Account } = useAccountStore();

    useEffect(() => {
        if (!Account) return;
        const fetchAccounts = async () => {
            try {
                const data = await getAccount({ id: Account.linkedAccounts });
                setLinkedAccounts(
                    data.map((account) => ({
                        id: account.id,
                        email: account.email,
                        name: account.name,
                        icon: account.icon,
                    }))
                );
                const receiveRequests = await getAccount({ id: Account.receiveRequest });
                setReceiveRequests(
                    receiveRequests.map((account) => ({
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

        if (Account?.linkedAccounts?.length) {
            fetchAccounts();
        }
    }, [Account?.linkedAccounts, Account?.receiveRequest]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value } = e.target;
        if (!Account) return;
        setEmail(value);
        setError(validateEmail(value, Account));
    };

    const sendLinkRequests = async () => {
        if (!Account) return;
        if (!email) return setError('メールアドレスが入力されていません');

        const targetAccountDoc = await getAccount({ email });
        if (!targetAccountDoc || targetAccountDoc.length === 0)
            return setError('入力対象はアカウントを持っていません');

        await updateAccount(Account.id, {
            sendRequest: [...Account.sendRequest, email],
        });

        const targetDoc = targetAccountDoc[0];
        await updateAccount(targetDoc.id, {
            receiveRequest: [...targetDoc.receiveRequest, Account.id],
        });
        setEmail('');
    };

    const refuseRequest = async (receivedRequest: AccountLinkType) => {
        if (!Account) return;
        updateAccount(Account.id, {
            receiveRequest: Account.receiveRequest.filter((r) => r !== receivedRequest.id),
        });
        const receivedRequestAccount = (await getAccount({ id: receivedRequest.id }))[0];

        await updateAccount(receivedRequestAccount.id, {
            sendRequest: receivedRequestAccount.sendRequest.filter((r) => r !== Account.email),
        });
    };

    const acceptRequest = async (receiveRequest: AccountLinkType) => {
        if (!Account) return;
        updateAccount(Account.id, {
            linkedAccounts: [...Account.linkedAccounts, receiveRequest.id],
            receiveRequest: Account.receiveRequest.filter((r) => r !== receiveRequest.id),
        });
        const receivedRequestAccount = (await getAccount({ id: receiveRequest.id }))[0];
        await updateAccount(receivedRequestAccount.id, {
            linkedAccounts: [...receivedRequestAccount.linkedAccounts, Account.id],
            sendRequest: receivedRequestAccount.sendRequest.filter((r) => r !== Account.email),
        });
    };

    const cancelRequest = async (request: string) => {
        if (!Account) return;
        await updateAccount(Account.id, {
            sendRequest: Account.sendRequest.filter((r) => r !== request),
        });
        const accounts = await getAccount({ email: request });
        if (!accounts || accounts.length === 0) return;
        const targetDoc = accounts[0];
        await updateAccount(targetDoc.id, {
            receiveRequest: targetDoc.receiveRequest.filter((r) => r !== Account.id),
        });
    };

    const unlinkAccount = async (linkedAccount: AccountLinkType) => {
        if (!Account) return;
        await updateAccount(Account.id, {
            linkedAccounts: Account.linkedAccounts.filter((a) => a !== linkedAccount.id),
        });
        const doc = (await getAccount({ id: linkedAccount.id }))[0];
        await updateAccount(doc.id, {
            linkedAccounts: doc.linkedAccounts.filter((a) => a !== Account.id),
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
                    {linkedAccounts.map((linkedAccount) => (
                        <ChipWrapper
                            key={linkedAccount.id}
                            tooltipTitle={linkedAccount.id}
                            label={linkedAccount.id}
                            avatar={<Avatar src={linkedAccount.id} />}
                            cancelTooltipTitle="解除"
                            deleteAction={() => unlinkAccount(linkedAccount)}
                        />
                    ))}

                    {receiveRequests.map((receiveRequest) => (
                        <ChipWrapper
                            key={receiveRequest.id}
                            tooltipTitle={receiveRequest.id}
                            label={receiveRequest.id}
                            icon={
                                <Tooltip title="承認する">
                                    <Box
                                        sx={{ cursor: 'pointer' }}
                                        onClick={() => acceptRequest(receiveRequest)}
                                    >
                                        <CheckCircleOutlineIcon />
                                    </Box>
                                </Tooltip>
                            }
                            cancelTooltipTitle="拒否する"
                            deleteAction={() => refuseRequest(receiveRequest)}
                        />
                    ))}

                    {Account?.sendRequest?.map((sendRequest) => (
                        <ChipWrapper
                            key={sendRequest}
                            tooltipTitle=""
                            label={sendRequest}
                            icon={<Box>送信済み</Box>}
                            cancelTooltipTitle="キャンセル"
                            deleteAction={() => cancelRequest(sendRequest)}
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
