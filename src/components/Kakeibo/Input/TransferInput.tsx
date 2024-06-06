import {
  Autocomplete,
  Box,
  FormGroup,
  TextField,
  Tooltip,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { memo, useCallback, useMemo, useState } from "react";
import {
  addDocPurchase,
  addDocTransferTemplate,
  batchAddDocPurchase,
} from "../../../firebase";
import { getAuth } from "firebase/auth";
import {
  MethodListType,
  InputTransferType,
  defaultTransferInput,
  InputPurchaseType,
} from "../../../types";
import {
  isValidatedNum,
  numericProps,
} from "../../../utilities/purchaseUtilities";
import { useMethod } from "../../Context/MethodContext";
import { getPayLaterDate } from "../../../utilities/dateUtilities";
import TransferInputButtons from "./TransferInputButtons";
import TransferTemplateButtonsContainer from "./TransferTemplateButtonContainer";
import { useTab } from "../../Context/TabContext";

const auth = getAuth();

type PlainTransferInputProps = {
  handleNewTransferInput: (name: string, value: any) => void;
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
        {methodError ? (
          <Tooltip title={methodError}>
            <>
              <TransferInputButtons
                {...{ methodError, addTransfer, addTemplate }}
              />
            </>
          </Tooltip>
        ) : (
          <TransferInputButtons
            {...{ methodError, addTransfer, addTemplate }}
          />
        )}
      </Box>
    </>
  )
);

const TransferInput = () => {
  const { methodList } = useMethod();
  const { tabId } = useTab();
  const [newTransfer, setNewTransfer] = useState<InputTransferType>({
    ...defaultTransferInput,
    tabId,
  });

  const handleNewTransferInput = useCallback((name: string, value: any) => {
    if (name === "price") {
      if (isValidatedNum(value)) {
        setNewTransfer((prev) => ({ ...prev, [name]: Number(value) }));
      }
      return;
    }
    setNewTransfer((prev) => ({ ...prev, [name]: value }));
  }, []);

  const methodError = useMemo(() => {
    if (!newTransfer.to.assetId || !newTransfer.from.assetId) {
      return "送金元と送金先は必須です";
    }
    if (newTransfer.to.assetId === newTransfer.from.assetId) {
      return "同じ資産には送金できません";
    }
    if (newTransfer.to.timing === "翌月") {
      return "後払いの決済方法に入金はできません";
    }
  }, [newTransfer]);

  const addTransfer = useCallback(async () => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const purchaseTitle = `${newTransfer.from.label}から${newTransfer.to.label}`;
      const basePurchase = {
        userId,
        price: newTransfer.price,
        category: "送受金",
        income: false,
        childPurchaseId: "",
        date: newTransfer.date,
        description: newTransfer.description,
        tabId,
      };
      let childId = "";
      if (newTransfer.from.timing === "翌月" && newTransfer.from.timingDate) {
        const childTransfer: InputPurchaseType = {
          ...basePurchase,
          title: `【送金】${purchaseTitle}`,
          date: getPayLaterDate(newTransfer.date, newTransfer.from.timingDate),
          method: newTransfer.from,
        };
        // awaitないとfirestoreへの書き込みが完了する前にbatch書き込みが完了してしまうので
        await addDocPurchase(childTransfer).then((docRef) => {
          childId = docRef.id;
        });
      }
      const transferPurchases: InputPurchaseType[] = [
        {
          ...basePurchase,
          title: `【送金】${purchaseTitle}`,
          method: newTransfer.from,
          childPurchaseId: childId,
        },
        {
          ...basePurchase,
          title: `【入金】${purchaseTitle}`,
          method: newTransfer.to,
          income: true,
        },
      ];
      batchAddDocPurchase(transferPurchases);
    }
    setNewTransfer(defaultTransferInput);
  }, [newTransfer, tabId]);

  const addTemplate = useCallback(() => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      addDocTransferTemplate({ ...newTransfer, userId });
    }
  }, [newTransfer]);

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
