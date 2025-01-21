import { TableCell, TableSortLabel } from '@mui/material';
import { memo } from 'react';
import { PurchaseDataType } from '../../../types/purchaseTypes';

type TableHeadCellProps = {
    label: string;
    value: keyof PurchaseDataType;
    orderBy: keyof PurchaseDataType;
    setOrderBy: React.Dispatch<React.SetStateAction<keyof PurchaseDataType>>;
    isAsc: boolean;
    setIsAsc: React.Dispatch<React.SetStateAction<boolean>>;
};

type PlainTableHeadCellProps = TableHeadCellProps;

const PlainTableHeadCell = memo(
    ({ label, value, orderBy, setOrderBy, isAsc, setIsAsc }: PlainTableHeadCellProps) => (
        <TableCell
            sortDirection={orderBy === value ? (isAsc ? 'asc' : 'desc') : false}
            sx={{ p: 0 }}
        >
            <TableSortLabel
                active={orderBy === value}
                direction={orderBy === value ? (isAsc ? 'asc' : 'desc') : 'asc'}
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
