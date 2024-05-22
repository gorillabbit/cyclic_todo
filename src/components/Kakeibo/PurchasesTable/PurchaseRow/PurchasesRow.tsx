import {
  TableRow,
  TableCell,
  Collapse,
  Table,
  TableBody,
  TableHead,
} from "@mui/material";
import { memo, useCallback, useState } from "react";
import { deleteDocPurchase } from "../../../../firebase";
import { InputPurchaseRowType, PurchaseListType } from "../../../../types";
import DeleteConfirmDialog from "../../DeleteConfirmDialog";
import EditPurchaseRow from "./EditPurchaseRow";
import NormalPurchaseRow from "./NormalPurchaseRow";
import EditPricePurchaseRow from "./EditPricePurchaseRow";

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
  isEditPrice: boolean;
  setIsEditPrice: React.Dispatch<React.SetStateAction<boolean>>;
  index: number;
};

const PlainPurchasesRow = memo(
  ({
    setOpen,
    open,
    purchase,
    groupPurchases,
    isGroup,
    isEdit,
    setIsEdit,
    editFormData,
    setEditFormData,
    deleteAction,
    isSmall,
    openDialog,
    setOpenDialog,
    isEditPrice,
    setIsEditPrice,
    index,
  }: PlainPurchasesRowProps): JSX.Element => (
    <>
      {isEdit ? (
        <EditPurchaseRow
          setIsEdit={setIsEdit}
          editFormData={editFormData}
          setEditFormData={setEditFormData}
          isSmall={isSmall}
        />
      ) : isEditPrice ? (
        <EditPricePurchaseRow
          setIsEditPrice={setIsEditPrice}
          editFormData={editFormData}
          setEditFormData={setEditFormData}
          isSmall={isSmall}
        />
      ) : (
        <NormalPurchaseRow
          isGroup={isGroup}
          setOpen={setOpen}
          open={open}
          editFormData={editFormData}
          isSmall={isSmall}
          setIsEdit={setIsEdit}
          setIsEditPrice={setIsEditPrice}
          setOpenDialog={setOpenDialog}
          index={index}
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
                    <TableCell>カテゴリー</TableCell>
                    <TableCell>収入</TableCell>
                    <TableCell>備考</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupPurchases.map((groupPurchase) => (
                    <TableRow key={groupPurchase.id}>
                      <TableCell>
                        {
                          groupPurchase.date
                            .toDate()
                            .toLocaleString()
                            .split(" ")[0]
                        }
                      </TableCell>
                      <TableCell>{groupPurchase.title}</TableCell>
                      <TableCell>{groupPurchase.price + "円"}</TableCell>
                      <TableCell>{groupPurchase.category}</TableCell>
                      <TableCell>
                        {groupPurchase.income ? "収入" : "支出"}
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
      <DeleteConfirmDialog
        target={purchase.title}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        deleteAction={deleteAction}
      />
    </>
  )
);

const PurchasesRow = ({
  purchase,
  groupPurchases,
  isSmall,
  index,
}: {
  purchase: PurchaseListType;
  groupPurchases: PurchaseListType[];
  isSmall: boolean;
  index: number;
}) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isEditPrice, setIsEditPrice] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const isGroup = groupPurchases.length > 0 && !purchase.childPurchaseId;
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
    isEditPrice,
    setIsEditPrice,
    index,
  };
  return <PlainPurchasesRow {...plainProps} />;
};

export default PurchasesRow;
