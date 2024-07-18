import { IconButton, Chip, TableRow } from "@mui/material";
import { memo, useMemo } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PaymentsIcon from "@mui/icons-material/Payments";
import PurchaseRowButtons from "./PurchaseRowButtons";
import TableCellWrapper from "../../TableCellWrapper";
import { PurchaseDataType } from "../../../../types/purchaseTypes";

type UnderHalfRowProps = {
  isGroup: boolean;
  editFormData: PurchaseDataType;
  setIsEdit: (value: React.SetStateAction<boolean>) => void;
  setIsEditPrice: React.Dispatch<React.SetStateAction<boolean>>;
  updatePurchases: PurchaseDataType[];
};

const UnderHalfRow = memo(
  ({
    editFormData,
    isGroup,
    setIsEdit,
    setIsEditPrice,
    updatePurchases,
  }: UnderHalfRowProps) => (
    <>
      <TableCellWrapper>
        {editFormData.difference}
        {editFormData.method.timing === "翌月" &&
          editFormData.childPurchaseId && <Chip label="翌月" />}
        {editFormData.isUncertain && <Chip label="未確" />}
      </TableCellWrapper>
      <TableCellWrapper label={editFormData.balance} />
      <TableCellWrapper label={editFormData.description} />
      <TableCellWrapper>
        <PaymentsIcon
          color={editFormData.difference > 0 ? "success" : "error"}
        />
      </TableCellWrapper>
      <TableCellWrapper>
        {!isGroup && (
          <PurchaseRowButtons
            purchase={editFormData}
            setIsEdit={setIsEdit}
            setIsEditPrice={setIsEditPrice}
            isUncertain={editFormData.isUncertain}
            updatePurchases={updatePurchases}
          />
        )}
      </TableCellWrapper>
    </>
  )
);

type PlainNormalPurchaseRowProps = UnderHalfRowProps & {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  isSmall: boolean;
  rowColor: string;
};

const PlainNormalPurchaseRow = memo(
  ({
    isGroup,
    setOpen,
    open,
    editFormData,
    isSmall,
    setIsEdit,
    setIsEditPrice,
    rowColor,
    updatePurchases,
  }: PlainNormalPurchaseRowProps): JSX.Element => (
    <>
      <TableRow sx={{ pb: 0.5, bgcolor: rowColor }}>
        <TableCellWrapper>
          {isGroup && (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCellWrapper>
        <TableCellWrapper
          label={editFormData.date.toLocaleDateString() + "日"}
        />
        <TableCellWrapper label={editFormData.title} />
        <TableCellWrapper label={editFormData.category} />
        <TableCellWrapper label={editFormData.method.label} />
        {!isSmall && (
          <UnderHalfRow
            {...{
              setIsEdit,
              setIsEditPrice,
              editFormData,
              isGroup,
              updatePurchases,
            }}
          />
        )}
      </TableRow>
      {isSmall && (
        <TableRow sx={{ bgcolor: rowColor }}>
          <TableCellWrapper />
          <UnderHalfRow
            {...{
              setIsEdit,
              setIsEditPrice,
              editFormData,
              isGroup,
              updatePurchases,
            }}
          />
        </TableRow>
      )}
    </>
  )
);

const NormalPurchaseRow = (
  props: UnderHalfRowProps & {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    open: boolean;
    isSmall: boolean;
    index: number;
  }
) => {
  const rowColor = useMemo(
    () => (props.index % 2 === 0 ? "#f0f0f0" : "white"),
    [props.index]
  );
  const plainProps = { ...props, rowColor };
  return <PlainNormalPurchaseRow {...plainProps} />;
};

export default NormalPurchaseRow;
