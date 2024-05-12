import { Chip } from "@mui/material";
import { memo, useCallback, useState } from "react";
import { InputTransferType, TransferType } from "../../../types";
import { deleteDocTransferTemplate } from "../../../firebase";
import DeleteConfirmDialog from "../DeleteConfirmDialog";

type PlainTransferTemplateButtonProps = {
  transfer: TransferType;
  onClickTransferTemplateButton: () => void;
  handleDeleteButtonClick: () => void;
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  deleteAction: () => void;
  chipTitle: string;
};

const PlainTransferTemplateButton = memo(
  (props: PlainTransferTemplateButtonProps): JSX.Element => (
    <>
      <Chip
        sx={{ m: 0.5 }}
        onClick={() => props.onClickTransferTemplateButton()}
        onDelete={props.handleDeleteButtonClick}
        label={props.chipTitle}
      />
      <DeleteConfirmDialog
        target={<Chip sx={{ m: 0.5 }} label={props.chipTitle} />}
        openDialog={props.openDialog}
        setOpenDialog={props.setOpenDialog}
        deleteAction={props.deleteAction}
      />
    </>
  )
);

const TransferTemplateButton = ({
  setNewTransfer,
  transfer,
}: {
  setNewTransfer: React.Dispatch<React.SetStateAction<InputTransferType>>;
  transfer: TransferType;
}) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const onClickTransferTemplateButton = useCallback(() => {
    // idが残ると、idが同じDocが複数作成され、削除できなくなる
    const { id, ...templateTransferWithoutId } = transfer;
    setNewTransfer({
      ...templateTransferWithoutId,
      date: new Date(),
    });
  }, [setNewTransfer, transfer]);

  const handleDeleteButtonClick = useCallback(() => {
    setOpenDialog(true);
  }, []);

  const deleteAction = useCallback(() => {
    deleteDocTransferTemplate(transfer.id);
  }, [transfer.id]);

  const chipTitle =
    transfer.from.label +
    "→" +
    transfer.to.label +
    "：" +
    transfer.price +
    "円";

  const plainProps = {
    transfer,
    onClickTransferTemplateButton,
    handleDeleteButtonClick,
    openDialog,
    setOpenDialog,
    deleteAction,
    chipTitle,
  };
  return <PlainTransferTemplateButton {...plainProps} />;
};

export default TransferTemplateButton;
