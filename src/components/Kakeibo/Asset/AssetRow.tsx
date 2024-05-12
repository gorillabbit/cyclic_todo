import {
  TableRow,
  TableCell,
  Collapse,
  TextField,
  Button,
  IconButton,
  Table,
  TableBody,
  TableHead,
  Box,
} from "@mui/material";
import { memo, useCallback, useMemo, useState } from "react";
import {
  AssetListType,
  AssetType,
  MethodListType,
  MethodType,
  BalanceLog,
  defaultMethod,
} from "../../../types";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  addDocMethod,
  deleteDocAsset,
  deleteDocMethod,
  updateDocAsset,
} from "../../../firebase";
import { getAuth } from "firebase/auth";
import MethodList from "./MethodList";
import { useMethod } from "../../Context/MethodContext";
import {
  calculateSpentAndIncomeResult,
  numericProps,
} from "../../../utilities/purchaseUtilities";
import { usePurchase } from "../../Context/PurchaseContext";
import { Timestamp } from "firebase/firestore";
import { getUnixTime } from "date-fns";
import DeleteConfirmDialog from "../DeleteConfirmDialog";

type PlainAssetRowProps = {
  asset: AssetListType;
  assetInput: AssetType;
  handleAssetInput: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  isNameChanged: boolean;
  isBalanceChanged: boolean;
  removeAsset: () => void;
  saveChanges: () => void;
  updateLog: () => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filteredMethodList: MethodListType[];
  addMethod: () => void;
  relatedPurchases: number;
  handleBalanceInput: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  balanceInput: number;
  isAddedPurchases: boolean;
  currentBalance: number;
  displayBalance: number;
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  deleteAction: () => void;
};

const PlainAssetRow = memo(
  (props: PlainAssetRowProps): JSX.Element => (
    <>
      <TableRow>
        <TableCell sx={{ paddingX: 0.5 }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => props.setOpen(!props.open)}
          >
            {props.open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ paddingX: 0.5 }}>
          <TextField
            variant="outlined"
            value={props.assetInput.name ?? props.asset.name}
            name="name"
            onChange={props.handleAssetInput}
            size="small"
          />
        </TableCell>
        <TableCell sx={{ display: "flex", paddingX: 0.5 }}>
          <TextField
            variant="outlined"
            value={
              props.isBalanceChanged ? props.balanceInput : props.displayBalance
            }
            name="balance"
            onChange={props.handleBalanceInput}
            size="small"
            inputProps={numericProps}
          />
          {props.isAddedPurchases && (
            <Box alignContent="center" ml={1}>
              {"→ " + props.currentBalance}
            </Box>
          )}
        </TableCell>
        <TableCell sx={{ paddingX: 0.5 }}>
          <Button
            variant="contained"
            color="primary"
            disabled={!props.isAddedPurchases}
            onClick={props.updateLog}
          >
            更新
          </Button>
        </TableCell>
        <TableCell sx={{ paddingX: 0.5 }}>
          <Button
            variant="contained"
            color="primary"
            disabled={!props.isNameChanged && !props.isBalanceChanged}
            onClick={props.saveChanges}
          >
            変更
          </Button>
        </TableCell>
        <TableCell sx={{ paddingX: 0.5 }}>
          <IconButton onClick={props.removeAsset} color="error">
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{ paddingY: 0 }} colSpan={6}>
          <Collapse in={props.open} timeout="auto" unmountOnExit>
            <Table size="small" aria-label="purchases">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ paddingX: 0.5 }}>名前</TableCell>
                  <TableCell sx={{ paddingX: 0.5 }}>決済タイミング</TableCell>
                  <TableCell sx={{ paddingX: 0.5 }} colSpan={2} />
                </TableRow>
              </TableHead>
              <TableBody>
                {props.filteredMethodList.map((method) => (
                  <MethodList method={method} key={method.id} />
                ))}
              </TableBody>
            </Table>
            <IconButton onClick={props.addMethod} color="primary">
              <AddCircleOutlineIcon />
            </IconButton>
          </Collapse>
        </TableCell>
      </TableRow>
      <DeleteConfirmDialog
        target={props.asset.name}
        openDialog={props.openDialog}
        setOpenDialog={props.setOpenDialog}
        deleteAction={props.deleteAction}
      />
    </>
  )
);

const AssetRow = ({ asset }: { asset: AssetListType }) => {
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [assetInput, setAssetInput] = useState<AssetListType>(asset);
  const [balanceLogs, setBalanceLogs] = useState(asset.balanceLog);
  const latestLog = balanceLogs.slice(-1)[0];
  const displayBalance = latestLog.balance;
  const [balanceInput, setBalanceInput] = useState<number>(displayBalance);

  const handleAssetInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setAssetInput((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleBalanceInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    const numValue = Number(value);
    Number.isNaN(numValue)
      ? alert("不適切な入力です")
      : setBalanceInput(numValue);
  };

  const isNameChanged = useMemo(
    () => asset.name !== assetInput.name,
    [asset.name, assetInput.name]
  );

  const isBalanceChanged = useMemo(
    () => displayBalance !== balanceInput,
    [balanceInput, displayBalance]
  );

  const getNewLog = useCallback(
    (balance: number): BalanceLog => ({
      timestamp: new Timestamp(getUnixTime(new Date()), 0),
      balance: balance,
    }),
    []
  );

  // 配列を更新してもreactが更新されないため。stateで更新する必要がある
  const saveChanges = useCallback(() => {
    const updates = assetInput;
    const newLog = getNewLog(balanceInput);
    if (isBalanceChanged) {
      updates.balanceLog.push(newLog);
    }
    updateDocAsset(asset.id, updates);
    setBalanceLogs((prev) => [...prev, newLog]);
  }, [asset.id, assetInput, balanceInput, getNewLog, isBalanceChanged]);

  const { methodList } = useMethod();
  const filteredMethodList = methodList.filter(
    (method) => method.assetId === asset.id
  );

  const removeAsset = useCallback(() => {
    setOpenDialog(true);
  }, []);

  const deleteAction = useCallback(() => {
    deleteDocAsset(asset.id);
    if (filteredMethodList.length > 0) {
      filteredMethodList.forEach((method) => deleteDocMethod(method.id));
    }
  }, [asset.id, filteredMethodList]);

  const auth = getAuth();
  const addMethod = useCallback(() => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const newMethod: MethodType = {
        ...defaultMethod,
        userId,
        assetId: asset.id,
      };
      addDocMethod(newMethod);
    }
  }, [asset.id, auth.currentUser]);

  const { purchaseList } = usePurchase();
  const relatedPurchases = calculateSpentAndIncomeResult(
    purchaseList.filter(
      (purchase) =>
        purchase.method?.assetId === asset.id &&
        purchase.date.toDate() < new Date() &&
        latestLog.timestamp.toDate() < purchase.date.toDate()
    )
  );

  const currentBalance = displayBalance + relatedPurchases;
  const isAddedPurchases = relatedPurchases !== 0;
  const updateLog = useCallback(() => {
    const balanceLog = getNewLog(currentBalance);
    updateDocAsset(asset.id, {
      balanceLog: [...assetInput.balanceLog, balanceLog],
    });
    setBalanceLogs((prev) => [...prev, balanceLog]);
    setBalanceInput(currentBalance);
  }, [asset.id, assetInput.balanceLog, currentBalance, getNewLog]);

  const plainProps = {
    asset,
    open,
    setOpen,
    assetInput,
    handleAssetInput,
    isNameChanged,
    isBalanceChanged,
    saveChanges,
    updateLog,
    removeAsset,
    filteredMethodList,
    addMethod,
    relatedPurchases,
    handleBalanceInput,
    balanceInput,
    isAddedPurchases,
    currentBalance,
    displayBalance,
    openDialog,
    setOpenDialog,
    deleteAction,
  };

  return <PlainAssetRow {...plainProps} />;
};

export default AssetRow;
