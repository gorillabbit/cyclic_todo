import {
  TableRow,
  TableCell,
  Collapse,
  Table,
  TableHead,
  TableBody,
  IconButton,
} from "@mui/material";
import { memo, useCallback } from "react";
import TableCellWrapper from "../TableCellWrapper";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { defaultMethod, MethodListType, MethodType } from "../../../types";
import { getAuth } from "firebase/auth";
import { addDocMethod } from "../../../firebase";
import { useTab } from "../../../hooks/useData";
import { sumSpentAndIncome } from "../../../utilities/purchaseUtilities";
import MethodRow from "./MethodRow";
import { PurchaseDataType } from "../../../types/purchaseTypes";

type PlainMethodListProps = {
  open: boolean;
  filteredMethodList: MethodListType[];
  methodPurchase: (methodId: string) => { income: number; spent: number };
  addMethod: () => void;
};

const PlainMethodList = memo(
  ({
    open,
    filteredMethodList,
    methodPurchase,
    addMethod,
  }: PlainMethodListProps) => (
    <TableRow>
      <TableCell sx={{ paddingY: 0 }} colSpan={6}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Table size="small" aria-label="purchases">
            <TableHead>
              <TableRow>
                <TableCellWrapper label="名前" />
                <TableCellWrapper label="今月の収入" />
                <TableCellWrapper label="今月の支出" />
                <TableCellWrapper label="決済タイミング" />
                <TableCellWrapper colSpan={2} />
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMethodList.map((method) => (
                <MethodRow
                  method={method}
                  key={method.id}
                  methodPurchaseSum={methodPurchase(method.id)}
                />
              ))}
            </TableBody>
          </Table>
          <IconButton onClick={addMethod} color="primary">
            <AddCircleOutlineIcon />
          </IconButton>
        </Collapse>
      </TableCell>
    </TableRow>
  )
);

const MethodList = memo(
  ({
    open,
    assetId,
    filteredMethodList,
    filteredPurchases,
  }: {
    open: boolean;
    assetId: string;
    filteredMethodList: MethodListType[];
    filteredPurchases: PurchaseDataType[];
  }) => {
    const methodPurchase = useCallback(
      (methodId: string) => {
        const methodPurchaseList = filteredPurchases.filter(
          (purchase) => purchase.method?.id === methodId
        );
        return {
          income: sumSpentAndIncome(
            methodPurchaseList.filter((purchase) => purchase.difference > 0)
          ),
          spent: sumSpentAndIncome(
            methodPurchaseList.filter((purchase) => purchase.difference <= 0)
          ),
        };
      },
      [filteredPurchases]
    );

    const auth = getAuth();
    const { tabId } = useTab();
    const addMethod = useCallback(() => {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const newMethod: MethodType = {
          ...defaultMethod,
          userId,
          tabId,
          assetId,
        };
        addDocMethod(newMethod);
      }
    }, [assetId, auth.currentUser, tabId]);
    const plainProps = {
      open,
      filteredMethodList,
      methodPurchase,
      addMethod,
    };
    return <PlainMethodList {...plainProps} />;
  }
);
export default MethodList;
