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
} from "@mui/material";
import { memo, useCallback, useMemo, useState } from "react";
import PurchaseSchedules from "./PurchaseSchedules";
import PurchasesRow from "./PurchaseRow/PurchasesRow";
import AssetsList from "../Asset/AssetsList";
import { addMonths } from "date-fns";
import { useIsSmall } from "../../../hooks/useWindowSize";
import {
  isLaterPayment,
  sortObjectsByParameter,
  updateDocuments,
} from "../../../utilities/purchaseUtilities";
import TableHeadCell from "./TableHeadCell";
import { usePurchase } from "../../../hooks/useData";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { PurchaseDataType } from "../../../types/purchaseTypes";
import TableCellWrapper from "../TableCellWrapper";
import DoughnutContainer from "./Charts/ChartContainer";
import NarrowDownDialog from "./NarrowDownDialog";

type PlainPurchaseProps = {
  monthlyPurchases: PurchaseDataType[];
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
  setFilterObject: React.Dispatch<
    React.SetStateAction<Partial<PurchaseDataType>>
  >;
  openNarrowDown: boolean;
  setOpenNarrowDown: React.Dispatch<React.SetStateAction<boolean>>;
  filterObject: Partial<PurchaseDataType>;
};

const PlainPurchases = memo(
  ({
    monthlyPurchases,
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
  }: PlainPurchaseProps): JSX.Element => (
    <>
      <AssetsList />
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
          <Button onClick={updateDocuments}>再計算</Button>
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
                  <TableCellWrapper label="収入" />
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

const Purchases = memo((): JSX.Element => {
  const { purchaseList } = usePurchase();
  const [month, setMonth] = useState<Date>(new Date());
  const monthlyPurchases = useMemo(
    () =>
      purchaseList.filter(
        (p) =>
          p.date.getMonth() === month.getMonth() &&
          p.date.getFullYear() === month.getFullYear()
      ),
    [month, purchaseList]
  );

  // 後払いを合計する(収入に後払いはないので考慮しない)
  const groupedPurchasesDoc = useMemo(
    () =>
      monthlyPurchases.reduce((acc, p) => {
        if (!isLaterPayment(p)) return acc;
        const keyString = p.method.label + p.date.getDate(); // 同じ日なら同じものとして扱う
        if (!acc[keyString]) {
          acc[keyString] = {
            ...p,
            difference: 0,
          };
        }
        acc[keyString].difference += Number(p.difference);
        // 後払いの残高を正しいものにする
        acc[keyString].balance = Number(p.balance);
        return acc;
      }, {} as { [key: string]: PurchaseDataType }),
    [monthlyPurchases]
  );

  const groupedPayLaterPurchases = useMemo(
    () => Object.values(groupedPurchasesDoc),
    [groupedPurchasesDoc]
  );
  const neutralizedGroupedPayLaterPurchase = useMemo(
    () =>
      groupedPayLaterPurchases.map((p) => ({
        ...p,
        title: p.method.label + "引き落し",
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
        ...monthlyPurchases.filter((p) => !isLaterPayment(p)),
        ...neutralizedGroupedPayLaterPurchase,
      ].sort((a, b) => a.date.getTime() - b.date.getTime()),
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
    (groupedPurchase: PurchaseDataType) =>
      monthlyPurchases.filter(
        (p) => isLaterPayment(p) && p.method.id === groupedPurchase.method.id
      ),
    [monthlyPurchases]
  );

  const isSmall = useIsSmall();
  const [orderBy, setOrderBy] = useState<keyof PurchaseDataType>("date");
  const [isAsc, setIsAsc] = useState<boolean>(true);
  const orderedPurchase = useMemo(
    () => sortObjectsByParameter(purchasesWithoutGroupFlag, orderBy, isAsc),
    [isAsc, orderBy, purchasesWithoutGroupFlag]
  );

  // 絞り込み機能
  const [openNarrowDown, setOpenNarrowDown] = useState<boolean>(false);
  const [filterObject, setFilterObject] = useState<Partial<PurchaseDataType>>(
    {}
  );
  const filteredPurchases = useMemo(
    () =>
      orderedPurchase.filter((p) =>
        Object.entries(filterObject)
          .filter((object) => object[1])
          .every(([key, value]) =>
            p[key as keyof PurchaseDataType]
              ?.toString()
              .includes(value?.toString())
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
    filteredPurchases,
    ...filterProps,
  };
  return <PlainPurchases {...plainProps} />;
});

export default Purchases;
