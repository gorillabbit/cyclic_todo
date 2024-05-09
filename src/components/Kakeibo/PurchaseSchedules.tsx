import {
  Paper,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { memo, useMemo } from "react";
import { PurchaseScheduleListType, PurchaseScheduleType } from "../../types";
import { useFirestoreQuery } from "../../utilities/firebaseUtilities";

type PlainPurchaseSchedulesProps = {
  purchaseScheduleList: PurchaseScheduleListType[];
};

const PlainPurchaseSchedules = memo(
  (props: PlainPurchaseSchedulesProps): JSX.Element => (
    <Paper sx={{ marginY: 2 }}>
      <Box fontSize={20}>予定収支</Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>周期</TableCell>
              <TableCell>品目</TableCell>
              <TableCell>金額</TableCell>
              <TableCell>カテゴリー</TableCell>
              <TableCell>支払い方法</TableCell>
              <TableCell>収入</TableCell>
              <TableCell>備考</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.purchaseScheduleList.map((purchaseSchedule) => (
              <TableRow key={purchaseSchedule.id}>
                <TableCell>
                  {purchaseSchedule.cycle +
                    (purchaseSchedule.date
                      ? purchaseSchedule.date + "日"
                      : purchaseSchedule.day)}
                </TableCell>
                <TableCell> {purchaseSchedule.title}</TableCell>
                <TableCell>{purchaseSchedule.price + "円"}</TableCell>
                <TableCell>{purchaseSchedule.category}</TableCell>
                <TableCell>{purchaseSchedule.method}</TableCell>
                <TableCell>
                  {purchaseSchedule.income ? "収入" : "支出"}
                </TableCell>
                <TableCell>{purchaseSchedule.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
);

const PurchaseSchedules = () => {
  const purchaseScheduleQueryConstraints = useMemo(() => [], []);
  const { documents: purchaseScheduleList } = useFirestoreQuery<
    PurchaseScheduleType,
    PurchaseScheduleListType
  >("PurchaseSchedules", purchaseScheduleQueryConstraints);

  const plainProps = {
    purchaseScheduleList,
  };
  return <PlainPurchaseSchedules {...plainProps} />;
};

export default PurchaseSchedules;
