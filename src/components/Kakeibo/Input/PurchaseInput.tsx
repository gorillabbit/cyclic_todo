import { Autocomplete, Box, Button, FormGroup, TextField } from "@mui/material";
import StyledCheckbox from "../../StyledCheckbox";
import { DatePicker } from "@mui/x-date-pickers";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { addDocPurchaseTemplate } from "../../../firebase";
import { getAuth } from "firebase/auth";
import { MethodListType } from "../../../types";
import {
  addPurchaseAndUpdateLater,
  isValidatedNum,
  numericProps,
  updateAndAddPurchases,
} from "../../../utilities/purchaseUtilities";
import TemplateButtons from "./TemplateButtonsContainer";
import { getPayLaterDate } from "../../../utilities/dateUtilities";
import { useTab, usePurchase, useMethod } from "../../../hooks/useData";
import {
  defaultInputFieldPurchase,
  InputFieldPurchaseType,
  PurchaseDataType,
} from "../../../types/purchaseTypes";
import { set } from "date-fns";

type PlainPurchaseInputProps = {
  handleNewPurchaseInput: (
    name: string,
    value: string | Date | boolean | MethodListType | null
  ) => void;
  newPurchase: InputFieldPurchaseType;
  addPurchase: () => void;
  addTemplate: () => void;
  setNewPurchase: React.Dispatch<React.SetStateAction<InputFieldPurchaseType>>;
  categorySet: string[];
  methodList: MethodListType[];
};

const PlainPurchaseInput = memo(
  ({
    handleNewPurchaseInput,
    newPurchase,
    addPurchase,
    addTemplate,
    setNewPurchase,
    categorySet,
    methodList,
  }: PlainPurchaseInputProps): JSX.Element => (
    <>
      <TemplateButtons setNewPurchase={setNewPurchase} />
      <Box display="flex">
        <FormGroup row sx={{ gap: 1, mr: 1, width: "100%" }}>
          <TextField
            label="品目"
            value={newPurchase.title}
            onChange={(e) => handleNewPurchaseInput("title", e.target.value)}
          />
          <TextField
            label="金額"
            value={newPurchase.price}
            inputProps={numericProps}
            onChange={(e) => handleNewPurchaseInput("price", e.target.value)}
          />
          <DatePicker
            label="日付"
            value={newPurchase.date}
            sx={{ maxWidth: 150 }}
            onChange={(value) => handleNewPurchaseInput("date", value)}
          />
          <Autocomplete
            value={newPurchase.category}
            onChange={(_e, v) => handleNewPurchaseInput("category", v)}
            sx={{ minWidth: 150 }}
            options={categorySet}
            freeSolo
            renderInput={(params) => (
              <TextField {...params} label="カテゴリー" />
            )}
          />
          <Autocomplete
            value={newPurchase.method?.label ? newPurchase.method : null}
            sx={{ minWidth: 150 }}
            options={methodList}
            onChange={(_e, v) => handleNewPurchaseInput("method", v)}
            isOptionEqualToValue={(option, value) =>
              option.label === value?.label
            }
            renderInput={(params) => (
              <TextField {...params} label="支払い方法" />
            )}
          />
          <StyledCheckbox
            value={newPurchase.income}
            handleCheckbox={() =>
              handleNewPurchaseInput("income", !newPurchase.income)
            }
          >
            収入
          </StyledCheckbox>
          <TextField
            label="備考"
            multiline
            value={newPurchase.description}
            onChange={(e) =>
              handleNewPurchaseInput("description", e.target.value)
            }
          />
        </FormGroup>
      </Box>
      <Box gap={1} display="flex" my={1}>
        <Button sx={{ width: "50%" }} variant="contained" onClick={addPurchase}>
          追加
        </Button>
        <Button sx={{ width: "50%" }} variant="outlined" onClick={addTemplate}>
          ボタン化
        </Button>
      </Box>
    </>
  )
);

const PurchaseInput = () => {
  const { tabId } = useTab();
  const { purchaseList, setPurchaseList } = usePurchase();
  const { currentUser } = getAuth();
  const [updatePurchases, setUpdatePurchases] = useState<PurchaseDataType[]>(
    []
  );
  const defaultPurchaseInputWithTabId = useMemo(
    () => ({ ...defaultInputFieldPurchase, tabId }),
    [tabId]
  );
  const [newPurchase, setNewPurchase] = useState<InputFieldPurchaseType>(
    defaultPurchaseInputWithTabId
  );
  const method = newPurchase.method;

  useEffect(() => {
    setUpdatePurchases(
      purchaseList.filter((p) => p.assetId === method?.assetId)
    );
  }, [method?.assetId, purchaseList]);

  const handleNewPurchaseInput = useCallback(
    (name: string, value: string | Date | boolean | MethodListType | null) => {
      if (name === "price" && typeof value === "string") {
        if (isValidatedNum(value))
          setNewPurchase((prev) => ({ ...prev, [name]: Number(value) }));
        return;
      }
      if (name === "date" && value instanceof Date) {
        const currentTime = new Date();
        const updatedDate = set(value, {
          hours: currentTime.getHours(),
          minutes: currentTime.getMinutes(),
          seconds: currentTime.getSeconds(),
        });
        setNewPurchase((prev) => ({ ...prev, [name]: updatedDate }));
      }
      setNewPurchase((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const addPurchase = useCallback(async () => {
    if (!newPurchase.title) return alert("品目名を入力してください");
    if (!method) return alert("支払い方法を入力してください");
    if (!currentUser) return alert("ログインしてください");

    let updates = updatePurchases;

    console.log(
      updatePurchases
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .map((p) => ({
          balance: p.balance,
          title: p.title,
          date: p.date.toLocaleDateString(),
        }))
    );
    const { income, price, ...newPurchaseData } = newPurchase;
    const difference = income ? price : -price;
    const { assetId, timing } = method;

    const _addPurchase = (
      purchases: PurchaseDataType[],
      options: Partial<PurchaseDataType>
    ) => {
      const purchaseData = {
        ...newPurchaseData,
        userId: currentUser.uid,
        childPurchaseId: "",
        difference,
        assetId,
        balance: 0,
        id: "",
      };
      return addPurchaseAndUpdateLater(
        { ...purchaseData, ...options },
        purchases
      );
    };

    if (timing === "即時") {
      updates = _addPurchase(updatePurchases, {}).purchases;
    } else {
      // 後払いの場合
      const payLaterDate = getPayLaterDate(newPurchase.date, method.timingDate);
      // まず引き落とされる支払いを追加し、そのIDを現在の支払いに追加する
      const purchasesAndId = _addPurchase(updatePurchases, {
        date: payLaterDate,
      });
      updates = _addPurchase(purchasesAndId.purchases, {
        childPurchaseId: purchasesAndId.id,
      }).purchases;
    }

    console.log(
      updates
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .map((p) => ({
          balance: p.balance,
          title: p.title,
          date: p.date.toLocaleDateString(),
        }))
    );

    updateAndAddPurchases(updates);
    setPurchaseList(updates);
    setNewPurchase(defaultPurchaseInputWithTabId);
  }, [
    currentUser,
    defaultPurchaseInputWithTabId,
    method,
    newPurchase,
    setPurchaseList,
    updatePurchases,
  ]);

  const addTemplate = useCallback(() => {
    if (newPurchase && currentUser) {
      if (!newPurchase.title) {
        alert("品目名を入力してください");
        return;
      }
      addDocPurchaseTemplate({ ...newPurchase, userId: currentUser.uid });
    }
  }, [currentUser, newPurchase]);

  const { categorySet } = usePurchase();
  const { methodList } = useMethod();

  const plainProps = {
    handleNewPurchaseInput,
    newPurchase,
    addPurchase,
    addTemplate,
    setNewPurchase,
    categorySet,
    methodList,
  };
  return <PlainPurchaseInput {...plainProps} />;
};

export default PurchaseInput;
