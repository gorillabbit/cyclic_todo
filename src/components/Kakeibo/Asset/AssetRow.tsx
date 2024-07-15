import {
  TableRow,
  TableCell,
  TextField,
  Button,
  IconButton,
  TextFieldVariants,
  TextFieldProps,
} from "@mui/material";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  AssetListType,
  MethodListType,
  PurchaseListType,
  AssetLogType,
} from "../../../types";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  addDocAssetLog,
  deleteDocAsset,
  deleteDocMethod,
  updateDocAsset,
} from "../../../firebase";
import {
  numericProps,
  useLastAssetLog,
} from "../../../utilities/purchaseUtilities";
import DeleteConfirmDialog from "../DeleteConfirmDialog";
import { useIsSmall } from "../../../hooks/useWindowSize";
import { useMethod } from "../../../hooks/useData";
import TableCellWrapper from "../TableCellWrapper";
import { useNextMonthFirstDay } from "../../../utilities/dateUtilities";
import MethodList from "./MethodList";

const tableInputStyle: {
  sx: TextFieldProps["sx"];
  variant: TextFieldVariants;
  size: "small";
} = {
  sx: { maxWidth: 150 },
  variant: "outlined",
  size: "small",
};

type UnderHalfRowProps = {
  isNameChanged: boolean;
  isBalanceChanged: boolean;
  removeAsset: () => void;
  saveChanges: () => void;
};

const UnderHalfRow = memo(
  ({
    isNameChanged,
    isBalanceChanged,
    saveChanges,
    removeAsset,
  }: UnderHalfRowProps) => (
    <TableCellWrapper align="right" colSpan={2}>
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
  assetNameInput: string;
  assetId: string;
  handleAssetInput: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filteredMethodList: MethodListType[];
  handleBalanceInput: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  balanceInput: number | undefined;
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  deleteAction: () => void;
  isSmall: boolean;
  lastAssetLog: AssetLogType;
  monthEndAssetLog: AssetLogType;
  filteredPurchases: PurchaseListType[];
};

const PlainAssetRow = memo(
  ({
    open,
    setOpen,
    assetNameInput,
    handleAssetInput,
    isNameChanged,
    isBalanceChanged,
    saveChanges,
    removeAsset,
    filteredMethodList,
    handleBalanceInput,
    balanceInput,
    lastAssetLog,
    openDialog,
    setOpenDialog,
    deleteAction,
    isSmall,
    monthEndAssetLog,
    assetId,
    filteredPurchases,
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
            {...tableInputStyle}
            value={assetNameInput}
            name="name"
            onChange={handleAssetInput}
          />
        </TableCellWrapper>
        <TableCellWrapper>
          <TextField
            {...tableInputStyle}
            value={isBalanceChanged ? balanceInput : lastAssetLog.balance}
            name="balance"
            onChange={handleBalanceInput}
            inputProps={numericProps}
          />
        </TableCellWrapper>
        <TableCellWrapper>{monthEndAssetLog.balance}</TableCellWrapper>
        {!isSmall && (
          <UnderHalfRow
            {...{
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
              isNameChanged,
              isBalanceChanged,
              saveChanges,
              removeAsset,
            }}
          />
        </TableRow>
      )}

      <MethodList
        open={open}
        assetId={assetId}
        filteredMethodList={filteredMethodList}
        filteredPurchases={filteredPurchases}
      />
      <DeleteConfirmDialog
        target={assetNameInput}
        {...{ openDialog, setOpenDialog, deleteAction }}
      />
    </>
  )
);

const AssetRow = memo(
  ({
    asset,
    filteredPurchases,
  }: {
    asset: AssetListType;
    filteredPurchases: PurchaseListType[];
  }) => {
    const [balanceInput, setBalanceInput] = useState<number | undefined>(
      undefined
    );
    const [today, setToday] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [assetNameInput, setAssetNameInput] = useState<string>(asset.name);
    const lastAssetLog = useLastAssetLog(asset.id, today);
    const monthEndAssetLog = useLastAssetLog(asset.id, useNextMonthFirstDay());
    const isSmall = useIsSmall();

    // 支払いがあると、必ず月末の残高が更新されるためそれをトリガーに再取得
    useEffect(() => {
      setToday(new Date());
    }, [monthEndAssetLog]);

    const handleAssetInput = useCallback(
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setAssetNameInput(e.target.value);
      },
      []
    );

    const handleBalanceInput = useCallback(
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const numValue = Number(e.target.value);
        Number.isNaN(numValue)
          ? alert("不適切な入力です")
          : setBalanceInput(numValue);
      },
      []
    );

    const isNameChanged = useMemo(
      () => asset.name !== assetNameInput,
      [asset.name, assetNameInput]
    );

    const isBalanceChanged = useMemo(
      () => balanceInput !== undefined && lastAssetLog.balance !== balanceInput,
      [balanceInput, lastAssetLog.balance]
    );

    console.log(isBalanceChanged, lastAssetLog.balance, balanceInput);

    // 配列を更新してもreactが更新されないため。stateで更新する必要がある
    const saveChanges = useCallback(() => {
      if (isBalanceChanged) {
        addDocAssetLog({
          assetId: asset.id,
          methodId: "",
          balance: balanceInput ?? 0,
          date: today,
        });
      }
      updateDocAsset(asset.id, { name: assetNameInput });
    }, [asset.id, assetNameInput, balanceInput, isBalanceChanged, today]);

    const { methodList } = useMethod();
    const filteredMethodList = useMemo(
      () => methodList.filter((method) => method.assetId === asset.id),
      [methodList, asset.id]
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

    const plainProps = {
      open,
      setOpen,
      assetNameInput,
      handleAssetInput,
      isNameChanged,
      isBalanceChanged,
      saveChanges,
      removeAsset,
      filteredMethodList,
      handleBalanceInput,
      balanceInput,
      openDialog,
      setOpenDialog,
      deleteAction,
      isSmall,
      lastAssetLog,
      monthEndAssetLog,
      assetId: asset.id,
      filteredPurchases,
    };

    return <PlainAssetRow {...plainProps} />;
  }
);

export default AssetRow;
