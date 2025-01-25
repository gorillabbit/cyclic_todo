import { z, ZodEffects, ZodError, ZodObject } from 'zod';
import { ErrorType, InputPurchaseScheduleType, InputTransferType, MethodType } from '../../types';
import { InputFieldPurchaseType, PurchaseDataType } from '../../types/purchaseTypes';

const title = z.string().min(1, { message: '品目名を入力してください' });
const price = z
    .union([z.string(), z.number()])
    .refine((val) => Number(val) >= 0, { message: '金額は正の数である必要があります' });
const date = z.date().refine((val) => !isNaN(val.getTime()), {
    message: '有効な日付を入力してください',
});
const dateNumber = z
    .union([z.string(), z.number()])
    .refine((val) => Number(val) > 0 && 32 > Number(val), {
        message: '1~31の数である必要があります',
    });
const method = z.object({
    label: z.string().min(1, { message: '支払い方法を選択してください' }),
    assetId: z.string(),
    timing: z.enum(['即時', '翌月']),
    timingDate: dateNumber,
});
const difference = z
    .union([z.string(), z.number()])
    .refine((val) => Number(val), { message: '金額は数である必要があります' });

const purchaseSchema = z.object({
    title,
    price,
    date,
});

const editMethod = z.object({
    label: z.string().min(1, { message: '支払い方法を選択してください' }),
});

const editPurchaseSchema = z.object({
    title,
    difference,
    date,
    method: editMethod,
});

const purchaseScheduleSchema = z.object({
    title,
    price,
    date: dateNumber,
    method,
    endDate: date,
});

const transferSchema = z
    .object({
        price,
        date,
        from: method,
        to: method.refine((data) => data.timing === '即時', { message: '後払いは選択できません' }),
    })
    .superRefine((data, ctx) => {
        if (data.from.label === data.to.label) {
            ctx.addIssue({
                path: ['to'],
                code: 'invalid_date',
                message: '同じ支払い方法を選択することはできません',
            });
            ctx.addIssue({
                path: ['from'],
                code: 'invalid_date',
                message: '同じ支払い方法を選択することはできません',
            });
        }
    });

const validateField = <T, F extends ZodObject<any> | ZodEffects<any>>(
    schema: F, input: T
):ErrorType => {
    try {
        schema.parse(input);
        return {};
    } catch (error) {
        const newErrors: ErrorType = {};
        if (error instanceof ZodError) {
            error.errors.forEach((e) => {
                newErrors[e.path[0]] = e.message;
            });
        }
        return newErrors;
    }
};

export const validatePurchase = (input: InputFieldPurchaseType): ErrorType => {
    return validateField<typeof input, typeof purchaseSchema>(purchaseSchema, input);
};

export const validateEditPurchase = (input: PurchaseDataType): ErrorType => {
    return validateField<typeof input, typeof editPurchaseSchema>(editPurchaseSchema, input);
};

export const validatePurchaseSchedule = (input: InputPurchaseScheduleType): ErrorType => {
    return validateField<InputPurchaseScheduleType, typeof purchaseScheduleSchema>(
        purchaseScheduleSchema,
        input
    );
};

export const validateTransfer = (input: InputTransferType): ErrorType => {
    return validateField<typeof input, typeof transferSchema>(transferSchema, input);
};

export const validateMethod = (input: MethodType): ErrorType => {
    return validateField<typeof input, typeof method>(method, input);
};

/**
 * errorsの中にエラーがあるかどうかを返す
 * @param errors
 * @returns
 */
export const getHasError = (errors: ErrorType): boolean => {
    return Object.values(errors).some((v): boolean => Boolean(v));
};
