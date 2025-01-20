import { useState } from 'react';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import PurchaseInput from './PurchaseInput';
import PurchaseScheduleInput from './PurchaseScheduleInput';
import TransferInput from './TransferInput';
import ShareTabDialog from '../../ShareTabDialog';

const InputForms = () => {
    const [type, setType] = useState<string>('記録');
    //愚直に三項演算子で条件分岐すると、コンポーネントが再レンダリングされて入力内容が保存されない
    return (
        <>
            <ToggleButtonGroup
                value={type}
                exclusive
                onChange={(_e, v) => setType(v)}
                sx={{ my: 1 }}
            >
                <ToggleButton value="記録">記録</ToggleButton>
                <ToggleButton value="予定">予定</ToggleButton>
                <ToggleButton value="送金">送金</ToggleButton>
            </ToggleButtonGroup>
            <ShareTabDialog />
            <Box display={type === '記録' ? 'block' : 'none'}>
                <PurchaseInput />
            </Box>
            <Box display={type === '予定' ? 'block' : 'none'}>
                <PurchaseScheduleInput />
            </Box>
            <Box display={type === '送金' ? 'block' : 'none'}>
                <TransferInput />
            </Box>
        </>
    );
};

export default InputForms;
