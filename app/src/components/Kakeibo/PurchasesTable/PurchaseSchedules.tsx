import {
    Paper,
    Box,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableBody,
    IconButton,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { PurchaseScheduleListType } from '../../../types';
import { useFirestoreQuery } from '../../../utilities/firebaseUtilities';
import PurchaseScheduleRow from './PurchaseScheduleRow/PurchaseScheduleRow';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { where } from 'firebase/firestore';
import { useTab } from '../../../hooks/useData';
import TableCellWrapper from '../TableCellWrapper';
import { dbNames } from '../../../firebase';

const PurchaseSchedules = () => {
    const { tabId } = useTab();
    const [isOpen, setIsOpen] = useState(false);
    const purchaseScheduleQueryConstraints = useMemo(() => [where('tabId', '==', tabId)], [tabId]);
    const { documents: purchaseScheduleList } = useFirestoreQuery<PurchaseScheduleListType>(
        dbNames.purchaseSchedule,
        purchaseScheduleQueryConstraints,
        true
    );

    return (
        <Paper sx={{ marginY: 2 }}>
            <Box fontSize={20}>
                予定収支
                <IconButton onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <CloseFullscreenIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </Box>
            {isOpen && (
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCellWrapper label="周期" />
                                <TableCellWrapper label="期日" />
                                <TableCellWrapper label="品目" />
                                <TableCellWrapper label="金額" />
                                <TableCellWrapper label="分類" />
                                <TableCellWrapper label="支払い方法" />
                                <TableCellWrapper label="未確定" />
                                <TableCellWrapper label="備考" />
                                <TableCellWrapper />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {purchaseScheduleList.map((ps) => (
                                <PurchaseScheduleRow purchaseSchedule={ps} key={ps.id} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Paper>
    );
};

export default PurchaseSchedules;
