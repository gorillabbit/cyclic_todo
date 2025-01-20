import { TableCell, TextField, IconButton, TableRow } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { memo, useCallback, useState } from 'react';
import DoneIcon from '@mui/icons-material/Done';
import { ErrorType, MethodListType } from '../../../../types';
import { usePurchase } from '../../../../hooks/useData';
import TableCellWrapper from '../../TableCellWrapper';
import { PurchaseDataType } from '../../../../types/purchaseTypes';
import {
	getPayDate,
	updateAndAddPurchases,
	updatePurchaseAndUpdateLater,
} from '../../../../utilities/purchaseUtilities';
import { getHasError, validateEditPurchase } from '../../KakeiboSchemas';
import MethodSelector from '../../ScreenParts/MethodSelector';
import CategorySelector from '../../ScreenParts/CategorySelector';

type UnderHalfRowProps = {
	editFormData: PurchaseDataType;
	handleEditFormChange: (
		name: string,
		value: string | Date | boolean | MethodListType | null
	) => void;
	handleSaveClick: () => void;
	hasError: boolean;
	errors: ErrorType;
};

const UnderHalfRow = memo(
	({
		editFormData,
		handleEditFormChange,
		handleSaveClick,
		errors,
		hasError,
	}: UnderHalfRowProps) => (
		<>
			<TableCellWrapper>
				<TextField
					value={editFormData.difference}
					onChange={(e) =>
						handleEditFormChange('difference', e.target.value)
					}
					size="small"
					error={!!errors.difference}
					helperText={errors.difference}
				/>
			</TableCellWrapper>
			<TableCellWrapper label={editFormData.balance} />
			<TableCellWrapper>
				<TextField
					name="description"
					value={editFormData.description}
					onChange={(e) =>
						handleEditFormChange('description', e.target.value)
					}
					size="small"
				/>
			</TableCellWrapper>
			<TableCell padding="none">
				<IconButton
					onClick={handleSaveClick}
					color="success"
					disabled={hasError}
				>
					<DoneIcon />
				</IconButton>
			</TableCell>
		</>
	)
);

type PlainEditPurchaseRowProps = UnderHalfRowProps & {
	isSmall: boolean;
};

const PlainEditPurchaseRow = memo(
	({
		editFormData,
		handleEditFormChange,
		isSmall,
		handleSaveClick,
		errors,
		hasError,
	}: PlainEditPurchaseRowProps) => (
		<>
			<TableRow
				sx={{
					borderColor:
						editFormData.difference > 0 ? '#c5fcdc' : '#fcc9c5',
					borderRightWidth: 10,
				}}
			>
				<TableCellWrapper />
				<TableCellWrapper>
					<DatePicker
						value={editFormData.date}
						onChange={(v) => handleEditFormChange('date', v)}
						slotProps={{ textField: { size: 'small' } }}
						sx={{ maxWidth: 190 }}
					/>
				</TableCellWrapper>
				<TableCellWrapper>
					<TextField
						value={editFormData.title}
						onChange={(e) =>
							handleEditFormChange('title', e.target.value)
						}
						size="small"
						error={!!errors.title}
						helperText={errors.title}
					/>
				</TableCellWrapper>
				<TableCellWrapper>
					<CategorySelector
						newCategory={editFormData.category}
						handleInput={handleEditFormChange}
						isSmall
					/>
				</TableCellWrapper>
				<TableCellWrapper>
					<MethodSelector
						newMethod={editFormData.method}
						handleInput={handleEditFormChange}
						errors={errors.method}
						isSmall
					/>
				</TableCellWrapper>
				{!isSmall && (
					<UnderHalfRow
						editFormData={editFormData}
						handleEditFormChange={handleEditFormChange}
						handleSaveClick={handleSaveClick}
						errors={errors}
						hasError={hasError}
					/>
				)}
			</TableRow>
			{isSmall && (
				<TableRow>
					<TableCellWrapper />
					<UnderHalfRow
						editFormData={editFormData}
						handleEditFormChange={handleEditFormChange}
						handleSaveClick={handleSaveClick}
						errors={errors}
						hasError={hasError}
					/>
				</TableRow>
			)}
		</>
	)
);

const EditPurchaseRow = ({
	setIsEdit,
	editFormData,
	setEditFormData,
	isSmall,
	updatePurchases,
}: {
	setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
	editFormData: PurchaseDataType;
	setEditFormData: React.Dispatch<React.SetStateAction<PurchaseDataType>>;
	isSmall: boolean;
	updatePurchases: PurchaseDataType[];
}) => {
	const { setPurchaseList } = usePurchase();

	// 編集内容を保存する関数
	const handleSaveClick = useCallback(async () => {
		const method = editFormData.method;
		const 更新後purchase = (
			await updatePurchaseAndUpdateLater(
				{
					...editFormData,
					assetId: method.assetId,
					payDate: getPayDate(editFormData),
				},
				updatePurchases
			)
		).purchases;
		// 編集が完了したあとにそれとわかる何かを表示するスナックバーなど。
		updateAndAddPurchases(更新後purchase);
		setPurchaseList(更新後purchase);
		setIsEdit(false);
	}, [editFormData, setIsEdit, setPurchaseList, updatePurchases]);

	const [errors, setErrors] = useState<ErrorType>({});
	const hasError = getHasError(errors);

	const handleEditFormChange = useCallback(
		(
			name: string,
			value: string | Date | boolean | MethodListType | null
		) => {
			setEditFormData((prev) => {
				const nextPurchase = { ...prev, [name]: value };
				const errors = validateEditPurchase(nextPurchase);
				setErrors(errors);
				return nextPurchase;
			});
		},
		[]
	);

	const plainProps = {
		editFormData,
		handleEditFormChange,
		handleSaveClick,
		isSmall,
		errors,
		hasError,
	};
	return <PlainEditPurchaseRow {...plainProps} />;
};

export default EditPurchaseRow;
