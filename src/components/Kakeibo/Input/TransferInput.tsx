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

const auth = getAuth();

type plainTransferInputProps = {
  handleNewTransferInput: (name: string, value: any) => void;
  newTransfer: InputTransferType;
  addTransfer: () => void;
  addTemplate: () => void;
  setNewTransfer: React.Dispatch<React.SetStateAction<InputTransferType>>;
  methodList: MethodListType[];
  methodError: string | undefined;
};

const PlainTransferInput = memo(
  (props: plainTransferInputProps): JSX.Element => (
    <>
      <TransferTemplateButtonsContainer setNewTransfer={props.setNewTransfer} />
      <Box display="flex">
        <FormGroup row={true} sx={{ gap: 1, mr: 1, width: "100%" }}>
          <TextField
            label="金額"
            value={props.newTransfer.price}
            inputProps={numericProps}
            onChange={(e) =>
              props.handleNewTransferInput("price", e.target.value)
            }
          />
          <DatePicker
            label="日付"
            value={props.newTransfer.date}
            sx={{ maxWidth: 150 }}
            onChange={(value) => props.handleNewTransferInput("date", value)}
          />
          <Autocomplete
            value={props.newTransfer.from}
            sx={{ minWidth: 150 }}
            options={props.methodList}
            freeSolo
            onChange={(_e, v) => {
              props.handleNewTransferInput("from", v);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                error={!!props.methodError}
                label="送金元"
              />
            )}
          />
          <Autocomplete
            value={props.newTransfer.to}
            sx={{ minWidth: 150 }}
            options={props.methodList}
            freeSolo
            onChange={(_e, v) => {
              props.handleNewTransferInput("to", v);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                error={!!props.methodError}
                label="送金先"
              />
            )}
          />
          <TextField
            label="備考"
            value={props.newTransfer.description}
            onChange={(e) =>
              props.handleNewTransferInput("description", e.target.value)
            }
          />
        </FormGroup>
        {props.methodError ? (
          <Tooltip title={props.methodError}>
            <>
              <TransferInputButtons
                methodError={props.methodError}
                addTransfer={props.addTransfer}
                addTemplate={props.addTemplate}
              />
            </>
          </Tooltip>
        ) : (
          <TransferInputButtons
            methodError={props.methodError}
            addTransfer={props.addTransfer}
            addTemplate={props.addTemplate}
          />
        )}
      </Box>
    </>
  )
);

const TransferInput = () => {
  const [newTransfer, setNewTransfer] =
    useState<InputTransferType>(defaultTransferInput);

  const handleNewTransferInput = useCallback((name: string, value: any) => {
    if (name === "price") {
      if (isValidatedNum(value)) {
        setNewTransfer((prev) => ({ ...prev, [name]: Number(value) }));
        return;
      } else {
        return;
      }
    }
    setNewTransfer((prev) => ({ ...prev, [name]: value }));
  }, []);

  const methodError = useMemo(() => {
    if (!newTransfer.to?.assetId || !newTransfer.from?.assetId) {
      return "送金元と送金先は必須です";
    }
    if (newTransfer.to?.assetId === newTransfer.from?.assetId) {
      return "同じ資産には送金できません";
    }
    if (newTransfer.to?.timing === "翌月") {
      return "後払いの決済方法に入金はできません";
    }
  }, [
    newTransfer.from?.assetId,
    newTransfer.to?.assetId,
    newTransfer.to?.timing,
  ]);

  const addTransfer = useCallback(async () => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const purchaseTitle =
        newTransfer.from.label + "から" + newTransfer.to.label;
      const basePurchase = {
        userId,
        price: newTransfer.price,
        category: "送受金",
        income: false,
        childPurchaseId: "",
        date: newTransfer.date,
        description: newTransfer.description,
      };
      let childId = "";
      if (newTransfer.from.timing === "翌月" && newTransfer.from.timingDate) {
        const childTransfer: InputPurchaseType = {
          ...basePurchase,
          title: "【送金】" + purchaseTitle,
          date: getPayLaterDate(newTransfer.date, newTransfer.from.timingDate),
          method: newTransfer.from,
        };
        // awaitないとfirestoreへの書き込みが完了する前にbatch書き込みが完了してしまうので
        await addDocPurchase(childTransfer).then(
          (docRef) => (childId = docRef.id)
        );
      }
      const transferPurchases: InputPurchaseType[] = [
        {
          ...basePurchase,
          title: "【送金】" + purchaseTitle,
          method: newTransfer.from,
          childPurchaseId: childId,
        },
        {
          ...basePurchase,
          title: "【入金】" + purchaseTitle,
          method: newTransfer.to,
          income: true,
        },
      ];
      batchAddDocPurchase(transferPurchases);
    }
    setNewTransfer(defaultTransferInput);
  }, [
    newTransfer.date,
    newTransfer.description,
    newTransfer.from,
    newTransfer.price,
    newTransfer.to,
  ]);

  const addTemplate = useCallback(() => {
    if (newTransfer && auth.currentUser) {
      const userId = auth.currentUser.uid;
      addDocTransferTemplate({ ...newTransfer, userId });
    }
  }, [newTransfer]);

  const { methodList } = useMethod();

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
