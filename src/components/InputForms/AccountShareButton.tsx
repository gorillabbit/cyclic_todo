import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  TextField,
  Tooltip,
} from "@mui/material";
import { ChangeEvent, memo, useState } from "react";
import { updateDocAccount, db } from "../../firebase";
import { useAccount } from "../Context/AccountContext";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { AccountLinkType, AccountType } from "../../types";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";

const validateEmail = (email: string, account: AccountType): string => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return "無効なメールアドレスです";
  if (email === account.email) return "自分のメールアドレスです";
  if (account.linkedAccounts.some((l) => l.email === email))
    return "すでにリンクされています";
  if (account.sendRequest.includes(email))
    return "すでにリンク依頼を出しています";
  if (account.receiveRequest.some((r) => r.email === email))
    return "すでにリンク依頼を受けています";
  return "";
};

const AccountShareButton = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const { Account } = useAccount();
  const [error, setError] = useState<string>();
  if (!Account) return null;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    setEmail(value);
    setError(validateEmail(value, Account));
  };

  const PickedAccount = {
    id: Account.id,
    email: Account.email,
    name: Account.name,
    icon: Account.icon,
  };

  const AccountCollection = collection(db, "Accounts");
  const getAccountDoc = async (id: string) => {
    const accountDoc = await getDoc(doc(AccountCollection, id));
    if (!accountDoc.exists()) throw new Error("Document not found");
    return { ...accountDoc.data(), id: accountDoc.id } as AccountType;
  };

  const sendLinkRequests = async () => {
    if (!email) return setError("メールアドレスが入力されていません");

    const q = query(AccountCollection, where("email", "==", email));
    const targetAccountDoc = await getDocs(q);
    if (targetAccountDoc.empty)
      return setError("入力対象はアカウントを持っていません");

    updateDocAccount(Account.id, {
      sendRequest: [...Account.sendRequest, email],
    });
    const targetDoc = targetAccountDoc.docs[0];
    updateDocAccount(targetDoc.id, {
      receiveRequest: [...targetDoc.data().receiveRequest, PickedAccount],
    });
    setEmail("");
  };

  const refuseRequest = (receivedRequest: AccountLinkType) => {
    updateDocAccount(Account.id, {
      receiveRequest: Account.receiveRequest.filter(
        (r) => r.id !== receivedRequest.id
      ),
    });
    getAccountDoc(receivedRequest.id).then((doc) => {
      updateDocAccount(doc.id, {
        sendRequest: doc.sendRequest.filter((r) => r !== Account.email),
      });
    });
  };

  const acceptRequest = async (receiveRequest: AccountLinkType) => {
    // 自分の方で受け取ったリクエストをリンクに加える、リクエストを削除する
    updateDocAccount(Account.id, {
      linkedAccounts: [...Account.linkedAccounts, receiveRequest],
      receiveRequest: Account.receiveRequest.filter(
        (r) => r.id !== receiveRequest.id
      ),
    });
    getAccountDoc(receiveRequest.id).then((doc) => {
      updateDocAccount(doc.id, {
        linkedAccounts: [...doc.linkedAccounts, PickedAccount],
        sendRequest: doc.sendRequest.filter((r) => r !== Account.email),
      });
    });
  };

  const cancelRequest = (request: string) => {
    updateDocAccount(Account.id, {
      sendRequest: Account.sendRequest.filter((r) => r !== request),
    });
    const q = query(AccountCollection, where("email", "==", request));
    getDocs(q).then((docs) => {
      if (docs.empty) return;
      const targetDoc = docs.docs[0];
      updateDocAccount(targetDoc.id, {
        receiveRequest: targetDoc
          .data()
          .receiveRequest.filter(
            (r: AccountLinkType) => r.email !== Account.email
          ),
      });
    });
  };

  const unlinkAccount = (linkedAccount: AccountLinkType) => {
    updateDocAccount(Account.id, {
      linkedAccounts: Account.linkedAccounts.filter(
        (a) => a.id !== linkedAccount.id
      ),
    });
    getAccountDoc(linkedAccount.id).then((doc) => {
      updateDocAccount(doc.id, {
        linkedAccounts: doc.linkedAccounts.filter(
          (a) => a.email !== Account.email
        ),
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
          {Account.linkedAccounts.map((linkedAccount) => (
            <ChipWrapper
              key={linkedAccount.id}
              tooltipTitle={linkedAccount.email}
              label={linkedAccount.name}
              avatar={<Avatar src={linkedAccount.icon} />}
              cancelTooltipTitle="解除"
              deleteAction={() => unlinkAccount(linkedAccount)}
            />
          ))}

          {Account.receiveRequest.map((receiveRequest) => (
            <ChipWrapper
              key={receiveRequest.id}
              tooltipTitle={receiveRequest.email}
              label={receiveRequest.name}
              icon={
                <Tooltip title="承認する">
                  <Box
                    sx={{ cursor: "pointer" }}
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

          {Account.sendRequest.map((sendRequest) => (
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
