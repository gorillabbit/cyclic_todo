import {
  Autocomplete,
  Box,
  FormGroup,
  TextField,
  Tooltip,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { memo, useCallback, useMemo, useState } from "react";
import { addDocTransferTemplate } from "../../../firebase";
import { getAuth } from "firebase/auth";
import {
  MethodListType,
  InputTransferType,
  defaultTransferInput,
} from "../../../types";
import {
  addPurchaseAndUpdateLater,
  isValidatedNum,
  numericProps,
  updateAndAddPurchases,
} from "../../../utilities/purchaseUtilities";
import { getPayLaterDate } from "../../../utilities/dateUtilities";
import TransferInputButtons from "./TransferInputButtons";
import TransferTemplateButtonsContainer from "./TransferTemplateButtonContainer";
import { useMethod, usePurchase, useTab } from "../../../hooks/useData";
import { PurchaseDataType } from "../../../types/purchaseTypes";

type PlainTransferInputProps = {
  handleNewTransferInput: (
    name: string,
    value: string | Date | MethodListType | null
  ) => void;
  newTransfer: InputTransferType;
  addTransfer: () => void;
  addTemplate: () => void;
  setNewTransfer: React.Dispatch<React.SetStateAction<InputTransferType>>;
  methodList: MethodListType[];
  methodError: string | undefined;
};

const PlainTransferInput = memo(
  ({
    handleNewTransferInput,
    newTransfer,
    addTransfer,
    addTemplate,
    setNewTransfer,
    methodList,
    methodError,
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
          />
          <DatePicker
            label="日付"
            value={newTransfer.date}
            sx={{ maxWidth: 150 }}
            onChange={(value) => handleNewTransferInput("date", value)}
          />
          <Autocomplete
            value={newTransfer.from.label ? newTransfer.from : null}
            sx={{ minWidth: 150 }}
            options={methodList}
            onChange={(_e, v) => handleNewTransferInput("from", v)}
            renderInput={(params) => (
              <TextField {...params} error={!!methodError} label="送金元" />
            )}
          />
          <Autocomplete
            value={newTransfer.to.label ? newTransfer.to : null}
            sx={{ minWidth: 150 }}
            options={methodList}
            onChange={(_e, v) => handleNewTransferInput("to", v)}
            renderInput={(params) => (
              <TextField {...params} error={!!methodError} label="送金先" />
            )}
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
      {methodError ? (
        <Tooltip title={methodError}>
          <>
            <TransferInputButtons
              methodError={methodError}
              addTransfer={addTransfer}
              addTemplate={addTemplate}
            />
          </>
        </Tooltip>
      ) : (
        <TransferInputButtons
          methodError={methodError}
          addTransfer={addTransfer}
          addTemplate={addTemplate}
        />
      )}
    </>
  )
);

const TransferInput = () => {
  const { currentUser } = getAuth();
  const { methodList } = useMethod();
  const { tabId } = useTab();
  const [newTransfer, setNewTransfer] = useState<InputTransferType>({
    ...defaultTransferInput,
    tabId,
  });
  const { purchaseList, setPurchaseList } = usePurchase();

  const handleNewTransferInput = useCallback(
    (name: string, value: string | Date | MethodListType | null) => {
      if (name === "price" && typeof value === "string") {
        if (isValidatedNum(value))
          setNewTransfer((prev) => ({ ...prev, [name]: Number(value) }));
        return;
      }
      setNewTransfer((prev) => ({ ...prev, [name]: value }));
    },
    []
  );
  const { price, date, description, from, to } = newTransfer;
  const methodError = useMemo(() => {
    if (!to.assetId || !from.assetId) return "送金元と送金先は必須です";
    if (to.assetId === from.assetId) return "同じ資産には送金できません";
    if (to.timing === "翌月") return "後払いの決済方法に入金はできません";
  }, [from.assetId, to.assetId, to.timing]);

  const addTransfer = useCallback(async () => {
    if (!currentUser) return console.error("ログインしていません");
    const purchaseTitle = `${from.label}→${to.label}`;
    const basePurchase = {
      userId: currentUser.uid,
      price,
      category: "送受金",
      childPurchaseId: "",
      date,
      description,
      tabId,
      id: "",
      balance: 0,
    };
    let childId = "";
    let update = purchaseList;
    if (from.timing === "翌月" && from.timingDate) {
      const childTransfer: PurchaseDataType = {
        ...basePurchase,
        title: `【送】${purchaseTitle}`,
        date: getPayLaterDate(date, from.timingDate),
        method: from,
        difference: -price,
        assetId: from.assetId,
      };
      const newUpdate = addPurchaseAndUpdateLater(childTransfer, update);
      update = newUpdate.purchases;
      childId = newUpdate.id;
    }
    const fromPurchase = {
      ...basePurchase,
      title: `【送】${purchaseTitle}`,
      method: from,
      childPurchaseId: childId,
      assetId: from.assetId,
      difference: childId ? 0 : -price,
    };
    update = addPurchaseAndUpdateLater(fromPurchase, update).purchases;
    const toPurchase = {
      ...basePurchase,
      title: `【受】${purchaseTitle}`,
      method: to,
      assetId: to.assetId,
      difference: price,
    };
    update = addPurchaseAndUpdateLater(toPurchase, update).purchases;
    updateAndAddPurchases(update);
    setPurchaseList(update);
    setNewTransfer(defaultTransferInput);
  }, [
    currentUser,
    date,
    description,
    from,
    price,
    purchaseList,
    setPurchaseList,
    tabId,
    to,
  ]);

  const addTemplate = useCallback(() => {
    if (!currentUser) return console.error("ログインしていません");
    const userId = currentUser.uid;
    addDocTransferTemplate({ ...newTransfer, userId });
  }, [currentUser, newTransfer]);

  const plainProps = {
    handleNewTransferInput,
    newTransfer,
    addTransfer,
    addTemplate,
    setNewTransfer,
    methodList,
    methodError,
  };
  return <PlainTransferInput {...plainProps} />;
};

export default TransferInput;
