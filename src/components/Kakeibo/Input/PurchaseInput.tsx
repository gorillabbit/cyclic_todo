import { Box, Button, FormGroup, TextField } from "@mui/material";
import StyledCheckbox from "../../StyledCheckbox";
import { DatePicker } from "@mui/x-date-pickers";
import { memo, useCallback, useMemo, useState } from "react";
import { addDocPurchaseTemplate } from "../../../firebase";
import { ErrorType, MethodListType } from "../../../types";
import {
  addPurchaseAndUpdateLater,
  getPayDate,
  numericProps,
  updateAndAddPurchases,
} from "../../../utilities/purchaseUtilities";
import TemplateButtons from "./TemplateButtonsContainer";
import { useTab, usePurchase, useAccount } from "../../../hooks/useData";
import {
  defaultInputFieldPurchase,
  InputFieldPurchaseType,
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

  // 第2因数にnewPurchaseを追加しないと、newPurchaseを更新しても関数が更新されず、初期値が使われてしまう。
  const isError = useCallback(() => {
    const validateError = validateAndSetErrors(newPurchase);
    if (!Account) {
      console.error("ログインしていません");
    }
    return validateError || !Account;
  }, [Account, newPurchase]);

  // useTabを関数内で呼び出すと、Invalid hook call. Hooks can only be called inside of the body of a function component.というエラーが出る。
  const { tabId } = useTab();
  const { purchaseList, setPurchaseList } = usePurchase();
  const addPurchase = useCallback(async () => {
    if (isError()) {
      return;
    }

    const { income, price, ...newPurchaseData } = newPurchase;
    const difference = income ? Number(price) : -Number(price);

    const purchaseData = {
      ...newPurchaseData,
      tabId,
      userId: Account?.id || "",
      payDate: getPayDate(newPurchase),
      difference,
      assetId: newPurchase.method.assetId,
      balance: 0,
      id: "",
    };
    const addedPurchaseAndId = addPurchaseAndUpdateLater(
      purchaseData,
      purchaseList
    );
    const { purchases: addedPurchases } = addedPurchaseAndId;
    updateAndAddPurchases(addedPurchases);
    setPurchaseList(addedPurchases);
    setNewPurchase(defaultInputFieldPurchase);
  }, [Account, defaultInputFieldPurchase, newPurchase]);

  const addTemplate = useCallback(() => {
    if (isError()) {
      return;
    }
    addDocPurchaseTemplate({
      ...newPurchase,
      userId: Account?.id || "",
      tabId,
    });
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
