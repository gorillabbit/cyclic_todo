import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  FormGroup,
  TextField,
  Tooltip,
} from "@mui/material";
import { getAuth } from "firebase/auth";
import { ChangeEvent, useEffect, useState } from "react";
import {
  addDocAccountLink,
  addDocAccounts,
  db,
  deleteDocAccountLinks,
  updateDocAccountLinks,
  updateDocAccounts,
} from "../../firebase";
import { useAccount } from "../Context/AccountContext";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { AccountLinkType } from "../../types";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";

const auth = getAuth();

const AccountShareButton = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const { Account } = useAccount();

  const [requests, setRequests] = useState<AccountLinkType[]>();
  const [receivers, setReceivers] = useState<AccountLinkType[]>();

  useEffect(() => {
    if (!auth.currentUser) {
      return;
    }
    //requestsの取得
    const fetchRequests = () => {
      const AccountQuery = query(
        collection(db, "AccountLinks"),
        where("requester", "==", auth.currentUser?.email)
      );
      return onSnapshot(AccountQuery, (querySnapshot) => {
        const AccountLinksData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as AccountLinkType),
        }));
        setRequests(AccountLinksData);
      });
    };
    const unsubscribeRequests = fetchRequests();

    //receiversの取得
    const fetchReceivers = () => {
      const AccountQuery = query(
        collection(db, "AccountLinks"),
        where("receiver", "==", auth.currentUser?.email)
      );
      return onSnapshot(AccountQuery, (querySnapshot) => {
        const AccountLinksData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as AccountLinkType),
        }));
        setReceivers(AccountLinksData);
      });
    };
    const unsubscribeReceivers = fetchReceivers();

    // コンポーネントがアンマウントされるときに購読を解除
    return () => {
      unsubscribeRequests();
      unsubscribeReceivers();
    };
  }, [auth.currentUser]);

  //リクエスト送信側のAccountsは受信側から操作しないので、Acceptされたら加える。リンクが解除されたら削除する
  useEffect(() => {
    const acceptedRequests = requests
      ?.filter((request) => request.status === "accepted")
      .map((request) => request.receiver);
    if (acceptedRequests && acceptedRequests?.length > 0) {
      if (Account) {
        updateDocAccounts(Account.id, {
          linkedAccounts: requests
            ?.filter((request) => request.status === "accepted")
            .map((request) => request.receiver),
        });
      } else {
        addDocAccounts({
          uid: auth.currentUser?.uid,
          email: auth.currentUser?.email,
          name: auth.currentUser?.displayName,
          linkedAccounts: requests
            ?.filter((request) => request.status === "accepted")
            .map((request) => request.receiver),
        });
      }
    }
  }, [Account, requests]);

  const [error, setError] = useState<string>();
  const validateEmail = (email: string) => {
    if (email === auth.currentUser?.email) {
      return setError("自分のメールアドレスです");
    }
    const alreadyRequestedEmails = requests?.filter(
      (request) => request.receiver === email
    );
    if (alreadyRequestedEmails && alreadyRequestedEmails.length > 0) {
      return setError("すでに共有依頼を出しています");
    }
    const alreadyReceivedEmails = receivers?.filter(
      (receiver) => receiver.requester === email
    );
    if (alreadyReceivedEmails && alreadyReceivedEmails.length > 0) {
      return setError("すでに共有依頼を受けています");
    }
    // 単純なメールアドレスの正規表現パターン
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      return setError("無効なメールアドレスです");
    }
    return setError("");
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    setEmail(value);
    validateEmail(value);
  };

  const saveAccounts = () => {
    if (email) {
      addDocAccountLink({
        requester: auth.currentUser?.email,
        receiver: email,
        status: "pending",
      });
      setEmail("");
      setOpen(false);
    } else {
      setError("メールアドレスが入力されていません");
    }
  };

  const refuseRequest = (receivedRequest: AccountLinkType) => {
    updateDocAccountLinks(receivedRequest.id, { status: "rejected" });
  };

  const acceptRequest = (receivedRequest: AccountLinkType) => {
    updateDocAccountLinks(receivedRequest.id, { status: "accepted" });
    if (Account) {
      updateDocAccounts(Account.id, {
        linkedAccounts: [...Account.linkedAccounts, receivedRequest.requester],
      });
    } else {
      addDocAccounts({
        uid: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        name: auth.currentUser?.displayName,
        linkedAccounts: [receivedRequest.requester],
      });
    }
  };

  const cancelRequest = (request: AccountLinkType) => {
    deleteDocAccountLinks(request.id);
  };

  return (
    <>
      <Button sx={{ m: 1 }} variant="contained" onClick={() => setOpen(true)}>
        共有
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          {receivers?.map((receivedRequest) =>
            receivedRequest.status === "pending" ? (
              <Box m={1} key={receivedRequest.id}>
                <Chip
                  variant="outlined"
                  label={receivedRequest.requester}
                  icon={
                    <Tooltip title="承認する">
                      <Box
                        sx={{ cursor: "pointer" }}
                        onClick={() => acceptRequest(receivedRequest)}
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
                  onDelete={() => refuseRequest(receivedRequest)}
                />
              </Box>
            ) : receivedRequest.status === "accepted" ? (
              <Box m={1} key={receivedRequest.id}>
                <Chip
                  variant="outlined"
                  color="success"
                  label={receivedRequest.requester}
                  icon={<FileDownloadDoneIcon />}
                  deleteIcon={
                    <Tooltip title="解除">
                      <CancelIcon />
                    </Tooltip>
                  }
                  onDelete={() => cancelRequest(receivedRequest)}
                />
              </Box>
            ) : (
              <></>
            )
          )}
          {requests?.map((request) =>
            request.status === "pending" ? (
              <Box m={1} key={request.id}>
                <Chip
                  variant="outlined"
                  label={request.receiver}
                  icon={<Box>送信済み</Box>}
                  deleteIcon={
                    <Tooltip title="キャンセル">
                      <CancelIcon />
                    </Tooltip>
                  }
                  onDelete={() => cancelRequest(request)}
                />
              </Box>
            ) : request.status === "accepted" ? (
              <Box m={1} key={request.id}>
                <Chip
                  variant="outlined"
                  color="success"
                  label={request.receiver}
                  icon={<FileDownloadDoneIcon />}
                  deleteIcon={
                    <Tooltip title="解除">
                      <CancelIcon />
                    </Tooltip>
                  }
                  onDelete={() => cancelRequest(request)}
                />
              </Box>
            ) : (
              <></>
            )
          )}
          <FormGroup row={true} sx={{ gap: 1, m: 1 }}>
            <TextField
              label="共有するアカウントのメールアドレス"
              fullWidth
              value={email}
              multiline
              onChange={(e) => handleChange(e)}
              placeholder="説明を入力"
              error={!!error}
              helperText={error}
            />
            <Button
              variant="contained"
              disabled={!!error}
              onClick={saveAccounts}
            >
              リンク申請
            </Button>
          </FormGroup>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AccountShareButton;
