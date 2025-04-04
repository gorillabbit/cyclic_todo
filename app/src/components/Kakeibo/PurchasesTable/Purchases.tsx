import {
    Box,
    Button,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { memo, useCallback, useMemo, useState } from 'react';
import PurchaseSchedules from './PurchaseSchedules';
import PurchasesRow from './PurchaseRow/PurchasesRow';
import AssetsList from '../Asset/AssetsList';
import { addMonths } from 'date-fns';
import { useIsSmall } from '../../../hooks/useWindowSize';
import { isLaterPayment, sortObjectsByParameter } from '../../../utilities/purchaseUtilities';
import TableHeadCell from './TableHeadCell';
import { useMethod, usePurchase, useTab } from '../../../hooks/useData';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { PurchaseDataType } from '../../../types/purchaseTypes';
import TableCellWrapper from '../TableCellWrapper';
import DoughnutContainer from './Charts/ChartContainer';
import NarrowDownDialog from './NarrowDownDialog';
import { reCalcAllBalance } from '../../../api/combinedApi';

const Purchases = memo(() => {
    const { purchaseList } = usePurchase();
    const { methodList } = useMethod();
    const { tab } = useTab();
    const isSmall = useIsSmall();

    // 月の切り替え
    const [month, setMonth] = useState<Date>(new Date());
    const handleNextMonthButton = useCallback(() => {
        setMonth((prev) => addMonths(prev, 1));
    }, []);
    const handlePastMonthButton = useCallback(() => {
        setMonth((prev) => addMonths(prev, -1));
    }, []);

    const その月に発生した支払い = useMemo(
        () =>
            purchaseList.filter(
                (p) =>
                    p.date.getMonth() === month.getMonth() &&
                    p.date.getFullYear() === month.getFullYear()
            ),
        [month, purchaseList]
    );

    const 後払いでその月に払うもの = useMemo(
        () =>
            purchaseList.filter(
                (p) =>
                    isLaterPayment(methodList.find((method) => method.id === p.method)) &&
                    p.payDate &&
                    p.payDate.getMonth() === month.getMonth() &&
                    p.payDate.getFullYear() === month.getFullYear()
            ),
        [その月に発生した支払い, month]
    );

    const purchasesWithoutGroupFlag = useMemo(() => {
        // 後払いを合計する(収入に後払いはないので考慮しない)
        const 後払い毎の合計 = {} as { [key: string]: PurchaseDataType };
        後払いでその月に払うもの.forEach((p) => {
            const method = methodList.find((m) => m.id === p.method);
            if (!method) return;
            const keyString = method.label + p.payDate.getMonth() + '/' + p.payDate.getDate(); // 支払日が同じ日のものを合計する
            const target = 後払い毎の合計[keyString];
            if (!target) {
                // 後払いの合計を合計としてふさわしい形に変換
                後払い毎の合計[keyString] = {
                    ...p,
                    parentScheduleId: '',
                    id: keyString,
                    date: p.payDate,
                    title: method.label + '引き落し',
                    category: '後支払い',
                    isUncertain: false,
                    description: '',
                    isGroup: true,
                    difference: Number(p.difference),
                };
            } else {
                target.difference += Number(p.difference);
                // 後払いの残高を正しいものにする
                target.balance = Number(p.balance);
            }
        });

        return その月に発生した支払い.concat(Object.values(後払い毎の合計));
    }, [後払いでその月に払うもの, month]);

    // その月のPurchaseしか表示されないのでこれでいい
    // 発生した後払いは含めない
    const getGroupPurchases = useCallback(
        (groupedPurchase: PurchaseDataType) => {
            if (!groupedPurchase.isGroup) return [];
            return 後払いでその月に払うもの.filter((p) => p.method === groupedPurchase.method);
        },
        [後払いでその月に払うもの]
    );

    // 並び替え機能
    const [orderBy, setOrderBy] = useState<keyof PurchaseDataType>('date'); // 並び替えの初期値はdate
    const [isAsc, setIsAsc] = useState<boolean>(true);
    const orderedPurchase = useMemo(
        () => sortObjectsByParameter(purchasesWithoutGroupFlag, orderBy, isAsc),
        [isAsc, orderBy, purchasesWithoutGroupFlag]
    );

    // 絞り込み機能
    const [openNarrowDown, setOpenNarrowDown] = useState<boolean>(false);
    const [filterObject, setFilterObject] = useState<Partial<PurchaseDataType>>({});
    const filteredPurchases = useMemo(
        () =>
            orderedPurchase.filter((p) =>
                Object.entries(filterObject)
                    .filter((object) => object[1])
                    .every(([key, value]) =>
                        p[key as keyof PurchaseDataType]?.toString().includes(value?.toString())
                    )
            ),
        [filterObject, orderedPurchase]
    );

    const HeaderCellWrapper = ({
        label,
        value,
    }: {
        label: string;
        value: keyof PurchaseDataType;
    }) => (
        <TableHeadCell
            label={label}
            value={value}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            isAsc={isAsc}
            setIsAsc={setIsAsc}
        />
    );

    return (
        <>
            <AssetsList />
            <DoughnutContainer monthlyPurchases={purchasesWithoutGroupFlag} currentMonth={month} />
            <PurchaseSchedules />
            <TableContainer component={Paper}>
                <Box display="flex" justifyContent="center">
                    <IconButton onClick={handlePastMonthButton}>
                        <ArrowBackIosNewIcon />
                    </IconButton>
                    <Box fontSize={20}>
                        {month.getFullYear() +
                            '年' +
                            //getMonthは1月=0
                            (month.getMonth() + 1) +
                            '月'}
                    </Box>
                    <IconButton onClick={handleNextMonthButton}>
                        <ArrowForwardIosIcon />
                    </IconButton>
                    <Button onClick={() => reCalcAllBalance(tab.id)}>再計算</Button>
                    <Button onClick={() => setOpenNarrowDown(true)}>絞り込み</Button>
                </Box>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell padding="none" />
                            <HeaderCellWrapper label="日付" value="date" />
                            <HeaderCellWrapper label="品目" value="title" />
                            <HeaderCellWrapper label="分類" value="category" />
                            <HeaderCellWrapper label="支払い" value="method" />

                            {!isSmall && (
                                <>
                                    <HeaderCellWrapper label="金額" value="difference" />
                                    <HeaderCellWrapper label="残高" value="balance" />
                                    <HeaderCellWrapper label="備考" value="description" />
                                    <TableCell padding="none" />
                                </>
                            )}
                        </TableRow>
                        {isSmall && (
                            <TableRow>
                                <TableCell padding="none" />
                                <HeaderCellWrapper label="金額" value="difference" />
                                <HeaderCellWrapper label="残高" value="balance" />
                                <HeaderCellWrapper label="備考" value="description" />
                                <TableCellWrapper label="収入" />
                            </TableRow>
                        )}
                    </TableHead>
                    <TableBody>
                        {filteredPurchases.map((purchase, index) => (
                            <PurchasesRow
                                key={purchase.id}
                                groupPurchases={getGroupPurchases(purchase)}
                                index={index}
                                purchase={purchase}
                                isSmall={isSmall}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <NarrowDownDialog
                setFilterObject={setFilterObject}
                openNarrowDown={openNarrowDown}
                setOpenNarrowDown={setOpenNarrowDown}
                filterObject={filterObject}
            />
        </>
    );
});

export default Purchases;
