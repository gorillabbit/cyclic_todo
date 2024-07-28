import { Box, Button, FormGroup, TextField } from "@mui/material";
import StyledCheckbox from "../../StyledCheckbox";
import { DatePicker } from "@mui/x-date-pickers";
import { memo, useCallback, useMemo, useState } from "react";
import { addDocPurchaseTemplate } from "../../../firebase";
import { ErrorType, MethodListType } from "../../../types";
import {
  addPurchaseAndUpdateLater,
  numericProps,
  updateAndAddPurchases,
} from "../../../utilities/purchaseUtilities";
import TemplateButtons from "./TemplateButtonsContainer";
import { getPayLaterDate } from "../../../utilities/dateUtilities";
import { useTab, usePurchase, useAccount } from "../../../hooks/useData";
import {
  defaultInputFieldPurchase,
  InputFieldPurchaseType,
  PurchaseDataType,
} from "../../../types/purchaseTypes";
import { set } from "date-fns";
import { getHasError, validatePurchase } from "../KakeiboSchemas";
import MethodSelector from "../ScreenParts/MethodSelector";
import CategorySelector from "../ScreenParts/CategorySelector";

type PlainPurchaseInputProps = {
  handleNewPurchaseInput: (
    name: string,
    value: string | Date | boolean | MethodListType | null
  ) => void;
  newPurchase: InputFieldPurchaseType;
  addPurchase: () => void;
  addTemplate: () => void;
  setNewPurchase: React.Dispatch<React.SetStateAction<InputFieldPurchaseType>>;
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
          <CategorySelector
            newCategory={newPurchase.category}
            handleInput={handleNewPurchaseInput}
          />
          <MethodSelector
            newMethod={newPurchase.method}
            handleInput={handleNewPurchaseInput}
            errors={errors.method}
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
  const [newPurchase, setNewPurchase] = useState<InputFieldPurchaseType>(
    defaultInputFieldPurchase
  );

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

  const { Account } = useAccount();

  const isError = useCallback(() => {
    const validateError = validateAndSetErrors(newPurchase);
    if (!Account) console.error("ログインしていません");
    return validateError || !Account;
  }, [Account]);

  const addPurchase = useCallback(async () => {
    if (isError()) return;

    const { tabId } = useTab();
    const { purchaseList, setPurchaseList } = usePurchase();

    const { income, price, ...newPurchaseData } = newPurchase;
    const difference = income ? price : -price;
    const { assetId, timing, timingDate } = newPurchase.method;

    const _addPurchase = (
      purchases: PurchaseDataType[],
      options: Partial<PurchaseDataType>
    ) => {
      const purchaseData = {
        ...newPurchaseData,
        tabId,
        userId: Account?.id || "",
        childPurchaseId: "",
        difference,
        assetId,
        balance: 0,
        id: "",
        ...options,
      };
      return addPurchaseAndUpdateLater(purchaseData, purchases);
    };
    const is即時 = timing === "即時";
    const addedPurchaseAndId = _addPurchase(
      purchaseList,
      is即時 ? {} : { date: getPayLaterDate(newPurchase.date, timingDate) }
    );
    const { purchases: addedPurchases, id: addedId } = addedPurchaseAndId;
    const purchaseListToAdd = is即時
      ? addedPurchases
      : _addPurchase(addedPurchases, {
          childPurchaseId: addedId,
        }).purchases;
    updateAndAddPurchases(purchaseListToAdd);
    setPurchaseList(purchaseListToAdd);
    setNewPurchase(defaultInputFieldPurchase);
  }, [Account, defaultInputFieldPurchase, newPurchase]);

  const addTemplate = useCallback(() => {
    if (isError()) return;
    addDocPurchaseTemplate({ ...newPurchase, userId: Account?.id || "" });
  }, [Account, newPurchase]);

  const plainProps = {
    handleNewPurchaseInput,
    newPurchase,
    addPurchase,
    addTemplate,
    setNewPurchase,
    errors,
    hasError,
  };
  return <PlainPurchaseInput {...plainProps} />;
};

export default PurchaseInput;
