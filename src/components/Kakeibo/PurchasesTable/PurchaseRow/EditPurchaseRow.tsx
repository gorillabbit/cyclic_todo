import {
  TableCell,
  TextField,
  Autocomplete,
  IconButton,
  TableRow,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { memo, useCallback } from "react";
import DoneIcon from "@mui/icons-material/Done";
import { InputPurchaseRowType, MethodListType } from "../../../../types";
import {
  updateDocPurchase,
  deleteDocPurchase,
  addDocPurchase,
} from "../../../../firebase";
import { getPayLaterDate } from "../../../../utilities/dateUtilities";
import { useMethod, usePurchase } from "../../../../hooks/useData";

type UnderHalfRowProps = {
  editFormData: InputPurchaseRowType;
  handleEditFormChange: (event: {
    target: {
      name: string;
      value: any;
    };
  }) => void;
  handleSaveClick: () => void;
};

const UnderHalfRow = memo(
  ({
    editFormData,
    handleEditFormChange,
    handleSaveClick,
  }: UnderHalfRowProps) => (
    <>
      <TableCell sx={{ px: 0.5 }}>
        <TextField
          name="price"
          value={editFormData.price}
          onChange={handleEditFormChange}
          size="small"
        />
      </TableCell>
      <TableCell sx={{ px: 0.5 }}>
        <TextField
          name="income"
          value={editFormData.income ? "収入" : "支出"}
          onChange={handleEditFormChange}
          size="small"
        />
      </TableCell>
      <TableCell sx={{ px: 0.5 }}>
        <TextField
          name="description"
          value={editFormData.description}
          onChange={handleEditFormChange}
          size="small"
        />
      </TableCell>
      <TableCell padding="none">
        <IconButton onClick={handleSaveClick} color="success">
          <DoneIcon />
        </IconButton>
      </TableCell>
    </>
  )
);

type PlainEditPurchaseRowProps = UnderHalfRowProps & {
  handleDateFormChange: (value: Date | null | undefined) => void;
  isSmall: boolean;
  categorySet: string[];
  methodList: MethodListType[];
  handleAutocompleteChange: (name: string, value: any) => void;
  handleMethodChange: (value: string | MethodListType | null) => void;
};

const PlainEditPurchaseRow = memo(
  ({
    editFormData,
    handleDateFormChange,
    handleEditFormChange,
    categorySet,
    handleAutocompleteChange,
    methodList,
    handleMethodChange,
    isSmall,
    handleSaveClick,
  }: PlainEditPurchaseRowProps): JSX.Element => (
    <>
      <TableRow>
        <TableCell sx={{ px: 0.5 }} />
        <TableCell sx={{ px: 0.5 }}>
          <DatePicker
            name="date"
            value={editFormData.date}
            onChange={handleDateFormChange}
            slotProps={{ textField: { size: "small" } }}
            sx={{ maxWidth: 190 }}
          />
        </TableCell>
        <TableCell sx={{ px: 0.5 }}>
          <TextField
            name="title"
            value={editFormData.title}
            onChange={handleEditFormChange}
            size="small"
          />
        </TableCell>

        <TableCell sx={{ px: 0.5 }}>
          <Autocomplete
            value={editFormData.category}
            sx={{ minWidth: 150 }}
            options={categorySet}
            freeSolo
            onChange={(_e, v) => handleAutocompleteChange("category", v)}
            renderInput={(params) => (
              <TextField {...params} label="分類" size="small" />
            )}
          />
        </TableCell>
        <TableCell sx={{ px: 0.5 }}>
          <Autocomplete
            value={editFormData.method}
            sx={{ minWidth: 150 }}
            options={methodList}
            freeSolo
            onChange={(_e, v) => handleMethodChange(v)}
            renderInput={(params) => (
              <TextField {...params} label="支払い方法" size="small" />
            )}
          />
        </TableCell>
        {!isSmall && (
          <UnderHalfRow
            {...{ editFormData, handleEditFormChange, handleSaveClick }}
          />
        )}
      </TableRow>
      {isSmall && (
        <>
          <TableRow>
            <TableCell sx={{ px: 0.5 }} />
            <UnderHalfRow
              {...{ editFormData, handleEditFormChange, handleSaveClick }}
            />
          </TableRow>
        </>
      )}
    </>
  )
);

const EditPurchaseRow = ({
  setIsEdit,
  editFormData,
  setEditFormData,
  isSmall,
}: {
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  editFormData: InputPurchaseRowType;
  setEditFormData: React.Dispatch<React.SetStateAction<InputPurchaseRowType>>;
  isSmall: boolean;
}) => {
  const { methodList } = useMethod();
  const { categorySet } = usePurchase();

  // 編集内容を保存する関数
  const handleSaveClick = useCallback(() => {
    // アップデートし、編集を閉じる
    const updateCurrentPurchase = (feature: Partial<InputPurchaseRowType>) => {
      updateDocPurchase(editFormData.id, {
        ...editFormData,
        ...feature,
      });
      setIsEdit(false);
    };
    // 決済Purchaseも変更する
    const { id, ...childPurchaseWithoutId } = editFormData;
    // 日付の変更にも対応できるようにする
    const childPurchase = {
      ...childPurchaseWithoutId,
      date: getPayLaterDate(
        editFormData.date,
        editFormData.method.timingDate ?? childPurchaseWithoutId.date.getDate()
      ),
      childPurchaseId: "",
    };
    if (editFormData.childPurchaseId) {
      if (editFormData.method.timing === "即時") {
        // 決済を後払いから即時のものにしたとき決済Purchaseを削除する
        deleteDocPurchase(editFormData.childPurchaseId);
        // 子タスクを削除したあとで、再び後払いにした場合、存在しない子タスクをupdateしようとしてしまう
        updateCurrentPurchase({ childPurchaseId: "" });
        return;
      }
      updateDocPurchase(editFormData.childPurchaseId, childPurchase);
    } else if (editFormData.method.timingDate) {
      //childPurchaseIdがなく新たにtimingが出てきた場合、子Purchaseを追加し、子PurchaseIdを追加
      addDocPurchase(childPurchase).then((docRef) =>
        updateCurrentPurchase({ childPurchaseId: docRef.id })
      );
      return;
    }
    updateCurrentPurchase({});
  }, [editFormData, setIsEdit]);

  const handleEditFormChange = useCallback(
    (event: { target: { name: string; value: any } }) => {
      const { name, value } = event.target;
      setEditFormData((prev) => ({ ...prev, [name]: value }));
    },
    [setEditFormData]
  );

  const handleDateFormChange = useCallback(
    (value: Date | null | undefined) => {
      setEditFormData((prev) => ({
        ...prev,
        date: value ?? new Date(),
      }));
    },
    [setEditFormData]
  );

  const handleMethodChange = useCallback(
    (value: string | MethodListType | null) => {
      if (value && typeof value !== "string") {
        setEditFormData((prev) => ({
          ...prev,
          method: value,
        }));
      }
    },
    [setEditFormData]
  );

  const handleAutocompleteChange = useCallback(
    (name: string, value: any) => {
      setEditFormData((prev) => ({ ...prev, [name]: value }));
    },
    [setEditFormData]
  );

  const plainProps = {
    editFormData,
    categorySet,
    methodList,
    handleEditFormChange,
    handleDateFormChange,
    handleMethodChange,
    handleSaveClick,
    handleAutocompleteChange,
    isSmall,
  };
  return <PlainEditPurchaseRow {...plainProps} />;
};

export default EditPurchaseRow;
