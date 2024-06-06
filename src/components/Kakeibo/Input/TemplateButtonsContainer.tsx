import { Box } from "@mui/material";
import { memo, useMemo } from "react";
import {
  InputPurchaseType,
  PurchaseListType,
  PurchaseType,
} from "../../../types";
import { orderBy, where } from "firebase/firestore";
import { useFirestoreQuery } from "../../../utilities/firebaseUtilities";
import TemplateButton from "./TemplateButton";
import { dbNames } from "../../../firebase";
import { useTab } from "../../Context/TabContext";

type PlainTemplateButtonsContainerProps = {
  templates: PurchaseListType[];
  setNewPurchase: (value: React.SetStateAction<InputPurchaseType>) => void;
};

const PlainTemplateButtonsContainer = memo(
  ({
    templates,
    setNewPurchase,
  }: PlainTemplateButtonsContainerProps): JSX.Element => (
    <Box m={0.5}>
      {templates.map((template) => (
        <TemplateButton {...{ template, setNewPurchase }} key={template.id} />
      ))}
    </Box>
  )
);

const TemplateButtonsContainer = ({
  setNewPurchase,
}: {
  setNewPurchase: (value: React.SetStateAction<InputPurchaseType>) => void;
}) => {
  const { tabId } = useTab();
  const purchaseTemplatesQueryConstraints = useMemo(
    () => [orderBy("timestamp", "desc"), where("tabId", "==", tabId)],
    [tabId]
  );
  const { documents: templates } = useFirestoreQuery<
    PurchaseType,
    PurchaseListType
  >(dbNames.purchaseTemplate, purchaseTemplatesQueryConstraints);

  const plainProps = {
    templates,
    setNewPurchase,
  };
  return <PlainTemplateButtonsContainer {...plainProps} />;
};

export default TemplateButtonsContainer;
