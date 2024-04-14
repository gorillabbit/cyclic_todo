import { Box, Button, FormGroup, TextField } from "@mui/material";
import StyledCheckbox from "../StyledCheckbox";
import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import { addDocPurchase } from "../../firebase";
import { getAuth } from "firebase/auth";
import { InputPurchaseType } from "../../types";

const auth = getAuth();

const PurchaseInput = () => {
  const defaultNewPurchase: InputPurchaseType = {
    userId: "",
    title: "",
    date: new Date(),
    category: "",
    method: "",
    price: 0,
    income: false,
    description: "",
  };

  const [newPurchase, setNewPurchase] =
    useState<InputPurchaseType>(defaultNewPurchase);

  const handleNewPurchaseInput = (name: string, value: any) => {
    if (name === "price" && parseInt(value, 10) < 0) {
      alert("0未満は入力できません。");
      return;
    }
    setNewPurchase((prev) => ({ ...prev, [name]: value }));
  };

  const addPurchase = () => {
    if (!newPurchase.title) {
      alert("品目名を入力してください");
      return;
    }
    if (newPurchase && auth.currentUser) {
      const userId = auth.currentUser.uid;
      addDocPurchase({ ...newPurchase, userId });
      setNewPurchase(defaultNewPurchase);
    }
  };
  return (
    <Box display="flex" m={2}>
      <FormGroup row={true} sx={{ gap: 1, m: 1, width: "100%" }}>
        <TextField
          label="品目"
          value={newPurchase.title}
          onChange={(e) => handleNewPurchaseInput("title", e.target.value)}
        />
        <TextField
          label="金額"
          type="number"
          value={newPurchase.price}
          onChange={(e) => handleNewPurchaseInput("price", e.target.value)}
        />
        <DatePicker
          label="日付"
          value={newPurchase.date}
          sx={{ maxWidth: 150 }}
          onChange={(value) => handleNewPurchaseInput("date", value)}
        />
        <TextField
          label="カテゴリー"
          value={newPurchase.category}
          onChange={(e) => handleNewPurchaseInput("category", e.target.value)}
        />
        <TextField
          label="支払い方法"
          value={newPurchase.method}
          onChange={(e) => handleNewPurchaseInput("method", e.target.value)}
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
      <Button sx={{ my: 1 }} variant="contained" onClick={addPurchase}>
        追加
      </Button>
    </Box>
  );
};

export default PurchaseInput;
