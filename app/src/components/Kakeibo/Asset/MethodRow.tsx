import {
	TableRow,
	TextField,
	Button,
	IconButton,
	Select,
	MenuItem,
	SelectChangeEvent,
	InputAdornment,
} from '@mui/material';
import { memo, useCallback, useMemo, useState } from 'react';
import { ErrorType, MethodListType } from '../../../types';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteDocMethod, updateDocMethod } from '../../../firebase';
import {
	numericProps,
	sumSpentAndIncome,
} from '../../../utilities/purchaseUtilities';
import { useMethod, usePurchase } from '../../../hooks/useData';
import TableCellWrapper from '../TableCellWrapper';
import {
	getFutureMonthFirstDay,
	getThisMonthFirstDay,
} from '../../../utilities/dateUtilities';
import { getHasError, validateMethod } from '../KakeiboSchemas';

type PlainMethodRowProps = {
	methodInput: MethodListType;
	handleMethodInput: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
	handleSelectInput: (e: SelectChangeEvent<string>) => void;
	isChanged: boolean;
	removeMethod: () => void;
	saveChanges: () => void;
	thisMonthSpent: number;
	thisMonthIncome: number;
	errors: ErrorType;
	hasError: boolean;
};

const PlainMethodRow = memo(
	({
		methodInput,
		handleMethodInput,
		handleSelectInput,
		isChanged,
		removeMethod,
		saveChanges,
		thisMonthSpent,
		thisMonthIncome,
		errors,
		hasError,
	}: PlainMethodRowProps) => (
		<TableRow>
			<TableCellWrapper>
				<TextField
					variant="outlined"
					value={methodInput.label}
					name="label"
					onChange={handleMethodInput}
					size="small"
					error={!!errors.label}
					helperText={errors.label}
				/>
			</TableCellWrapper>
			<TableCellWrapper label={thisMonthIncome} />
			<TableCellWrapper label={-thisMonthSpent} />
			<TableCellWrapper>
				<Select
					value={methodInput.timing}
					name="timing"
					onChange={handleSelectInput}
					size="small"
				>
					<MenuItem value="即時">即時</MenuItem>
					<MenuItem value="翌月">翌月</MenuItem>
				</Select>
				{methodInput.timing === '翌月' && (
					<TextField
						name="timingDate"
						value={methodInput.timingDate}
						InputProps={{
							endAdornment: (
								<InputAdornment position="start">
									日
								</InputAdornment>
							),
						}}
						inputProps={numericProps}
						sx={{ maxWidth: 70, marginLeft: 1 }}
						onChange={handleMethodInput}
						size="small"
						error={!!errors.timingDate}
						helperText={errors.timingDate}
					/>
				)}
			</TableCellWrapper>
			<TableCellWrapper>
				<Button
					variant="contained"
					color="primary"
					disabled={!isChanged || !!hasError}
					onClick={saveChanges}
				>
					変更
				</Button>
			</TableCellWrapper>
			<TableCellWrapper>
				<IconButton onClick={removeMethod} color="error">
					<DeleteIcon />
				</IconButton>
			</TableCellWrapper>
		</TableRow>
	)
);

const MethodRow = ({ method }: { method: MethodListType }) => {
	const { methodList } = useMethod();
	const [methodInput, setMethodInput] = useState<MethodListType>(method);

	const [errors, setErrors] = useState<ErrorType>({});

	const hasError = getHasError(errors);

	const validate = useCallback((input: MethodListType) => {
		const newErrors = validateMethod(input);
		const duplicatedMethod =
			methodList.filter(
				(m) => m.label === input.label && m.id !== input.id
			).length > 0;
		if (duplicatedMethod) {
			newErrors.label = '他の支払い方法と同じ名前は禁止です';
		}
		setErrors(newErrors);
		return getHasError(newErrors);
	}, []);

	const handleMethodInput = useCallback(
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			const { name, value } = e.target;
			setMethodInput((prev) => {
				const newMethod = { ...prev, [name]: value };
				validate(newMethod);
				return newMethod;
			});
		},
		[]
	);

	const handleSelectInput = useCallback((e: SelectChangeEvent<string>) => {
		const { name, value } = e.target;
		setMethodInput((prev) => ({ ...prev, [name]: value }));
	}, []);

	const saveChanges = useCallback(() => {
		updateDocMethod(method.id, methodInput);
	}, [method, methodInput]);

	const removeMethod = useCallback(() => {
		deleteDocMethod(method.id);
	}, [method.id]);

	const isChanged = useMemo(
		() =>
			method.label !== methodInput.label ||
			method.timing !== methodInput.timing,
		[method, methodInput]
	);

	const { purchaseList } = usePurchase();
	const methodPurchase = purchaseList.filter(
		(p) => p.method.id === method.id
	);
	const thisMonthPurchase = methodPurchase.filter(
		(p) =>
			getFutureMonthFirstDay() > p.date &&
			p.date >= getThisMonthFirstDay()
	);
	const thisMonthSpent = sumSpentAndIncome(
		thisMonthPurchase.filter((p) => p.difference < 0)
	);
	const thisMonthIncome = sumSpentAndIncome(
		thisMonthPurchase.filter((p) => p.difference > 0)
	);

	const plainProps = {
		methodInput,
		handleMethodInput,
		handleSelectInput,
		isChanged,
		saveChanges,
		removeMethod,
		thisMonthSpent,
		thisMonthIncome,
		errors,
		hasError,
	};

	return <PlainMethodRow {...plainProps} />;
};

export default MethodRow;
