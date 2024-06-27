import {
  Paper,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
} from "@mui/material";
import { memo, useMemo } from "react";
import { PurchaseScheduleListType } from "../../../types";
import { useFirestoreQuery } from "../../../utilities/firebaseUtilities";
import PurchaseScheduleRow from "./PurchaseScheduleRow/PurchaseScheduleRow";
import { where } from "firebase/firestore";
import { useTab } from "../../../hooks/useData";
import TableCellWrapper from "../TableCellWrapper";

type PlainPurchaseSchedulesProps = {
  purchaseScheduleList: PurchaseScheduleListType[];
};

const PlainPurchaseSchedules = memo(
  ({ purchaseScheduleList }: PlainPurchaseSchedulesProps): JSX.Element => (
    <Paper sx={{ marginY: 2 }}>
      <Box fontSize={20}>予定収支</Box>
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
              <TableCellWrapper label="収入" />
              <TableCellWrapper label="未確定" />
              <TableCellWrapper label="備考" />
              <TableCellWrapper />
            </TableRow>
          </TableHead>
          <TableBody>
            {purchaseScheduleList.map((purchaseSchedule) => (
              <PurchaseScheduleRow
                purchaseSchedule={purchaseSchedule}
                key={purchaseSchedule.id}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
);

const PurchaseSchedules = () => {
  const { tabId } = useTab();
  const purchaseScheduleQueryConstraints = useMemo(
    () => [where("tabId", "==", tabId)],
    [tabId]
  );
  const { documents: purchaseScheduleList } =
    useFirestoreQuery<PurchaseScheduleListType>(
      "PurchaseSchedules",
      purchaseScheduleQueryConstraints,
      true
    );

  const plainProps = {
    purchaseScheduleList,
  };
  return <PlainPurchaseSchedules {...plainProps} />;
};

export default PurchaseSchedules;
