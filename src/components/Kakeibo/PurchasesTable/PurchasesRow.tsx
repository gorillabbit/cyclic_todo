import {
  TableRow,
  TableCell,
  Collapse,
  Table,
  TableBody,
  TableHead,
} from "@mui/material";
import { memo, useCallback, useState } from "react";
import { deleteDocPurchase } from "../../../firebase";
import { InputPurchaseRowType, PurchaseListType } from "../../../types";
import DeleteConfirmDialog from "../DeleteConfirmDialog";
import EditPurchaseRow from "./EditPurchaseRow";
import NormalPurchaseRow from "./NormalPurchaseRow";

type PlainPurchasesRowProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  purchase: PurchaseListType;
  groupPurchases: PurchaseListType[];
  isGroup: boolean;
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  editFormData: InputPurchaseRowType;
  setEditFormData: React.Dispatch<React.SetStateAction<InputPurchaseRowType>>;
  deleteAction: () => void;
  isSmall: boolean;
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

const PlainPurchasesRow = memo(
  (props: PlainPurchasesRowProps): JSX.Element => (
    <>
      {props.isEdit ? (
        <EditPurchaseRow
          purchase={props.purchase}
          setIsEdit={props.setIsEdit}
          editFormData={props.editFormData}
          setEditFormData={props.setEditFormData}
          isSmall={props.isSmall}
        />
      ) : (
        <NormalPurchaseRow
          isGroup={props.isGroup}
          setOpen={props.setOpen}
          open={props.open}
          editFormData={props.editFormData}
          isSmall={props.isSmall}
          setIsEdit={props.setIsEdit}
          setOpenDialog={props.setOpenDialog}
        />
      )}
      {props.isGroup && (
        <TableRow>
          <TableCell sx={{ paddingY: 0 }} colSpan={8}>
            <Collapse in={props.open} timeout="auto" unmountOnExit>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>日付</TableCell>
                    <TableCell>品目</TableCell>
                    <TableCell>金額</TableCell>
                    <TableCell>カテゴリー</TableCell>
                    <TableCell>収入</TableCell>
                    <TableCell>備考</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.groupPurchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell>
                        {purchase.date.toDate().toLocaleString().split(" ")[0]}
                      </TableCell>
                      <TableCell> {purchase.title}</TableCell>
                      <TableCell>{purchase.price + "円"}</TableCell>
                      <TableCell>{purchase.category}</TableCell>
                      <TableCell>{purchase.income ? "収入" : "支出"}</TableCell>
                      <TableCell>{purchase.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
      <DeleteConfirmDialog
        target={props.purchase.title}
        openDialog={props.openDialog}
        setOpenDialog={props.setOpenDialog}
        deleteAction={props.deleteAction}
      />
    </>
  )
);

const PurchasesRow = ({
  purchase,
  groupPurchases,
  isSmall,
}: {
  purchase: PurchaseListType;
  groupPurchases: PurchaseListType[];
  isSmall: boolean;
}) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const isGroup = groupPurchases.length > 0 && !purchase.childPurchaseId;

  // 編集中のデータを保持するステート
  const [editFormData, setEditFormData] = useState<InputPurchaseRowType>({
    ...purchase,
    date: purchase.date.toDate(),
  });

  const deleteAction = useCallback(() => {
    if (purchase.childPurchaseId) {
      deleteDocPurchase(purchase.childPurchaseId);
    }
    deleteDocPurchase(purchase.id);
  }, [purchase.childPurchaseId, purchase.id]);

  const plainProps = {
    purchase,
    groupPurchases,
    isGroup,
    isEdit,
    setIsEdit,
    editFormData,
    setEditFormData,
    deleteAction,
    open,
    setOpen,
    isSmall,
    openDialog,
    setOpenDialog,
  };
  return <PlainPurchasesRow {...plainProps} />;
};

export default PurchasesRow;
