import {
    FormGroup,
    TextField,
    Select,
    MenuItem,
    Button,
    Box,
    FormControl,
    InputLabel,
} from '@mui/material';
import { useState } from 'react';
import { InputLogType, LogType } from '../../types.js';
import StyledCheckbox from '../StyledCheckbox';
import { getAuth } from 'firebase/auth';
import { useTab } from '../../hooks/useData.js';
import { useAccountStore } from '../../stores/accountStore.js';
import { useLogStore } from '../../stores/logStore.js';
import { createLog, updateLog } from '../../api/combinedApi.js';

interface LogInputFormProp {
    propLog?: LogType;
    openDialog?: boolean;
    setIsOpenEditDialog?: React.Dispatch<React.SetStateAction<boolean>>;
}

const auth = getAuth();

const LogInputForm: React.FC<LogInputFormProp> = ({ propLog, openDialog, setIsOpenEditDialog }) => {
    const { Account } = useAccountStore();
    const { tabId } = useTab();
    const defaultNewLog: InputLogType = {
        userId: '',
        taskText: '',
        duration: false,
        interval: false,
        intervalNum: 1,
        intervalUnit: '日',
        availableMemo: false,
        availableVoiceAnnounce: false,
        voiceAnnounceNum: 1,
        voiceAnnounceUnit: '分',
        icon: '',
        displayFeature: [],
        description: '',
        archived: false,
        tabId,
        accessibleAccounts: [],
    };

    const [newLog, setNewLog] = useState<InputLogType | LogType>(propLog ?? defaultNewLog);
    const { fetchLogs } = useLogStore();
    const [newAccessibleAccountIds, setNewAccessibleAccountIds] = useState<string[]>(
        propLog?.accessibleAccounts?.map((account) => account) ?? []
    );

    const handleNewLogInput = (name: string, value: unknown) => {
        if (name === 'intervalNum' && typeof value === 'string' && parseInt(value, 10) <= 0) {
            alert('0以下は入力できません。');
            return;
        }
        setNewLog((prev) => ({ ...prev, [name]: value }));
    };

    const handleMultipleSelect = (value: string[] | string) => {
        if (Array.isArray(value)) {
            setNewAccessibleAccountIds(value);
        }
    };

    const newAccessibleAccounts = Account?.linkedAccounts.filter((account) =>
        newAccessibleAccountIds.includes(account)
    );

    const addLog = async () => {
        if (newLog && auth.currentUser) {
            const userId = auth.currentUser.uid;
            await createLog({
                ...newLog,
                userId,
                accessibleAccounts: newAccessibleAccounts ?? [],
                id: new Date().getTime().toString(),
                timestamp: new Date(),
            });
            fetchLogs(tabId, userId);
            setNewLog(defaultNewLog);
        }
    };

    const editLog = async () => {
        if (newLog && auth.currentUser) {
            await updateLog((newLog as LogType).id, {
                ...newLog,
                accessibleAccounts: newAccessibleAccounts ?? [],
            });
            fetchLogs(tabId, auth.currentUser.uid);
        }
        setIsOpenEditDialog?.(false);
    };

    return (
        <Box display="flex">
            <FormGroup row sx={{ gap: 1, m: 1, width: '100%' }}>
                <TextField
                    fullWidth
                    autoFocus
                    required
                    label="ログ"
                    value={newLog.taskText}
                    onChange={(e) => handleNewLogInput('taskText', e.target.value)}
                    placeholder="記録を入力"
                />
                {(newLog.taskText || openDialog) && (
                    <>
                        <TextField
                            fullWidth
                            label="説明"
                            value={newLog.description}
                            multiline
                            onChange={(e) => handleNewLogInput('description', e.target.value)}
                            placeholder="説明を入力"
                        />
                        <StyledCheckbox
                            value={newLog.duration}
                            handleCheckbox={() => handleNewLogInput('duration', !newLog.duration)}
                        >
                            スパン
                        </StyledCheckbox>
                        {newLog.duration && (
                            <>
                                <StyledCheckbox
                                    value={newLog.availableVoiceAnnounce}
                                    handleCheckbox={() =>
                                        handleNewLogInput(
                                            'availableVoiceAnnounce',
                                            !newLog.availableVoiceAnnounce
                                        )
                                    }
                                >
                                    音声案内
                                </StyledCheckbox>
                                {newLog.availableVoiceAnnounce && (
                                    <TextField
                                        label="間隔"
                                        value={newLog.voiceAnnounceNum}
                                        type="number"
                                        onChange={(e) =>
                                            handleNewLogInput('voiceAnnounceNum', e.target.value)
                                        }
                                        sx={{ maxWidth: 100 }}
                                    />
                                )}
                                {newLog.availableVoiceAnnounce && (
                                    <Select
                                        value={newLog.voiceAnnounceUnit}
                                        onChange={(e) =>
                                            handleNewLogInput('voiceAnnounceUnit', e.target.value)
                                        }
                                    >
                                        <MenuItem value="秒">秒</MenuItem>
                                        <MenuItem value="分">分</MenuItem>
                                        <MenuItem value="時">時</MenuItem>
                                        <MenuItem value="日">日</MenuItem>
                                        <MenuItem value="週">週</MenuItem>
                                        <MenuItem value="月">月</MenuItem>
                                        <MenuItem value="年">年</MenuItem>
                                    </Select>
                                )}
                            </>
                        )}
                        <StyledCheckbox
                            value={newLog.interval}
                            handleCheckbox={() => handleNewLogInput('interval', !newLog.interval)}
                        >
                            標準間隔
                        </StyledCheckbox>
                        {newLog.interval && (
                            <>
                                <TextField
                                    label="間隔"
                                    value={newLog.intervalNum}
                                    type="number"
                                    onChange={(e) =>
                                        handleNewLogInput('intervalNum', e.target.value)
                                    }
                                    sx={{ maxWidth: 100 }}
                                />
                                <Select
                                    value={newLog.intervalUnit}
                                    onChange={(e) =>
                                        handleNewLogInput('intervalUnit', e.target.value)
                                    }
                                >
                                    <MenuItem value="秒">秒</MenuItem>
                                    <MenuItem value="分">分</MenuItem>
                                    <MenuItem value="時">時</MenuItem>
                                    <MenuItem value="日">日</MenuItem>
                                    <MenuItem value="週">週</MenuItem>
                                    <MenuItem value="月">月</MenuItem>
                                    <MenuItem value="年">年</MenuItem>
                                </Select>
                            </>
                        )}
                        <StyledCheckbox
                            value={newLog.availableMemo}
                            handleCheckbox={() =>
                                handleNewLogInput('availableMemo', !newLog.availableMemo)
                            }
                        >
                            完了時メモ
                        </StyledCheckbox>
                        {Account &&
                            Account.linkedAccounts.length > 0 &&
                            newLog.accessibleAccounts && (
                                <FormControl sx={{ minWidth: 300 }}>
                                    <InputLabel>共有アカウント</InputLabel>
                                    <Select
                                        multiple
                                        value={newAccessibleAccountIds}
                                        label="共有アカウント"
                                        onChange={(e) => handleMultipleSelect(e.target.value)}
                                    >
                                        {Account.linkedAccounts.map((account) => (
                                            <MenuItem key={account} value={account}>
                                                {account}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                    </>
                )}
            </FormGroup>
            <Button sx={{ my: 1 }} variant="contained" onClick={propLog ? editLog : addLog}>
                {propLog ? '変更' : '追加'}
            </Button>
        </Box>
    );
};

export default LogInputForm;
