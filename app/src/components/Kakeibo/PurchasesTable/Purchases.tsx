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
import { JSX, memo, useCallback, useMemo, useState } from 'react';
import PurchaseSchedules from './PurchaseSchedules';
import PurchasesRow from './PurchaseRow/PurchasesRow';
import AssetsList from '../Asset/AssetsList';
import { addMonths } from 'date-fns';
import { useIsSmall } from '../../../hooks/useWindowSize';
import { isLaterPayment, sortObjectsByParameter } from '../../../utilities/purchaseUtilities';
import TableHeadCell from './TableHeadCell';
import { useMethod, usePurchase } from '../../../hooks/useData';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { PurchaseDataType } from '../../../types/purchaseTypes';
import TableCellWrapper from '../TableCellWrapper';
import DoughnutContainer from './Charts/ChartContainer';
import NarrowDownDialog from './NarrowDownDialog';

type PlainPurchaseProps = {
    monthlyPurchasesAddedPayLaterPurchase: PurchaseDataType[];
    getGroupPurchases: (groupedPurchase: PurchaseDataType) => PurchaseDataType[];
    month: Date;
    handleNextMonthButton: () => void;
    handlePastMonthButton: () => void;
    isSmall: boolean;
    HeaderCellWrapper: ({
        label,
        value,
    }: {
        label: string;
        value: keyof PurchaseDataType;
    }) => JSX.Element;
    filteredPurchases: PurchaseDataType[];
    setFilterObject: React.Dispatch<React.SetStateAction<Partial<PurchaseDataType>>>;
    openNarrowDown: boolean;
    setOpenNarrowDown: React.Dispatch<React.SetStateAction<boolean>>;
    filterObject: Partial<PurchaseDataType>;
};

const PlainPurchases = memo(
    ({
        monthlyPurchasesAddedPayLaterPurchase,
        getGroupPurchases,
        month,
        handleNextMonthButton,
        handlePastMonthButton,
        isSmall,
        HeaderCellWrapper,
        filteredPurchases,
        setFilterObject,
        openNarrowDown,
        setOpenNarrowDown,
        filterObject,
    }: PlainPurchaseProps) => (
        <>
            <AssetsList />
            <DoughnutContainer
                monthlyPurchases={monthlyPurchasesAddedPayLaterPurchase}
                currentMonth={month}
            />
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
                    <Button onClick={() => console.log('未実装')}>再計算</Button>
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
    )
);

const Purchases = memo(() => {
    const { purchaseList } = usePurchase();
    const { methodList } = useMethod();
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
                    p.pay_date.getMonth() === month.getMonth() &&
                    p.pay_date.getFullYear() === month.getFullYear()
            ),
        [その月に発生した支払い, month]
    );

    const purchasesWithoutGroupFlag = useMemo(() => {
        // 後払いを合計する(収入に後払いはないので考慮しない)
        const 後払い毎の合計 = {} as { [key: string]: PurchaseDataType };
        後払いでその月に払うもの.forEach((p) => {
            const method = methodList.find((m) => m.id === p.method);
            if (!method) return;
            const keyString = method.label + p.pay_date.getMonth() + '/' + p.pay_date.getDate(); // 支払日が同じ日のものを合計する
            const target = 後払い毎の合計[keyString];
            if (!target) {
                // 後払いの合計を合計としてふさわしい形に変換
                後払い毎の合計[keyString] = {
                    ...p,
                    parent_schedule_id: '',
                    id: keyString,
                    date: p.pay_date,
                    title: method.label + '引き落し',
                    category: '後支払い',
                    is_uncertain: false,
                    description: '',
                    is_group: true,
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
            if (!groupedPurchase.is_group) return [];
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

    const filterProps = {
        openNarrowDown,
        setOpenNarrowDown,
        filterObject,
        setFilterObject,
    };

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

    const plainProps = {
        monthlyPurchasesAddedPayLaterPurchase: purchasesWithoutGroupFlag,
        orderedPurchase,
        getGroupPurchases,
        month,
        handleNextMonthButton,
        handlePastMonthButton,
        isSmall,
        orderBy,
        setOrderBy,
        isAsc,
        setIsAsc,
        HeaderCellWrapper,
        filteredPurchases,
        ...filterProps,
    };
    return <PlainPurchases {...plainProps} />;
});

export default Purchases;
