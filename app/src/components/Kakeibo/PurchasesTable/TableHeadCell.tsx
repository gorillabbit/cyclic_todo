import { TableCell, TableSortLabel } from '@mui/material';
import { PurchaseDataType } from '../../../types/purchaseTypes';

type TableHeadCellProps = {
    label: string;
    value: keyof PurchaseDataType;
    orderBy: keyof PurchaseDataType;
    setOrderBy: React.Dispatch<React.SetStateAction<keyof PurchaseDataType>>;
    isAsc: boolean;
    setIsAsc: React.Dispatch<React.SetStateAction<boolean>>;
};

const TableHeadCell = (props: TableHeadCellProps) => {
    const { label, value, orderBy, setOrderBy, isAsc, setIsAsc } = props;
    return (
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
    );
};

export default TableHeadCell;
