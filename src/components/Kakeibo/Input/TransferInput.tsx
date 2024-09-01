import { Box, Button, FormGroup, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { memo, useCallback, useMemo, useState } from "react";
import { addDocTransferTemplate } from "../../../firebase";
import { getAuth } from "firebase/auth";
import {
  MethodListType,
  InputTransferType,
  defaultTransferInput,
  ErrorType,
} from "../../../types";
import {
  addPurchaseAndUpdateLater,
  getPayDate,
  numericProps,
  updateAndAddPurchases,
} from "../../../utilities/purchaseUtilities";
import TransferTemplateButtonsContainer from "./TransferTemplateButtonContainer";
import { usePurchase, useTab } from "../../../hooks/useData";
import { getHasError, validateTransfer } from "../KakeiboSchemas";
import MethodSelector from "../ScreenParts/MethodSelector";

type PlainTransferInputProps = {
  handleNewTransferInput: (
    name: string,
    value: string | Date | MethodListType | null
  ) => void;
  newTransfer: InputTransferType;
  addTransfer: () => void;
  addTemplate: () => void;
  setNewTransfer: React.Dispatch<React.SetStateAction<InputTransferType>>;
  errors: ErrorType;
  hasError: boolean;
};

const PlainTransferInput = memo(
  ({
    handleNewTransferInput,
    newTransfer,
    addTransfer,
    addTemplate,
    setNewTransfer,
    errors,
    hasError,
  }: PlainTransferInputProps): JSX.Element => (
    <>
      <TransferTemplateButtonsContainer setNewTransfer={setNewTransfer} />
      <Box display="flex">
        <FormGroup row sx={{ gap: 1, mr: 1, width: "100%" }}>
          <TextField
            label="金額"
            value={newTransfer.price}
            inputProps={numericProps}
            onChange={(e) => handleNewTransferInput("price", e.target.value)}
            error={!!errors.price}
            helperText={errors.price}
          />
          <DatePicker
            label="日付"
            value={newTransfer.date}
            sx={{ maxWidth: 150 }}
            onChange={(value) => handleNewTransferInput("date", value)}
          />
          <MethodSelector
            newMethod={newTransfer.from}
            handleInput={handleNewTransferInput}
            errors={errors.from}
            inputName="from"
          />
          <MethodSelector
            newMethod={newTransfer.to}
            handleInput={handleNewTransferInput}
            errors={errors.to}
            inputName="to"
          />
          <TextField
            label="備考"
            value={newTransfer.description}
            onChange={(e) =>
              handleNewTransferInput("description", e.target.value)
            }
          />
        </FormGroup>
      </Box>
      <Box gap={1} display="flex" mt={1}>
        <Button
          sx={{ width: "50%" }}
          variant="contained"
          disabled={hasError}
          onClick={addTransfer}
        >
          追加
        </Button>
        <Button
          sx={{ width: "50%" }}
          variant="outlined"
          disabled={hasError}
          onClick={addTemplate}
        >
          ボタン化
        </Button>
      </Box>
    </>
  )
);

const TransferInput = () => {
  const { currentUser } = getAuth();
  const { tabId } = useTab();
  const [newTransfer, setNewTransfer] = useState<InputTransferType>({
    ...defaultTransferInput,
    tabId,
  });
  const { purchaseList, setPurchaseList } = usePurchase();

  const [errors, setErrors] = useState<ErrorType>({});

  const validateAndSetErrors = useCallback((input: InputTransferType) => {
    const errors = validateTransfer(input);
    setErrors(errors);
    return getHasError(errors);
  }, []);

  const hasError = useMemo(() => getHasError(errors), [errors]);

  const handleNewTransferInput = useCallback(
    (name: string, value: string | Date | MethodListType | null) => {
      setNewTransfer((prev) => {
        const nextTransfer = { ...prev, [name]: value };
        validateAndSetErrors(nextTransfer);
        return nextTransfer;
      });
    },
    []
  );

  const addTransfer = useCallback(async () => {
    const isError = validateAndSetErrors(newTransfer);
    if (isError) return;
    if (!currentUser) return console.error("ログインしていません");
    const { price, date, description, from, to } = newTransfer;
    const basePurchase = {
      userId: currentUser.uid,
      category: "送受金",
      date,
      description,
      tabId,
      id: "",
      balance: 0,
    };
    let update = purchaseList;
    const purchaseTitle = `${from.label}→${to.label}`;
    const fromPurchase = {
      ...basePurchase,
      title: `【送】${purchaseTitle}`,
      method: from,
      payDate: getPayDate({ date, method: from }),
      assetId: from.assetId,
      difference: -price,
    };
    update = addPurchaseAndUpdateLater(fromPurchase, update).purchases;
    const toPurchase = {
      ...basePurchase,
      title: `【受】${purchaseTitle}`,
      method: to,
      payDate: getPayDate({ date, method: to }),
      assetId: to.assetId,
      difference: price,
    };
    update = addPurchaseAndUpdateLater(toPurchase, update).purchases;
    updateAndAddPurchases(update);
    setPurchaseList(update);
    setNewTransfer(defaultTransferInput);
  }, [currentUser, purchaseList, setPurchaseList, tabId, newTransfer]);

  const addTemplate = useCallback(() => {
    const isError = validateAndSetErrors(newTransfer);
    if (isError) return;
    if (!currentUser) return console.error("ログインしていません");
    addDocTransferTemplate({ ...newTransfer, userId: currentUser.uid });
  }, [currentUser, newTransfer]);

  const plainProps = {
    handleNewTransferInput,
    newTransfer,
    addTransfer,
    addTemplate,
    setNewTransfer,
    errors,
    hasError,
  };
  return <PlainTransferInput {...plainProps} />;
};

export default TransferInput;
