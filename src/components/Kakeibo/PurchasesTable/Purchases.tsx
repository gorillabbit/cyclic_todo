import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { memo, useCallback, useMemo, useState } from "react";
import { PurchaseListType } from "../../../types";
import PurchaseSchedules from "./PurchaseSchedules";
import PurchasesRow from "./PurchaseRow/PurchasesRow";
import AssetsList from "../Asset/AssetsList";
import { addMonths } from "date-fns";
import { useIsSmall } from "../../../hooks/useWindowSize";
import {
  isLaterPayment,
  sortObjectsByParameter,
} from "../../../utilities/purchaseUtilities";
import DoughnutContainer from "./DoughnutContainer";
import TableHeadCell from "./TableHeadCell";
import { usePurchase } from "../../../hooks/useData";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

type PlainPurchaseProps = {
  monthlyPurchases: PurchaseListType[];
  orderedPurchase: PurchaseListType[];
  getGroupPurchases: (groupedPurchase: PurchaseListType) => PurchaseListType[];
  month: Date;
  handleNextMonthButton: () => void;
  handlePastMonthButton: () => void;
  isSmall: boolean;
  HeaderCellWrapper: ({
    label,
    value,
  }: {
    label: string;
    value: keyof PurchaseListType;
  }) => JSX.Element;
};

const PlainPurchases = memo(
  ({
    monthlyPurchases,
    orderedPurchase,
    getGroupPurchases,
    month,
    handleNextMonthButton,
    handlePastMonthButton,
    isSmall,
    HeaderCellWrapper,
  }: PlainPurchaseProps): JSX.Element => (
    <>
      <AssetsList orderedPurchase={orderedPurchase} />
      <DoughnutContainer monthlyPurchases={monthlyPurchases} />
      <PurchaseSchedules />
      <TableContainer component={Paper}>
        <Box display="flex" justifyContent="center">
          <IconButton onClick={handlePastMonthButton}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <Box fontSize={20}>
            {month.getFullYear() +
              "年" +
              //getMonthは1月=0
              (month.getMonth() + 1) +
              "月"}
          </Box>
          <IconButton onClick={handleNextMonthButton}>
            <ArrowForwardIosIcon />
          </IconButton>
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
                  <HeaderCellWrapper label="金額" value="price" />
                  <HeaderCellWrapper label="備考" value="description" />
                  <HeaderCellWrapper label="収入" value="income" />
                  <TableCell padding="none" />
                </>
              )}
            </TableRow>
            {isSmall && (
              <TableRow>
                <TableCell padding="none" />
                <HeaderCellWrapper label="金額" value="price" />
                <HeaderCellWrapper label="備考" value="description" />
                <HeaderCellWrapper label="収入" value="income" />
              </TableRow>
            )}
          </TableHead>
          <TableBody>
            {orderedPurchase.map((purchase, index) => (
              <PurchasesRow
                key={purchase.id}
                groupPurchases={getGroupPurchases(purchase)}
                {...{ index, purchase, isSmall }}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
);

const Purchases = (): JSX.Element => {
  const { purchaseList } = usePurchase();
  const [month, setMonth] = useState<Date>(new Date());
  const monthlyPurchases = useMemo(
    () =>
      purchaseList.filter(
        (purchase) =>
          purchase.date.toDate().getMonth() === month.getMonth() &&
          purchase.date.toDate().getFullYear() === month.getFullYear()
      ),
    [month, purchaseList]
  );

  // 後払いを合計する(収入に後払いはないので考慮しない)
  const groupedPurchasesDoc = useMemo(() => {
    return monthlyPurchases.reduce((acc, purchase) => {
      if (isLaterPayment(purchase)) {
        const keyString = purchase.method.label + purchase.date.toMillis();
        if (!acc[keyString]) {
          acc[keyString] = {
            ...purchase,
            price: 0,
            date: purchase.date,
          };
        }
        acc[keyString].price += Number(purchase.price);
      }
      return acc;
    }, {} as { [key: string]: PurchaseListType });
  }, [monthlyPurchases]);

  const groupedPayLaterPurchases = useMemo(
    () => Object.values(groupedPurchasesDoc),
    [groupedPurchasesDoc]
  );

  const neutralizedGroupedPayLaterPurchase = useMemo(
    () =>
      groupedPayLaterPurchases.map((groupedPayLaterPurchase) => ({
        ...groupedPayLaterPurchase,
        title: groupedPayLaterPurchase.method.label + "引き落し",
        category: "後支払い",
        isUncertain: false,
        description: "",
      })),
    [groupedPayLaterPurchases]
  );

  const purchasesWithoutGroupFlag = useMemo(
    () =>
      [
        // 後払いは合計したので、除外する
        ...monthlyPurchases.filter((purchase) => !isLaterPayment(purchase)),
        ...neutralizedGroupedPayLaterPurchase,
      ].sort((a, b) => a.date.toMillis() - b.date.toMillis()),
    [monthlyPurchases, neutralizedGroupedPayLaterPurchase]
  );

  const handleNextMonthButton = useCallback(() => {
    setMonth((prev) => addMonths(prev, 1));
  }, []);
  const handlePastMonthButton = useCallback(() => {
    setMonth((prev) => addMonths(prev, -1));
  }, []);

  // その月のPurchaseしか表示されないのでこれでいい
  const getGroupPurchases = useCallback(
    (groupedPurchase: PurchaseListType) =>
      monthlyPurchases.filter(
        (purchase) =>
          isLaterPayment(purchase) &&
          purchase.method.id === groupedPurchase.method.id
      ),
    [monthlyPurchases]
  );

  const isSmall = useIsSmall();
  const [orderBy, setOrderBy] = useState<keyof PurchaseListType>("date");
  const [isAsc, setIsAsc] = useState<boolean>(true);
  const orderedPurchase = useMemo(
    () => sortObjectsByParameter(purchasesWithoutGroupFlag, orderBy, isAsc),
    [isAsc, orderBy, purchasesWithoutGroupFlag]
  );

  const HeaderCellWrapper = ({
    label,
    value,
  }: {
    label: string;
    value: keyof PurchaseListType;
  }) => (
    <TableHeadCell
      {...{ label, value, orderBy, setOrderBy, isAsc, setIsAsc }}
    />
  );

  const plainProps = {
    monthlyPurchases,
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
  };
  return <PlainPurchases {...plainProps} />;
};

export default Purchases;
