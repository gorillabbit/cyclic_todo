import { TableCell, TableSortLabel } from "@mui/material";
import { memo } from "react";
import { PurchaseListType } from "../../../types";

type TableHeadCellProps = {
  label: string;
  value: keyof PurchaseListType;
  orderBy: keyof PurchaseListType;
  setOrderBy: React.Dispatch<React.SetStateAction<keyof PurchaseListType>>;
  isAsc: boolean;
  setIsAsc: React.Dispatch<React.SetStateAction<boolean>>;
};

type PlainTableHeadCellProps = TableHeadCellProps;

const PlainTableHeadCell = memo(
  ({
    label,
    value,
    orderBy,
    setOrderBy,
    isAsc,
    setIsAsc,
  }: PlainTableHeadCellProps) => (
    <TableCell
      sortDirection={orderBy === value ? (isAsc ? "asc" : "desc") : false}
      sx={{ px: 0.5 }}
    >
      <TableSortLabel
        active={orderBy === value}
        direction={orderBy === value ? (isAsc ? "asc" : "desc") : "asc"}
        onClick={() => {
          setOrderBy(value);
          setIsAsc((prev) => !prev);
        }}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  )
);

const TableHeadCell = (props: TableHeadCellProps) => {
  return <PlainTableHeadCell {...props} />;
};

export default TableHeadCell;
