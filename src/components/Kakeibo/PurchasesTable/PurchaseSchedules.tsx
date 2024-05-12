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
import { PurchaseScheduleListType, PurchaseScheduleType } from "../../../types";
import { useFirestoreQuery } from "../../../utilities/firebaseUtilities";

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
              <TableCell sx={{ paddingX: 0.5 }}>周期</TableCell>
              <TableCell sx={{ paddingX: 0.5 }}>品目</TableCell>
              <TableCell sx={{ paddingX: 0.5 }}>金額</TableCell>
              <TableCell sx={{ paddingX: 0.5 }}>分類</TableCell>
              <TableCell sx={{ paddingX: 0.5 }}>支払い方法</TableCell>
              <TableCell sx={{ paddingX: 0.5 }}>収入</TableCell>
              <TableCell sx={{ paddingX: 0.5 }}>備考</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.purchaseScheduleList.map((purchaseSchedule) => (
              <TableRow key={purchaseSchedule.id}>
                <TableCell sx={{ paddingX: 0.5 }}>
                  {purchaseSchedule.cycle +
                    (purchaseSchedule.date
                      ? purchaseSchedule.date + "日"
                      : purchaseSchedule.day)}
                </TableCell>
                <TableCell sx={{ paddingX: 0.5 }}>
                  {purchaseSchedule.title}
                </TableCell>
                <TableCell sx={{ paddingX: 0.5 }}>
                  {purchaseSchedule.price + "円"}
                </TableCell>
                <TableCell sx={{ paddingX: 0.5 }}>
                  {purchaseSchedule.category}
                </TableCell>
                <TableCell sx={{ paddingX: 0.5 }}>
                  {purchaseSchedule.method.label}
                </TableCell>
                <TableCell sx={{ paddingX: 0.5 }}>
                  {purchaseSchedule.income ? "収入" : "支出"}
                </TableCell>
                <TableCell sx={{ paddingX: 0.5 }}>
                  {purchaseSchedule.description}
                </TableCell>
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
