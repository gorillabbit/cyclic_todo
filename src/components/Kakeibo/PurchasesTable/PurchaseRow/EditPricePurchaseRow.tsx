import { TableCell, TextField, IconButton, TableRow } from "@mui/material";
import PaymentsIcon from "@mui/icons-material/Payments";
import { memo, useCallback } from "react";
import DoneIcon from "@mui/icons-material/Done";
import { InputPurchaseRowType } from "../../../../types";
import { updateDocPurchase } from "../../../../firebase";
import { numericProps } from "../../../../utilities/purchaseUtilities";

type UnderHalfRowProps = {
  handleEditFormChange: (event: {
    target: {
      name: string;
      value: any;
    };
  }) => void;
  editFormData: InputPurchaseRowType;
  handleSaveClick: () => void;
};

const UnderHalfRow = memo(
  ({
    editFormData,
    handleSaveClick,
    handleEditFormChange,
  }: UnderHalfRowProps) => (
    <>
      <TableCell sx={{ px: 0.5 }}>
        <TextField
          name="price"
          value={editFormData.price}
          onChange={handleEditFormChange}
          size="small"
          inputProps={numericProps}
        />
      </TableCell>
      <TableCell sx={{ px: 0.5 }}>
        <PaymentsIcon color={editFormData.income ? "success" : "error"} />
      </TableCell>
      <TableCell>{editFormData.description}</TableCell>
      <TableCell padding="none">
        <IconButton onClick={handleSaveClick} color="success">
          <DoneIcon />
        </IconButton>
      </TableCell>
    </>
  )
);

type PlainEditPricePurchaseRowProps = UnderHalfRowProps & {
  isSmall: boolean;
};

const PlainEditPricePurchaseRow = memo(
  ({
    editFormData,
    handleEditFormChange,
    isSmall,
    handleSaveClick,
  }: PlainEditPricePurchaseRowProps): JSX.Element => (
    <>
      <TableRow>
        <TableCell sx={{ px: 0.5 }} />
        <TableCell sx={{ px: 0.5 }}>
          {editFormData.date.toLocaleString().split(" ")[0]}
        </TableCell>
        <TableCell sx={{ px: 0.5 }}>{editFormData.title}</TableCell>

        <TableCell sx={{ px: 0.5 }}>{editFormData.category}</TableCell>
        <TableCell sx={{ px: 0.5 }}>{editFormData.method.label}</TableCell>
        {!isSmall && (
          <UnderHalfRow
            editFormData={editFormData}
            handleSaveClick={handleSaveClick}
            handleEditFormChange={handleEditFormChange}
          />
        )}
      </TableRow>
      {isSmall && (
        <TableRow>
          <TableCell sx={{ px: 0.5 }} />
          <UnderHalfRow
            editFormData={editFormData}
            handleSaveClick={handleSaveClick}
            handleEditFormChange={handleEditFormChange}
          />
        </TableRow>
      )}
    </>
  )
);

const EditPricePurchaseRow = ({
  setIsEditPrice,
  editFormData,
  setEditFormData,
  isSmall,
}: {
  setIsEditPrice: React.Dispatch<React.SetStateAction<boolean>>;
  editFormData: InputPurchaseRowType;
  setEditFormData: React.Dispatch<React.SetStateAction<InputPurchaseRowType>>;
  isSmall: boolean;
}) => {
  // 編集内容を保存する関数
  const handleSaveClick = useCallback(() => {
    const certainPurchase = { ...editFormData, isUncertain: false };
    updateDocPurchase(editFormData.id, certainPurchase);
    // 決済Purchaseもあるなら変更する
    if (editFormData.childPurchaseId) {
      const { id, date, ...childPurchaseWithoutId } = certainPurchase;
      updateDocPurchase(editFormData.childPurchaseId, {
        ...childPurchaseWithoutId,
        childPurchaseId: "",
      });
    }
    setEditFormData((prev) => ({ ...prev, isUncertain: false }));
    setIsEditPrice(false);
  }, [editFormData, setEditFormData, setIsEditPrice]);

  const handleEditFormChange = useCallback(
    (event: { target: { name: string; value: any } }) => {
      const { name, value } = event.target;
      setEditFormData((prev) => ({ ...prev, [name]: value }));
    },
    [setEditFormData]
  );

  const plainProps = {
    editFormData,
    handleEditFormChange,
    handleSaveClick,
    isSmall,
  };
  return <PlainEditPricePurchaseRow {...plainProps} />;
};

export default EditPricePurchaseRow;