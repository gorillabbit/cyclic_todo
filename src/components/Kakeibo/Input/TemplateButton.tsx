import { Chip } from "@mui/material";
import { memo, useCallback, useState } from "react";
import { InputPurchaseType, PurchaseListType } from "../../../types";
import { deleteDocPurchaseTemplate } from "../../../firebase";
import DeleteConfirmDialog from "../DeleteConfirmDialog";

type PlainTemplateButtonProps = {
  template: PurchaseListType;
  onClickTemplateButton: () => void;
  handleDeleteButtonClick: () => void;
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  deleteAction: () => void;
};

const PlainTemplateButton = memo(
  ({
    template,
    onClickTemplateButton,
    handleDeleteButtonClick,
    openDialog,
    setOpenDialog,
    deleteAction,
  }: PlainTemplateButtonProps): JSX.Element => (
    <>
      <Chip
        sx={{ m: 0.5 }}
        onClick={onClickTemplateButton}
        onDelete={handleDeleteButtonClick}
        label={template.title}
      />
      <DeleteConfirmDialog
        target={<Chip sx={{ m: 0.5 }} label={template.title} />}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        deleteAction={deleteAction}
      />
    </>
  )
);

const TemplateButton = ({
  setNewPurchase,
  template,
}: {
  setNewPurchase: (value: React.SetStateAction<InputPurchaseType>) => void;
  template: PurchaseListType;
}) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const onClickTemplateButton = useCallback(() => {
    // idが残ると、idが同じDocが複数作成され、削除できなくなる
    const { id, ...templatePurchaseWithoutId } = template;
    setNewPurchase({
      ...templatePurchaseWithoutId,
      date: new Date(),
    });
  }, [setNewPurchase, template]);

  const handleDeleteButtonClick = useCallback(() => {
    setOpenDialog(true);
  }, []);

  const deleteAction = useCallback(() => {
    deleteDocPurchaseTemplate(template.id);
  }, [template.id]);

  const plainProps = {
    template,
    onClickTemplateButton,
    handleDeleteButtonClick,
    openDialog,
    setOpenDialog,
    deleteAction,
  };
  return <PlainTemplateButton {...plainProps} />;
};

export default TemplateButton;