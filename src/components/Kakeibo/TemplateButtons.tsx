import { Box, Chip } from "@mui/material";
import { memo, useCallback, useMemo } from "react";
import { InputPurchaseType, PurchaseListType, PurchaseType } from "../../types";
import { orderBy } from "firebase/firestore";
import { useFirestoreQuery } from "../../utilities/firebaseUtilities";
import { PurchaseTemplates, deleteDocPurchaseTemplate } from "../../firebase";

type plainPlainTemplateButtonsProps = {
  templates: PurchaseListType[];
  onClickTemplateButton: (templatePurchase: PurchaseListType) => void;
  handleDeleteButtonClick: (templateId: string) => void;
};

const PlainTemplateButtons = memo(
  (props: plainPlainTemplateButtonsProps): JSX.Element => (
    <Box m={0.5}>
      {props.templates.map((template) => (
        <Chip
          sx={{ m: 0.5 }}
          key={template.id}
          onClick={() => props.onClickTemplateButton(template)}
          onDelete={() => props.handleDeleteButtonClick(template.id)}
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
  >(PurchaseTemplates, purchaseTemplatesQueryConstraints);

  const onClickTemplateButton = useCallback(
    (templatePurchase: PurchaseListType) => {
      // idが残ると、idが同じDocが複数作成され、削除できなくなる
      const { id, ...templatePurchaseWithoutId } = templatePurchase;
      setNewPurchase({
        ...templatePurchaseWithoutId,
        date: new Date(),
      });
    },
    [setNewPurchase]
  );

  const handleDeleteButtonClick = useCallback((templateId: string) => {
    deleteDocPurchaseTemplate(templateId);
  }, []);

  const plainProps = {
    templates,
    onClickTemplateButton,
    handleDeleteButtonClick,
  };
  return <PlainTemplateButtons {...plainProps} />;
};

export default TemplateButtons;
