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
  PurchaseListType,
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
import {
  sumSpentAndIncome,
  numericProps,
} from "../../../utilities/purchaseUtilities";
import { Timestamp } from "firebase/firestore";
import { getUnixTime } from "date-fns";
import DeleteConfirmDialog from "../DeleteConfirmDialog";
import { useIsSmall } from "../../../hooks/useWindowSize";
import { useMethod, useTab, usePurchase } from "../../../hooks/useData";
import TableCellWrapper from "../TableCellWrapper";

type UnderHalfRowProps = {
  isNameChanged: boolean;
  isBalanceChanged: boolean;
  removeAsset: () => void;
  saveChanges: () => void;
  updateLog: () => void;
  isAddedPurchases: boolean;
};

const UnderHalfRow = memo(
  ({
    isAddedPurchases,
    updateLog,
    isNameChanged,
    isBalanceChanged,
    saveChanges,
    removeAsset,
  }: UnderHalfRowProps) => (
    <TableCellWrapper align="right" colSpan={2}>
      <Button
        sx={{ mx: 0.5 }}
        variant={isAddedPurchases ? "contained" : "text"}
        color="primary"
        disabled={!isAddedPurchases}
        onClick={updateLog}
      >
        更新
      </Button>
      <Button
        variant={isNameChanged || isBalanceChanged ? "contained" : "text"}
        color="primary"
        disabled={!isNameChanged && !isBalanceChanged}
        onClick={saveChanges}
      >
        変更
      </Button>
      <IconButton onClick={removeAsset} color="error">
        <DeleteIcon />
      </IconButton>
    </TableCellWrapper>
  )
);

type PlainAssetRowProps = UnderHalfRowProps & {
  assetInput: AssetType;
  handleAssetInput: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filteredMethodList: MethodListType[];
  addMethod: () => void;
  handleBalanceInput: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  balanceInput: number;
  currentBalance: number;
  displayBalance: number;
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  deleteAction: () => void;
  isSmall: boolean;
  latestLog: BalanceLog;
  methodSpent: number;
  methodPurchase: (methodId: string) => { income: number; spent: number };
};

const PlainAssetRow = memo(
  ({
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
    handleBalanceInput,
    balanceInput,
    isAddedPurchases,
    currentBalance,
    displayBalance,
    openDialog,
    setOpenDialog,
    deleteAction,
    isSmall,
    latestLog,
    methodSpent,
    methodPurchase,
  }: PlainAssetRowProps): JSX.Element => (
    <>
      <TableRow>
        <TableCell padding="none">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCellWrapper>
          <TextField
            variant="outlined"
            value={assetInput.name}
            name="name"
            onChange={handleAssetInput}
            size="small"
            sx={{ maxWidth: 150 }}
          />
        </TableCellWrapper>
        <TableCellWrapper sx={{ display: "flex" }}>
          <TextField
            variant="outlined"
            value={isBalanceChanged ? balanceInput : displayBalance}
            name="balance"
            onChange={handleBalanceInput}
            size="small"
            inputProps={numericProps}
            sx={{ maxWidth: 150 }}
          />
          {isAddedPurchases && (
            <Box alignContent="center" ml={1}>
              {"→ " + currentBalance}
            </Box>
          )}
        </TableCellWrapper>
        <TableCellWrapper>
          {(isBalanceChanged ? balanceInput : displayBalance) + methodSpent}
        </TableCellWrapper>
        <TableCellWrapper>
          {latestLog.timestamp.toDate().toLocaleDateString()}
        </TableCellWrapper>
        {!isSmall && (
          <UnderHalfRow
            {...{
              latestLog,
              isAddedPurchases,
              updateLog,
              isNameChanged,
              isBalanceChanged,
              saveChanges,
              removeAsset,
            }}
          />
        )}
      </TableRow>
      {isSmall && (
        <TableRow>
          <TableCellWrapper colSpan={2} />
          <UnderHalfRow
            {...{
              latestLog,
              isAddedPurchases,
              updateLog,
              isNameChanged,
              isBalanceChanged,
              saveChanges,
              removeAsset,
            }}
          />
        </TableRow>
      )}

      <TableRow>
        <TableCell sx={{ paddingY: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table size="small" aria-label="purchases">
              <TableHead>
                <TableRow>
                  <TableCellWrapper label="名前" />
                  <TableCellWrapper label="今月の収入" />
                  <TableCellWrapper label="今月の支出" />
                  <TableCellWrapper label="決済タイミング" />
                  <TableCellWrapper colSpan={2} />
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMethodList.map((method) => (
                  <MethodList
                    method={method}
                    key={method.id}
                    methodPurchaseSum={methodPurchase(method.id)}
                  />
                ))}
              </TableBody>
            </Table>
            <IconButton onClick={addMethod} color="primary">
              <AddCircleOutlineIcon />
            </IconButton>
          </Collapse>
        </TableCell>
      </TableRow>
      <DeleteConfirmDialog
        target={assetInput.name}
        {...{ openDialog, setOpenDialog, deleteAction }}
      />
    </>
  )
);

const AssetRow = ({
  asset,
  methodSpent,
  filteredPurchases,
}: {
  asset: AssetListType;
  methodSpent: number;
  filteredPurchases: PurchaseListType[];
}) => {
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [assetInput, setAssetInput] = useState<AssetListType>(asset);
  const [balanceLogs, setBalanceLogs] = useState(asset.balanceLog);
  const latestLog = balanceLogs.slice(-1)[0];
  const displayBalance = latestLog.balance;
  const [balanceInput, setBalanceInput] = useState<number>(displayBalance);
  const isSmall = useIsSmall();

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
  const { tabId } = useTab();
  const addMethod = useCallback(() => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const newMethod: MethodType = {
        ...defaultMethod,
        userId,
        assetId: asset.id,
        tabId,
      };
      addDocMethod(newMethod);
    }
  }, [asset.id, auth.currentUser, tabId]);

  const { purchaseList } = usePurchase();
  const relatedPurchases = sumSpentAndIncome(
    purchaseList.filter(
      (purchase) =>
        purchase.method.assetId === asset.id &&
        purchase.date.toDate() < new Date() &&
        latestLog.timestamp.toDate() < purchase.date.toDate() &&
        !purchase.childPurchaseId
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

  const methodPurchase = useCallback(
    (methodId: string) => {
      const methodPurchaseList = filteredPurchases.filter(
        (purchase) => purchase.method?.id === methodId
      );
      return {
        income: sumSpentAndIncome(
          methodPurchaseList.filter((purchase) => purchase.income)
        ),
        spent: sumSpentAndIncome(
          methodPurchaseList.filter((purchase) => !purchase.income)
        ),
      };
    },
    [filteredPurchases]
  );

  const plainProps = {
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
    handleBalanceInput,
    balanceInput,
    isAddedPurchases,
    currentBalance,
    displayBalance,
    openDialog,
    setOpenDialog,
    deleteAction,
    isSmall,
    latestLog,
    methodSpent,
    methodPurchase,
  };

  return <PlainAssetRow {...plainProps} />;
};

export default AssetRow;
