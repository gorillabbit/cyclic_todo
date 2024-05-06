import { Box, Chip } from "@mui/material";
import { memo, useCallback, useMemo } from "react";
import { InputPurchaseType, PurchaseListType, PurchaseType } from "../../types";
import { orderBy } from "firebase/firestore";
import { useFirestoreQuery } from "../../utilities/firebaseUtilities";
import { deleteDocPurchaseTemplate } from "../../firebase";

type plainPlainTemplateButtonsProps = {
  templates: PurchaseListType[];
  onClickTemplateButton: (templatePurchase: PurchaseListType) => void;
};

const PlainTemplateButtons = memo(
  (props: plainPlainTemplateButtonsProps): JSX.Element => (
    <Box m={0.5}>
      {props.templates.map((template) => (
        <Chip
          sx={{ m: 0.5 }}
          key={template.title}
          onClick={() => props.onClickTemplateButton(template)}
          onDelete={() => deleteDocPurchaseTemplate(template.id)}
          label={template.title}
        />
      ))}
    </Box>
  )
);

const TemplateButtons = ({
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
  >("PurchaseTemplates", purchaseTemplatesQueryConstraints);

  const onClickTemplateButton = useCallback(
    (templatePurchase: PurchaseListType) => {
      setNewPurchase({
        ...templatePurchase,
        date: new Date(),
      });
    },
    [setNewPurchase]
  );

  const plainProps = {
    templates,
    onClickTemplateButton,
  };
  return <PlainTemplateButtons {...plainProps} />;
};

export default TemplateButtons;
