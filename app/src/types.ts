import { Timestamp } from 'firebase/firestore';

// 曜日を表す型を定義
export type WeekDay = '日曜日' | '月曜日' | '火曜日' | '水曜日' | '木曜日' | '金曜日' | '土曜日';

export interface TaskInputType {
    userId: string;
    text: string;
    hasDue: boolean;
    dueDate: string;
    hasDueTime: boolean;
    dueTime: string;
    completed: boolean;
    is周期的: string;
    周期日数: string;
    周期単位: string;
    親taskId?: string;
    toggleCompletionTimestamp?: Timestamp;
    icon: string;
    description: string;
    tabId: string;
}

export interface TaskType extends TaskInputType {
    id: string;
}
export interface LogsCompleteLogsInputType {
    logId: string;
    timestamp?: Timestamp;
    type?: string;
    memo: string;
    tabId: string;
}

export interface LogsCompleteLogsType extends LogsCompleteLogsInputType {
    id: string;
}

export interface InputLogType {
    userId: string;
    text: string;
    親logId?: string;
    timestamp?: Timestamp;
    completeLogs?: LogsCompleteLogsType[];
    duration: boolean;
    interval: boolean;
    intervalNum: number;
    intervalUnit: string;
    availableMemo: boolean;
    availableVoiceAnnounce: boolean;
    voiceAnnounceNum?: number;
    voiceAnnounceUnit?: string;
    icon?: string;
    displayFeature: string[];
    description: string;
    archived: boolean;
    accessibleAccounts: string[];
    tabId: string;
}

export interface LogType extends InputLogType {
    id: string;
}

export interface AccountInputType {
    email: string;
    name: string;
    icon: string;
    linkedAccounts: string[];
    sendRequest: string[];
    receiveRequest: string[];
    useTabIds: string[];
}

export interface AccountType extends AccountInputType {
    id: string;
}

export interface AccountLinkType extends Pick<AccountType, 'id'> {}

export const defaultAccountInput: AccountInputType = {
    email: '',
    name: '',
    icon: '',
    linkedAccounts: [],
    sendRequest: [],
    receiveRequest: [],
    useTabIds: [],
};

export const defaultAccount: AccountType = {
    ...defaultAccountInput,
    id: '',
};

export interface MethodType {
    userId: string;
    label: string;
    assetId: string;
    timing: '即時' | '翌月';
    timingDate: number;
    tabId: string;
}

export const defaultMethod: MethodType = {
    userId: '',
    label: '',
    assetId: '',
    timing: '即時',
    timingDate: 1,
    tabId: '',
};

export interface MethodListType extends MethodType {
    id: string;
}
export const defaultMethodList: MethodListType = {
    ...defaultMethod,
    id: '',
};

export interface InputAssetType {
    userId: string;
    name: string;
    tabId: string;
}
export interface AssetListType extends InputAssetType {
    id: string;
}

export interface InputPurchaseScheduleType {
    userId: string;
    title: string;
    price: number;
    date?: number;
    day?: WeekDay;
    cycle: string;
    method: string;
    category: string;
    income: boolean;
    description: string;
    endDate: Date;
    isUncertain: boolean;
    tabId: string;
}
export interface InputPurchaseScheduleRowType extends InputPurchaseScheduleType {
    id: string;
}
export interface PurchaseScheduleType extends InputPurchaseScheduleType {
    id: string;
}
export interface PurchaseScheduleListType extends PurchaseScheduleType {
    id: string;
}

export interface InputTransferType {
    userId: string;
    price: number;
    date: Date;
    from: string;
    to: string;
    description: string;
    tabId: string;
}
export const defaultTransferInput: InputTransferType = {
    userId: '',
    price: 0,
    date: new Date(),
    from: '',
    to: '',
    description: '',
    tabId: '',
};
export interface TransferType extends Omit<InputTransferType, 'date'> {
    id: string;
    date: Timestamp;
}

export interface InputTabType {
    createUserUid: string;
    name: string;
    type: 'task' | 'purchase';
    sharedAccounts: AccountLinkType[];
}
export interface TabType extends InputTabType {
    id: string;
}

export interface TabListType extends TabType {}

export type ErrorType = Record<string, string | undefined>;
