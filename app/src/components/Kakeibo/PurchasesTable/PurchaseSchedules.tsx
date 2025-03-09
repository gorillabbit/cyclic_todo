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
import { useEffect, useState } from 'react';
import { PurchaseScheduleType } from '../../../types';
import PurchaseScheduleRow from './PurchaseScheduleRow/PurchaseScheduleRow';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useTab } from '../../../hooks/useData';
import TableCellWrapper from '../TableCellWrapper';
import { getPurchaseSchedule } from '../../../api/combinedApi';

const PurchaseSchedules = () => {
    const { tabId } = useTab();
    const [isOpen, setIsOpen] = useState(false);
    const [purchaseScheduleList, setPurchaseScheduleList] = useState<PurchaseScheduleType[]>([]);

    const fetchPurchaseSchedule = async () => {
        const data = await getPurchaseSchedule({ tabId });
        setPurchaseScheduleList(data);
    };

    useEffect(() => {
        fetchPurchaseSchedule();
    }, [tabId]);

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
                                <PurchaseScheduleRow
                                    purchaseSchedule={ps}
                                    key={ps.id}
                                    fetchPurchaseSchedule={fetchPurchaseSchedule}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Paper>
    );
};

export default PurchaseSchedules;
