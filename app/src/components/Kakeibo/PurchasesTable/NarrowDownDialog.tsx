import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    Box,
    Autocomplete,
} from '@mui/material';
import { PurchaseDataType } from '../../../types/purchaseTypes';
import { DatePicker } from '@mui/x-date-pickers';
import CategorySelector from '../ScreenParts/CategorySelector';
import MethodSelector from '../ScreenParts/MethodSelector';
import { useAsset } from '../../../hooks/useData';
import { Timestamp } from 'firebase/firestore';

type NarrowDownDialogProps = {
    setOpenNarrowDown: React.Dispatch<React.SetStateAction<boolean>>;
    openNarrowDown: boolean;
    setFilterObject: React.Dispatch<React.SetStateAction<Partial<PurchaseDataType>>>;
    filterObject: Partial<PurchaseDataType>;
};

const NarrowDownDialog = ({
    setOpenNarrowDown,
    openNarrowDown,
    setFilterObject,
    filterObject,
}: NarrowDownDialogProps) => {
    const { assetList } = useAsset();
    const assetLabelList = assetList.map((a) => ({ ...a, label: a.name }));
    const defaultAsset = {
        id: '',
        label: '未選択',
        timestamp: new Timestamp(0, 0),
        userId: '',
        name: '',
        tabId: '',
    };
    assetLabelList.unshift(defaultAsset);

    const handleFilterApply = (name: string, value: any) => {
        if (name === 'asset') {
            value = value ? value.id : '';
            name = 'assetId';
        }
        if (name === 'date' && !value) value = undefined;
        setFilterObject((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCancelButton = () => {
        setFilterObject({});
        setOpenNarrowDown(false);
    };

    return (
        <Dialog open={openNarrowDown} onClose={handleCancelButton} fullWidth maxWidth="sm">
            <DialogTitle>絞り込み</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={1}>
                    <TextField
                        label="商品名"
                        value={filterObject.title}
                        onChange={(e) => handleFilterApply('title', e.target.value)}
                    />
                    <CategorySelector
                        newCategory={filterObject.category ?? ''}
                        handleInput={handleFilterApply}
                    />
                    <MethodSelector
                        newMethod={filterObject.method ?? ''}
                        handleInput={handleFilterApply}
                        errors={undefined}
                    />
                    <TextField
                        label="メモ"
                        value={filterObject.description}
                        onChange={(e) => handleFilterApply('description', e.target.value)}
                    />
                    <TextField
                        label="金額"
                        value={filterObject.difference}
                        onChange={(e) => handleFilterApply('difference', e.target.value)}
                    />
                    {/* TODO undefinedを扱うのでエラーになるのをどうにかする */}
                    <DatePicker
                        label="購入日"
                        value={filterObject.date}
                        onChange={(v) => handleFilterApply('date', v)}
                        slotProps={{
                            field: {
                                clearable: true,
                                onClear: () => handleFilterApply('date', undefined),
                            },
                        }}
                    />
                    <Autocomplete
                        value={
                            assetLabelList.find((a) => a.id === filterObject.assetId) ??
                            defaultAsset
                        }
                        sx={{ minWidth: 150 }}
                        options={assetLabelList}
                        autoSelect
                        clearOnEscape
                        isOptionEqualToValue={(option, value) => option.label === value.label}
                        onChange={(_e, v) => handleFilterApply('asset', v)}
                        renderInput={(params) => <TextField {...params} label="資産" />}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancelButton} color="error">
                    キャンセル
                </Button>
                <Button onClick={() => setOpenNarrowDown(false)}>適用</Button>
            </DialogActions>
        </Dialog>
    );
};

export default NarrowDownDialog;
