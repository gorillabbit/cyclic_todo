import { Timestamp } from 'firebase/firestore';

// 曜日を表す型を定義
export type WeekDay = '日曜日' | '月曜日' | '火曜日' | '水曜日' | '木曜日' | '金曜日' | '土曜日';

export interface TaskInputType {
    user_id: string;
    task_text: string;
    has_due: boolean;
    due_date: string;
    has_due_time: boolean;
    dueTime: string;
    completed: boolean;
    is周期的: string;
    周期日数: string;
    周期単位: string;
    親taskId?: string;
    toggle_completion_timestamp?: Timestamp;
    icon: string;
    description: string;
    tab_id: string;
}

export interface TaskType extends TaskInputType {
    id: string;
}
export interface LogsCompleteLogsInputType {
    logId: string;
    timestamp?: Timestamp;
    type?: string;
    memo: string;
    tab_id: string;
}

export interface LogsCompleteLogsType extends LogsCompleteLogsInputType {
    id: string;
}

export interface InputLogType {
    user_id: string;
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
    tab_id: string;
}

export interface LogType extends InputLogType {
    id: string;
}

export interface AccountInputType {
    email: string;
    name: string;
    icon: string;
    linked_accounts: string[];
    send_request: string[];
    receive_request: string[];
    use_tab_ids: string[];
}

export interface AccountType extends AccountInputType {
    id: string;
}

export interface AccountLinkType extends Pick<AccountType, 'id'> {}

export const defaultAccountInput: AccountInputType = {
    email: '',
    name: '',
    icon: '',
    linked_accounts: [],
    send_request: [],
    receive_request: [],
    use_tab_ids: [],
};

export const defaultAccount: AccountType = {
    ...defaultAccountInput,
    id: '',
};

export interface MethodType {
    user_id: string;
    label: string;
    asset_id: string;
    timing: '即時' | '翌月';
    timing_date: number;
    tab_id: string;
}

export const defaultMethod: MethodType = {
    user_id: '',
    label: '',
    asset_id: '',
    timing: '即時',
    timing_date: 1,
    tab_id: '',
};

export interface MethodListType extends MethodType {
    id: string;
}
export const defaultMethodList: MethodListType = {
    ...defaultMethod,
    id: '',
};

export interface InputAssetType {
    user_id: string;
    name: string;
    tab_id: string;
}
export interface AssetType extends InputAssetType {
    timestamp: Timestamp;
}
export interface AssetListType extends AssetType {
    id: string;
}

export interface InputPurchaseScheduleType {
    user_id: string;
    title: string;
    price: number;
    date?: number;
    day?: WeekDay;
    cycle: string;
    method: string;
    category: string;
    income: boolean;
    description: string;
    end_date: Date;
    is_uncertain: boolean;
    tab_id: string;
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
    user_id: string;
    price: number;
    date: Date;
    from: string;
    to: string;
    description: string;
    tab_id: string;
}
export const defaultTransferInput: InputTransferType = {
    user_id: '',
    price: 0,
    date: new Date(),
    from: '',
    to: '',
    description: '',
    tab_id: '',
};
export interface TransferType extends Omit<InputTransferType, 'date'> {
    id: string;
    date: Timestamp;
}

export interface InputTabType {
    create_user_uid: string;
    name: string;
    type: 'task' | 'purchase';
    shared_accounts: AccountLinkType[];
}
export interface TabType extends InputTabType {
    id: string;
}

export interface TabListType extends TabType {}

export type ErrorType = Record<string, string | undefined>;
