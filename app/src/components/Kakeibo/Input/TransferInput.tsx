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
  TransferType,
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
  errors: ErrorType;
  hasError: boolean;
  useTemplate: (transfer: TransferType) => void;
};

const PlainTransferInput = memo(
  ({
    handleNewTransferInput,
    newTransfer,
    addTransfer,
    addTemplate,
    errors,
    hasError,
    useTemplate,
  }: PlainTransferInputProps): JSX.Element => (
    <>
      <TransferTemplateButtonsContainer useTemplate={useTemplate} />
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
    if (validateAndSetErrors(newTransfer)) {
      return console.error("エラーがあります");
    }
    if (!currentUser) {
      return console.error("ログインしていません");
    }
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
    const purchaseTitle = `${from.label}→${to.label}`;
    const fromPurchase = {
      ...basePurchase,
      title: `【送】${purchaseTitle}`,
      method: from,
      payDate: getPayDate({ date, method: from }),
      assetId: from.assetId,
      difference: -price,
    };
    const addedFromPurchase = addPurchaseAndUpdateLater(
      fromPurchase,
      purchaseList
    ).purchases;

    const toPurchase = {
      ...basePurchase,
      title: `【受】${purchaseTitle}`,
      method: to,
      payDate: getPayDate({ date, method: to }),
      assetId: to.assetId,
      difference: price,
    };
    const addedFromAndToPurchase = addPurchaseAndUpdateLater(
      toPurchase,
      addedFromPurchase
    ).purchases;
    updateAndAddPurchases(addedFromAndToPurchase);
    setPurchaseList(addedFromAndToPurchase);
    setNewTransfer(defaultTransferInput);
  }, [currentUser, purchaseList, setPurchaseList, tabId, newTransfer]);

  const addTemplate = useCallback(() => {
    // TODO ここの処理をaddTransferと共通化できないか考える
    if (validateAndSetErrors(newTransfer)) {
      return console.error("エラーがあります");
    }
    if (!currentUser) {
      return console.error("ログインしていません");
    }
    addDocTransferTemplate({ ...newTransfer, userId: currentUser.uid, tabId });
  }, [currentUser, newTransfer]);

  // テンプレボタンを押したときの処理
  const useTemplate = useCallback((transfer: TransferType) => {
    // idが残ると、idが同じDocが複数作成され、削除できなくなる
    const { id, ...templateTransferWithoutId } = transfer;
    const newTemplateTransfer = {
      ...templateTransferWithoutId,
      date: new Date(),
    };
    setNewTransfer(newTemplateTransfer);
    validateAndSetErrors(newTemplateTransfer);
  }, []);

  const plainProps = {
    handleNewTransferInput,
    newTransfer,
    addTransfer,
    addTemplate,
    errors,
    hasError,
    useTemplate,
  };
  return <PlainTransferInput {...plainProps} />;
};

export default TransferInput;
