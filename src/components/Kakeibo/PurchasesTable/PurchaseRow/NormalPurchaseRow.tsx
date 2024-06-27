import { IconButton, Chip, TableRow } from "@mui/material";
import { memo, useMemo } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PaymentsIcon from "@mui/icons-material/Payments";
import { InputPurchaseRowType } from "../../../../types";
import PurchaseRowButtons from "./PurchaseRowButtons";
import TableCellWrapper from "../../TableCellWrapper";

type UnderHalfRowProps = {
  isGroup: boolean;
  editFormData: InputPurchaseRowType;
  setIsEdit: (value: React.SetStateAction<boolean>) => void;
  setIsEditPrice: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

const UnderHalfRow = memo(
  ({
    editFormData,
    isGroup,
    setIsEdit,
    setIsEditPrice,
    setOpenDialog,
  }: UnderHalfRowProps) => (
    <>
      <TableCellWrapper>
        {editFormData.price + "円"}
        {editFormData.method.timing === "翌月" &&
          editFormData.childPurchaseId && <Chip label="翌月" />}
        {editFormData.isUncertain && <Chip label="未確定" />}
      </TableCellWrapper>
      <TableCellWrapper label={editFormData.description} />
      <TableCellWrapper>
        <PaymentsIcon color={editFormData.income ? "success" : "error"} />
      </TableCellWrapper>
      <TableCellWrapper>
        {!isGroup && (
          <PurchaseRowButtons
            setIsEdit={setIsEdit}
            setIsEditPrice={setIsEditPrice}
            setOpenDialog={setOpenDialog}
            isUncertain={editFormData.isUncertain}
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
    setOpenDialog,
    setIsEditPrice,
    rowColor,
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
          label={editFormData.date.toLocaleString().split(" ")[0]}
        />
        <TableCellWrapper label={editFormData.title} />
        <TableCellWrapper label={editFormData.category} />
        <TableCellWrapper label={editFormData.method.label} />
        {!isSmall && (
          <UnderHalfRow
            {...{
              setIsEdit,
              setIsEditPrice,
              setOpenDialog,
              editFormData,
              isGroup,
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
              setOpenDialog,
              editFormData,
              isGroup,
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
