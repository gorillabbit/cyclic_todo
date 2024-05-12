import { Box } from "@mui/material";
import { memo, useMemo } from "react";
import { InputPurchaseType, PurchaseListType, PurchaseType } from "../../types";
import { orderBy } from "firebase/firestore";
import { useFirestoreQuery } from "../../utilities/firebaseUtilities";
import { PurchaseTemplates } from "../../firebase";
import TemplateButton from "./TemplateButton";

type plainPlainTemplateButtonsContainerProps = {
  templates: PurchaseListType[];
  setNewPurchase: (value: React.SetStateAction<InputPurchaseType>) => void;
};

const PlainTemplateButtonsContainer = memo(
  (props: plainPlainTemplateButtonsContainerProps): JSX.Element => (
    <>
      <Box m={0.5}>
        {props.templates.map((template) => (
          <TemplateButton
            template={template}
            setNewPurchase={props.setNewPurchase}
          />
        ))}
      </Box>
    </>
  )
);

const TemplateButtonsContainer = ({
  setNewPurchase,
}: {
  setNewPurchase: (value: React.SetStateAction<InputPurchaseType>) => void;
}) => {
  const purchaseTemplatesQueryConstraints = useMemo(
    () => [orderBy("timestamp", "desc")],
    []
  );
  const { documents: templates } = useFirestoreQuery<
    PurchaseType,
    PurchaseListType
  >(PurchaseTemplates, purchaseTemplatesQueryConstraints);

  const plainProps = {
    templates,
    setNewPurchase,
  };
  return <PlainTemplateButtonsContainer {...plainProps} />;
};

export default TemplateButtonsContainer;
