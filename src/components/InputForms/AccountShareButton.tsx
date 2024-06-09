import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  FormGroup,
  TextField,
  Tooltip,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
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
import { AccountLinkType } from "../../types";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";

const AccountShareButton = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const { Account } = useAccount();
  const [error, setError] = useState<string>();
  if (!Account) return null;

  const validateEmail = (email: string) => {
    // 単純なメールアドレスの正規表現パターン
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      return setError("無効なメールアドレスです");
    }
    if (email === Account.email) {
      return setError("自分のメールアドレスです");
    }
    const alreadyLinkedEmails = Account.linkedAccounts.filter(
      (linkedAccount) => linkedAccount.email === email
    );
    if (alreadyLinkedEmails && alreadyLinkedEmails.length > 0) {
      return setError("すでにリンクされています");
    }
    const alreadyRequestedEmails = Account.sendRequest.filter(
      (request) => request === email
    );
    if (alreadyRequestedEmails && alreadyRequestedEmails.length > 0) {
      return setError("すでにリンク依頼を出しています");
    }
    const alreadyReceivedEmails = Account.receiveRequest.filter(
      (receiver) => receiver.email === email
    );
    if (alreadyReceivedEmails && alreadyReceivedEmails.length > 0) {
      return setError("すでにリンク依頼を受けています");
    }
    return setError("");
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    setEmail(value);
    validateEmail(value);
  };

  const PickedAccount = {
    id: Account.id,
    email: Account.email,
    name: Account.name,
    icon: Account.icon,
  };

  const sendLinkRequests = async () => {
    if (!email) return setError("メールアドレスが入力されていません");

    const q = query(collection(db, "Accounts"), where("email", "==", email));
    const targetAccountDoc = await getDocs(q);
    if (targetAccountDoc.empty) {
      return setError("入力対象はアカウントを持っていません");
    }

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
    const docRef = doc(db, "Accounts", receivedRequest.id);
    getDoc(docRef).then((doc) => {
      if (doc.exists()) {
        updateDocAccount(doc.id, {
          sendRequest: doc
            .data()
            .sendRequest.filter((r: string) => r !== Account.email),
        });
      }
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
    const docRef = doc(db, "Accounts", receiveRequest.id);
    getDoc(docRef).then((doc) => {
      if (doc.exists()) {
        updateDocAccount(doc.id, {
          linkedAccounts: [...doc.data().linkedAccounts, PickedAccount],
          sendRequest: doc
            .data()
            .sendRequest.filter((r: string) => r !== Account.email),
        });
      }
    });
  };

  const cancelRequest = (request: string) => {
    updateDocAccount(Account.id, {
      sendRequest: Account.sendRequest.filter((r) => r !== request),
    });
    const q = query(collection(db, "Accounts"), where("email", "==", request));
    getDocs(q).then((docs) => {
      if (!docs.empty) {
        const targetDoc = docs.docs[0];
        updateDocAccount(targetDoc.id, {
          receiveRequest: targetDoc
            .data()
            .receiveRequest.filter((r: any) => r.email !== Account?.email),
        });
      }
    });
  };

  const unlinkAccount = (linkedAccount: AccountLinkType) => {
    updateDocAccount(Account.id, {
      linkedAccounts: Account.linkedAccounts.filter(
        (a) => a.id !== linkedAccount.id
      ),
    });
    const docRef = doc(db, "Accounts", linkedAccount.id);
    getDoc(docRef).then((doc) => {
      if (doc.exists()) {
        updateDocAccount(doc.id, {
          linkedAccounts: doc
            .data()
            .linkedAccounts.filter((a: any) => a.email !== Account?.email),
        });
      }
    });
  };

  return (
    <>
      <Button sx={{ m: 1 }} variant="contained" onClick={() => setOpen(true)}>
        共有
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          {Account.linkedAccounts.map((linkedAccount) => (
            <Box m={1} key={linkedAccount.id}>
              <Tooltip title={linkedAccount.email} placement="top">
                <Chip
                  variant="outlined"
                  label={linkedAccount.name}
                  avatar={<Avatar src={linkedAccount.icon} />}
                  deleteIcon={
                    <Tooltip title="解除">
                      <CancelIcon />
                    </Tooltip>
                  }
                  onDelete={() => unlinkAccount(linkedAccount)}
                />
              </Tooltip>
            </Box>
          ))}

          {Account.receiveRequest.map((receiveRequest) => (
            <Box m={1} key={receiveRequest.id}>
              <Tooltip title={receiveRequest.email} placement="top">
                <Chip
                  variant="outlined"
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
                  deleteIcon={
                    <Tooltip title="拒否する">
                      <CancelIcon />
                    </Tooltip>
                  }
                  onDelete={() => refuseRequest(receiveRequest)}
                />
              </Tooltip>
            </Box>
          ))}

          {Account.sendRequest.map((sendRequest) => (
            <Box m={1} key={sendRequest}>
              <Chip
                variant="outlined"
                label={sendRequest}
                icon={<Box>送信済み</Box>}
                deleteIcon={<CancelIcon />}
                onDelete={() => cancelRequest(sendRequest)}
              />
            </Box>
          ))}
          <FormGroup row={true} sx={{ gap: 1, m: 1 }}>
            <TextField
              label="共有するアカウントのメールアドレス"
              fullWidth
              value={email}
              onChange={handleChange}
              error={!!error}
              helperText={error}
            />
            <Button
              variant="contained"
              disabled={!!error}
              onClick={sendLinkRequests}
            >
              リンク申請
            </Button>
            <Button variant="outlined" onClick={() => setOpen(false)}>
              閉じる
            </Button>
          </FormGroup>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AccountShareButton;
