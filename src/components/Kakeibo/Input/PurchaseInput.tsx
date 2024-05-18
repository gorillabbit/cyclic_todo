import { Autocomplete, Box, Button, FormGroup, TextField } from "@mui/material";
import StyledCheckbox from "../../StyledCheckbox";
import { DatePicker } from "@mui/x-date-pickers";
import { memo, useCallback, useState } from "react";
import { addDocPurchase, addDocPurchaseTemplate } from "../../../firebase";
import { getAuth } from "firebase/auth";
import {
  InputPurchaseType,
  MethodListType,
  defaultPurchaseInput,
} from "../../../types";
import {
  isValidatedNum,
  numericProps,
} from "../../../utilities/purchaseUtilities";
import TemplateButtons from "./TemplateButtonsContainer";
import { usePurchase } from "../../Context/PurchaseContext";
import { useMethod } from "../../Context/MethodContext";
import { getPayLaterDate } from "../../../utilities/dateUtilities";

const auth = getAuth();

type PlainPurchaseInputProps = {
  handleNewPurchaseInput: (name: string, value: any) => void;
  newPurchase: InputPurchaseType;
  addPurchase: () => void;
  addTemplate: () => void;
  setNewPurchase: React.Dispatch<React.SetStateAction<InputPurchaseType>>;
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
            onChange={(e, v) => handleNewPurchaseInput("category", v)}
            sx={{ minWidth: 150 }}
            options={categorySet}
            freeSolo
            renderInput={(params) => (
              <TextField {...params} label="カテゴリー" />
            )}
          />
          <Autocomplete
            value={newPurchase.method.label ? newPurchase.method : null}
            sx={{ minWidth: 150 }}
            options={methodList}
            onChange={(e, v) => handleNewPurchaseInput("method", v)}
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
        <Box gap={1} display="flex" flexDirection="column">
          <Button
            sx={{ height: "50%" }}
            variant="contained"
            onClick={addPurchase}
          >
            追加
          </Button>
          <Button
            sx={{ height: "50%" }}
            variant="outlined"
            onClick={addTemplate}
          >
            ボタン化
          </Button>
        </Box>
      </Box>
    </>
  )
);

const PurchaseInput = () => {
  const [newPurchase, setNewPurchase] =
    useState<InputPurchaseType>(defaultPurchaseInput);

  const handleNewPurchaseInput = useCallback((name: string, value: any) => {
    if (name === "price") {
      if (isValidatedNum(value)) {
        setNewPurchase((prev) => ({ ...prev, [name]: Number(value) }));
      }
      return;
    }
    setNewPurchase((prev) => ({ ...prev, [name]: value }));
  }, []);

  const addPurchase = useCallback(() => {
    if (!newPurchase.title) {
      alert("品目名を入力してください");
      return;
    }
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const purchaseData = { ...newPurchase, userId };
      if (newPurchase.method.timing === "即時" || !newPurchase.method) {
        addDocPurchase(purchaseData);
      } else if (newPurchase.method.timingDate) {
        const payLaterDate = getPayLaterDate(
          newPurchase.date,
          newPurchase.method.timingDate
        );
        addDocPurchase({ ...purchaseData, date: payLaterDate }).then(
          (docRef) => {
            addDocPurchase({
              ...purchaseData,
              childPurchaseId: docRef.id,
            });
          }
        );
      }
      setNewPurchase(defaultPurchaseInput);
    }
  }, [newPurchase]);

  const addTemplate = useCallback(() => {
    if (newPurchase && auth.currentUser) {
      if (!newPurchase.title) {
        alert("品目名を入力してください");
        return;
      }
      const userId = auth.currentUser.uid;
      addDocPurchaseTemplate({ ...newPurchase, userId });
    }
  }, [newPurchase]);

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