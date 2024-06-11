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
import PurchaseScheduleRow from "./PurchaseScheduleRow/PurchaseScheduleRow";
import { where } from "firebase/firestore";
import { useTab } from "../../../hooks/useData";

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
              <TableCell sx={{ px: 0.5 }}>周期</TableCell>
              <TableCell sx={{ px: 0.5 }}>期日</TableCell>
              <TableCell sx={{ px: 0.5 }}>品目</TableCell>
              <TableCell sx={{ px: 0.5 }}>金額</TableCell>
              <TableCell sx={{ px: 0.5 }}>分類</TableCell>
              <TableCell sx={{ px: 0.5 }}>支払い方法</TableCell>
              <TableCell sx={{ px: 0.5 }}>収入</TableCell>
              <TableCell sx={{ px: 0.5 }}>未確定</TableCell>
              <TableCell sx={{ px: 0.5 }}>備考</TableCell>
              <TableCell sx={{ px: 0.5 }}></TableCell>
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
  const { documents: purchaseScheduleList } = useFirestoreQuery<
    PurchaseScheduleType,
    PurchaseScheduleListType
  >("PurchaseSchedules", purchaseScheduleQueryConstraints, true);

  const plainProps = {
    purchaseScheduleList,
  };
  return <PlainPurchaseSchedules {...plainProps} />;
};

export default PurchaseSchedules;
