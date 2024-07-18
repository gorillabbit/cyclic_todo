import {
  TableRow,
  TableCell,
  Collapse,
  Table,
  TableBody,
  TableHead,
} from "@mui/material";
import { memo, useEffect, useState } from "react";
import EditPurchaseRow from "./EditPurchaseRow";
import NormalPurchaseRow from "./NormalPurchaseRow";
import EditPricePurchaseRow from "./EditPricePurchaseRow";
import { PurchaseDataType } from "../../../../types/purchaseTypes";
import { usePurchase } from "../../../../hooks/useData";

type PlainPurchasesRowProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  groupPurchases: PurchaseDataType[];
  isGroup: boolean;
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  editFormData: PurchaseDataType;
  setEditFormData: React.Dispatch<React.SetStateAction<PurchaseDataType>>;
  isSmall: boolean;
  isEditPrice: boolean;
  setIsEditPrice: React.Dispatch<React.SetStateAction<boolean>>;
  index: number;
  updatePurchases: PurchaseDataType[];
};

const PlainPurchasesRow = memo(
  ({
    setOpen,
    open,
    groupPurchases,
    isGroup,
    isEdit,
    setIsEdit,
    editFormData,
    setEditFormData,
    isSmall,
    isEditPrice,
    setIsEditPrice,
    index,
    updatePurchases,
  }: PlainPurchasesRowProps): JSX.Element => (
    <>
      {isEdit ? (
        <EditPurchaseRow
          {...{
            setIsEdit,
            editFormData,
            setEditFormData,
            isSmall,
            updatePurchases,
          }}
        />
      ) : isEditPrice ? (
        <EditPricePurchaseRow
          {...{
            setIsEditPrice,
            editFormData,
            setEditFormData,
            isSmall,
            updatePurchases,
          }}
        />
      ) : (
        <NormalPurchaseRow
          {...{
            isGroup,
            setOpen,
            open,
            editFormData,
            isSmall,
            setIsEdit,
            setIsEditPrice,
            index,
            updatePurchases,
          }}
        />
      )}
      {isGroup && (
        <TableRow>
          <TableCell sx={{ paddingY: 0 }} colSpan={8}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>日付</TableCell>
                    <TableCell>品目</TableCell>
                    <TableCell>金額</TableCell>
                    <TableCell>残高</TableCell>
                    <TableCell>カテゴリー</TableCell>
                    <TableCell>収入</TableCell>
                    <TableCell>備考</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupPurchases.map((groupPurchase) => (
                    <TableRow key={groupPurchase.id}>
                      <TableCell>
                        {groupPurchase.date.toLocaleString().split(" ")[0]}
                      </TableCell>
                      <TableCell>{groupPurchase.title}</TableCell>
                      <TableCell>{groupPurchase.difference + "円"}</TableCell>
                      <TableCell>{groupPurchase.balance + "円"}</TableCell>
                      <TableCell>{groupPurchase.category}</TableCell>
                      <TableCell>
                        {groupPurchase.balance > 0 ? "収入" : "支出"}
                      </TableCell>
                      <TableCell>{groupPurchase.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  )
);

const PurchasesRow = ({
  purchase,
  groupPurchases,
  isSmall,
  index,
}: {
  purchase: PurchaseDataType;
  groupPurchases: PurchaseDataType[];
  isSmall: boolean;
  index: number;
}) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isEditPrice, setIsEditPrice] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const isGroup = groupPurchases.length > 0 && !purchase.childPurchaseId;
  const [editFormData, setEditFormData] = useState<PurchaseDataType>(purchase);

  const { purchaseList } = usePurchase();
  const [updatePurchases, setUpdatePurchases] = useState<PurchaseDataType[]>(
    []
  );

  useEffect(() => {
    setUpdatePurchases(
      purchaseList.filter((p) => p.assetId === editFormData.method.assetId)
    );
  }, [editFormData.method.assetId, purchaseList]);

  const plainProps = {
    groupPurchases,
    isGroup,
    isEdit,
    setIsEdit,
    editFormData,
    setEditFormData,
    open,
    setOpen,
    isSmall,
    isEditPrice,
    setIsEditPrice,
    index,
    updatePurchases,
  };
  return <PlainPurchasesRow {...plainProps} />;
};

export default PurchasesRow;
