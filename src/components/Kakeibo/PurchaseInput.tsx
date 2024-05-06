import { Box, Button, FormGroup, TextField } from "@mui/material";
import StyledCheckbox from "../StyledCheckbox";
import { DatePicker } from "@mui/x-date-pickers";
import { memo, useCallback, useMemo, useState } from "react";
import { addDocPurchase, addDocPurchaseTemplate } from "../../firebase";
import { getAuth } from "firebase/auth";
import { InputPurchaseType, PurchaseListType, PurchaseType } from "../../types";
import { numericProps } from "../../utilities/purchaseUtilities";
import { useFirestoreQuery } from "../../utilities/firebaseUtilities";
import { orderBy } from "firebase/firestore";

const auth = getAuth();

type plainPurchaseInputProps = {
  handleNewPurchaseInput: (name: string, value: any) => void;
  newPurchase: InputPurchaseType;
  addPurchase: () => void;
  addTemplate: () => void;
  templates: PurchaseListType[];
  onClickTemplateButton: (templatePurchase: PurchaseListType) => void;
};

const PlainPurchaseInput = memo(
  (props: plainPurchaseInputProps): JSX.Element => (
    <>
      <Box m={0.5}>
        {props.templates.map((template) => (
          <Button
            sx={{ m: 0.5 }}
            key={template.title}
            variant="outlined"
            onClick={() => props.onClickTemplateButton(template)}
          >
            {template.title}
          </Button>
        ))}
      </Box>
      <Box display="flex" m={2}>
        <FormGroup row={true} sx={{ gap: 1, m: 1, width: "100%" }}>
          <TextField
            label="品目"
            value={props.newPurchase.title}
            onChange={(e) =>
              props.handleNewPurchaseInput("title", e.target.value)
            }
          />
          <TextField
            label="金額"
            value={props.newPurchase.price}
            inputProps={numericProps}
            onChange={(e) =>
              props.handleNewPurchaseInput("price", e.target.value)
            }
          />
          <DatePicker
            label="日付"
            value={props.newPurchase.date}
            sx={{ maxWidth: 150 }}
            onChange={(value) => props.handleNewPurchaseInput("date", value)}
          />
          <TextField
            label="カテゴリー"
            value={props.newPurchase.category}
            onChange={(e) =>
              props.handleNewPurchaseInput("category", e.target.value)
            }
          />
          <TextField
            label="支払い方法"
            value={props.newPurchase.method}
            onChange={(e) =>
              props.handleNewPurchaseInput("method", e.target.value)
            }
          />
          <StyledCheckbox
            value={props.newPurchase.income}
            handleCheckbox={() =>
              props.handleNewPurchaseInput("income", !props.newPurchase.income)
            }
          >
            収入
          </StyledCheckbox>
          <TextField
            label="備考"
            multiline
            value={props.newPurchase.description}
            onChange={(e) =>
              props.handleNewPurchaseInput("description", e.target.value)
            }
          />
        </FormGroup>
        <Box my={1} gap={1} display="flex" flexDirection="column">
          <Button
            sx={{ height: "50%" }}
            variant="contained"
            onClick={props.addPurchase}
          >
            追加
          </Button>
          <Button
            sx={{ height: "50%" }}
            variant="outlined"
            onClick={props.addTemplate}
          >
            ボタン化
          </Button>
        </Box>
      </Box>
    </>
  )
);

const PurchaseInput = () => {
  const defaultNewPurchase: InputPurchaseType = useMemo(() => {
    return {
      userId: "",
      title: "",
      date: new Date(),
      category: "",
      method: "",
      price: 0,
      income: false,
      description: "",
    };
  }, []);

  const [newPurchase, setNewPurchase] =
    useState<InputPurchaseType>(defaultNewPurchase);

  const handleNewPurchaseInput = useCallback((name: string, value: any) => {
    if (name === "price" && parseInt(value, 10) < 0) {
      alert("0未満は入力できません。");
      return;
    }
    setNewPurchase((prev) => ({ ...prev, [name]: value }));
  }, []);

  const addPurchase = useCallback(() => {
    if (!newPurchase.title) {
      alert("品目名を入力してください");
      return;
    }
    if (newPurchase && auth.currentUser) {
      const userId = auth.currentUser.uid;
      addDocPurchase({ ...newPurchase, userId });
      setNewPurchase(defaultNewPurchase);
    }
  }, [defaultNewPurchase, newPurchase]);

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

  const purchaseTemplatesQueryConstraints = useMemo(
    () => [orderBy("timestamp", "desc")],
    []
  );
  const { documents: templates } = useFirestoreQuery<
    PurchaseType,
    PurchaseListType
  >("PurchaseTemplates", purchaseTemplatesQueryConstraints);
  console.log(templates);

  const onClickTemplateButton = useCallback(
    (templatePurchase: PurchaseListType) => {
      setNewPurchase({
        ...templatePurchase,
        date: new Date(),
      });
    },
    []
  );

  const plainProps = {
    handleNewPurchaseInput,
    newPurchase,
    addPurchase,
    addTemplate,
    templates,
    onClickTemplateButton,
  };
  return <PlainPurchaseInput {...plainProps} />;
};

export default PurchaseInput;
