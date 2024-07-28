import { Autocomplete, Box, Button, FormGroup, TextField } from "@mui/material";
import StyledCheckbox from "../../StyledCheckbox";
import { DatePicker } from "@mui/x-date-pickers";
import { memo, useCallback, useMemo, useState } from "react";
import { addDocPurchaseTemplate } from "../../../firebase";
import { getAuth } from "firebase/auth";
import { ErrorType, MethodListType } from "../../../types";
import {
  addPurchaseAndUpdateLater,
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
import { getHasError, validatePurchase } from "../KakeiboSchemas";

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
  errors: Record<string, string | undefined>;
  hasError: boolean;
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
    errors,
    hasError,
  }: PlainPurchaseInputProps): JSX.Element => (
    <>
      <TemplateButtons setNewPurchase={setNewPurchase} />
      <Box display="flex">
        <FormGroup row sx={{ gap: 1, mr: 1, width: "100%" }}>
          <TextField
            label="品目"
            value={newPurchase.title}
            onChange={(e) => handleNewPurchaseInput("title", e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
          />
          <TextField
            label="金額"
            value={newPurchase.price}
            inputProps={numericProps}
            onChange={(e) => handleNewPurchaseInput("price", e.target.value)}
            error={!!errors.price}
            helperText={errors.price}
          />
          <DatePicker
            label="日付"
            value={newPurchase.date}
            sx={{ maxWidth: 150 }}
            onChange={(v) => handleNewPurchaseInput("date", v)}
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
              <TextField
                {...params}
                error={!!errors.method}
                helperText={errors.method}
                label="支払い方法"
              />
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
        <Button
          sx={{ width: "50%" }}
          variant="contained"
          onClick={addPurchase}
          disabled={hasError}
        >
          追加
        </Button>
        <Button
          sx={{ width: "50%" }}
          variant="outlined"
          onClick={addTemplate}
          disabled={hasError}
        >
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
  const defaultPurchaseInputWithTabId = useMemo(
    () => ({ ...defaultInputFieldPurchase, tabId }),
    [tabId]
  );
  const [newPurchase, setNewPurchase] = useState<InputFieldPurchaseType>(
    defaultPurchaseInputWithTabId
  );
  const method = newPurchase.method;

  const [errors, setErrors] = useState<ErrorType>({});

  const validateAndSetErrors = useCallback((input: InputFieldPurchaseType) => {
    const errors = validatePurchase(input);
    setErrors(errors);
    return getHasError(errors);
  }, []);

  const hasError = useMemo(() => getHasError(errors), [errors]);
  const setNewPurchaseWithValidation = (
    name: string,
    value: string | Date | boolean | MethodListType | null
  ) => {
    setNewPurchase((prev) => {
      const nextPurchase = { ...prev, [name]: value };
      validateAndSetErrors(nextPurchase);
      return nextPurchase;
    });
  };

  const handleNewPurchaseInput = useCallback(
    (name: string, value: string | Date | boolean | MethodListType | null) => {
      if (name === "date" && value instanceof Date) {
        const currentTime = new Date();
        const updatedDate = set(value, {
          hours: currentTime.getHours(),
          minutes: currentTime.getMinutes(),
          seconds: currentTime.getSeconds(),
        });
        return setNewPurchaseWithValidation(name, updatedDate);
      }
      setNewPurchaseWithValidation(name, value);
    },
    []
  );

  const addPurchase = useCallback(async () => {
    const isError = validateAndSetErrors(newPurchase);
    if (isError) return;
    if (!currentUser) return console.error("ログインしていません");

    let updates = purchaseList;
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
      updates = _addPurchase(purchaseList, {}).purchases;
    } else {
      // 後払いの場合
      const payLaterDate = getPayLaterDate(newPurchase.date, method.timingDate);
      // まず引き落とされる支払いを追加し、そのIDを現在の支払いに追加する
      const purchasesAndId = _addPurchase(purchaseList, {
        date: payLaterDate,
      });
      updates = _addPurchase(purchasesAndId.purchases, {
        childPurchaseId: purchasesAndId.id,
      }).purchases;
    }
    updateAndAddPurchases(updates);
    setPurchaseList(updates);
    setNewPurchase(defaultPurchaseInputWithTabId);
  }, [
    currentUser,
    defaultPurchaseInputWithTabId,
    method,
    newPurchase,
    setPurchaseList,
    purchaseList,
  ]);

  const addTemplate = useCallback(() => {
    const isError = validateAndSetErrors(newPurchase);
    if (isError) return;
    if (!currentUser) return console.error("ログインしていません");
    addDocPurchaseTemplate({ ...newPurchase, userId: currentUser.uid });
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
    errors,
    hasError,
  };
  return <PlainPurchaseInput {...plainProps} />;
};

export default PurchaseInput;
