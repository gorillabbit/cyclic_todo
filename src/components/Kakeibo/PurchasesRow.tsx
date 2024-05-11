import {
  TableRow,
  TableCell,
  TextField,
  Autocomplete,
  IconButton,
  Chip,
  Collapse,
  Table,
  TableBody,
  TableHead,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { memo, useCallback, useState } from "react";
import {
  addDocPurchase,
  deleteDocPurchase,
  updateDocPurchase,
} from "../../firebase";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  InputPurchaseRowType,
  MethodListType,
  PurchaseListType,
} from "../../types";
import { usePurchase } from "../Context/PurchaseContext";
import { useMethod } from "../Context/MethodContext";
import { getPayLaterDate } from "../../utilities/dateUtilities";

type PlainPurchasesRowProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  purchase: PurchaseListType;
  groupPurchases: PurchaseListType[];
  isGroup: boolean;
  isEdit: boolean;
  editFormData: InputPurchaseRowType;
  categorySet: string[];
  methodList: MethodListType[];
  handleEditFormChange: (event: {
    target: {
      name: string;
      value: any;
    };
  }) => void;
  handleDateFormChange: (value: Date | null | undefined) => void;
  handleMethodChange: (value: string | MethodListType | null) => void;
  handleSaveClick: () => void;
  handleEditClick: () => void;
  handleDeleteButton: () => void;
  handleAutocompleteChange: (name: string, value: any) => void;
  isSmall: boolean;
};

const PlainPurchasesRow = memo(
  (props: PlainPurchasesRowProps): JSX.Element => (
    <>
      <TableRow>
        {props.isEdit ? (
          <>
            <TableCell sx={{ paddingX: 0.5 }} />
            <TableCell sx={{ paddingX: 0.5 }}>
              <DatePicker
                name="date"
                value={props.editFormData.date}
                onChange={props.handleDateFormChange}
                slotProps={{ textField: { size: "small" } }}
                sx={{ maxWidth: 190 }}
              />
            </TableCell>
            <TableCell sx={{ paddingX: 0.5 }}>
              <TextField
                name="title"
                value={props.editFormData.title}
                onChange={props.handleEditFormChange}
                size="small"
              />
            </TableCell>
            <TableCell sx={{ paddingX: 0.5 }}>
              <TextField
                name="price"
                value={props.editFormData.price}
                onChange={props.handleEditFormChange}
                size="small"
              />
            </TableCell>
            <TableCell sx={{ paddingX: 0.5 }}>
              <Autocomplete
                value={props.editFormData.category}
                sx={{ minWidth: 150 }}
                options={props.categorySet}
                freeSolo
                onChange={(e, v) =>
                  props.handleAutocompleteChange("category", v)
                }
                renderInput={(params) => (
                  <TextField {...params} label="分類" size="small" />
                )}
              />
            </TableCell>
            <TableCell sx={{ paddingX: 0.5 }}>
              <Autocomplete
                value={props.editFormData.method}
                sx={{ minWidth: 150 }}
                options={props.methodList}
                freeSolo
                onChange={(_e, v) => props.handleMethodChange(v)}
                renderInput={(params) => (
                  <TextField {...params} label="支払い方法" size="small" />
                )}
              />
            </TableCell>
            <TableCell sx={{ paddingX: 0.5 }}>
              <TextField
                name="income"
                value={props.editFormData.income ? "収入" : "支出"}
                onChange={props.handleEditFormChange}
                size="small"
              />
            </TableCell>
            {!props.isSmall && (
              <TableCell sx={{ paddingX: 0.5 }}>
                <TextField
                  name="description"
                  value={props.editFormData.description}
                  onChange={props.handleEditFormChange}
                  size="small"
                />
              </TableCell>
            )}
            <TableCell padding="none">
              <IconButton onClick={props.handleSaveClick} color="success">
                <DoneIcon />
              </IconButton>
            </TableCell>
          </>
        ) : (
          <>
            <TableCell>
              {props.isGroup && (
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => props.setOpen(!props.open)}
                >
                  {props.open ? (
                    <KeyboardArrowUpIcon />
                  ) : (
                    <KeyboardArrowDownIcon />
                  )}
                </IconButton>
              )}
            </TableCell>
            <TableCell sx={{ paddingX: 0.5 }}>
              {props.editFormData.date.toLocaleString().split(" ")[0]}
            </TableCell>
            <TableCell sx={{ paddingX: 0.5 }}>
              {props.isGroup
                ? props.editFormData.method.label + " 引き落し"
                : props.editFormData.title}
            </TableCell>
            <TableCell sx={{ paddingX: 0.5 }}>
              {props.editFormData.price + "円"}
              {props.editFormData.method.timing === "翌月" &&
                props.editFormData.childPurchaseId && <Chip label="翌月" />}
            </TableCell>
            <TableCell sx={{ paddingX: 0.5 }}>
              {props.editFormData.category}
            </TableCell>
            <TableCell sx={{ paddingX: 0.5 }}>
              {props.editFormData.method.label}
            </TableCell>
            <TableCell sx={{ paddingX: 0.5 }}>
              {props.editFormData.income ? "収入" : "支出"}
            </TableCell>
            {!props.isSmall && (
              <TableCell>{props.editFormData.description}</TableCell>
            )}
            <TableCell padding="none">
              {!props.isGroup && (
                <IconButton
                  onClick={props.handleEditClick}
                  sx={{
                    "&:hover": {
                      color: "#1976d2", // Color on hover
                    },
                  }}
                >
                  <EditIcon />
                </IconButton>
              )}
            </TableCell>
          </>
        )}
        <TableCell padding="none">
          {!props.isGroup && (
            <IconButton
              onClick={props.handleDeleteButton}
              sx={{
                "&:hover": {
                  color: "#d32f2f", // Color on hover
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </TableCell>
      </TableRow>
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
  const { methodList } = useMethod();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  // 編集中のデータを保持するステート
  const [editFormData, setEditFormData] = useState<InputPurchaseRowType>({
    ...purchase,
    date: purchase.date.toDate(),
  });
  const [open, setOpen] = useState(false);
  const { categorySet } = usePurchase();
  const isGroup = groupPurchases.length > 0;

  // 編集モードに切り替える関数
  const handleEditClick = useCallback(() => {
    setIsEdit(true);
  }, []);

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
  }, [editFormData]);

  const handleDeleteButton = useCallback(() => {
    if (purchase.childPurchaseId) {
      deleteDocPurchase(purchase.childPurchaseId);
    }
    deleteDocPurchase(purchase.id);
  }, [purchase.childPurchaseId, purchase.id]);

  // 編集データを更新する関数
  const handleEditFormChange = useCallback(
    (event: { target: { name: string; value: any } }) => {
      const { name, value } = event.target;
      setEditFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );
  const handleDateFormChange = useCallback((value: Date | null | undefined) => {
    setEditFormData((prev) => ({
      ...prev,
      date: value ?? new Date(),
    }));
  }, []);

  const handleMethodChange = useCallback(
    (value: string | MethodListType | null) => {
      if (value && typeof value !== "string") {
        setEditFormData((prev) => ({
          ...prev,
          method: value,
        }));
      }
    },
    []
  );
  const handleAutocompleteChange = useCallback((name: string, value: any) => {
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const plainProps = {
    purchase,
    groupPurchases,
    isGroup,
    isEdit,
    editFormData,
    categorySet,
    methodList,
    handleEditFormChange,
    handleDateFormChange,
    handleMethodChange,
    handleSaveClick,
    handleEditClick,
    handleDeleteButton,
    handleAutocompleteChange,
    open,
    setOpen,
    isSmall,
  };
  return <PlainPurchasesRow {...plainProps} />;
};

export default PurchasesRow;
