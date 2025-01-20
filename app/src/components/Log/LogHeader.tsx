import React from 'react';
import Box from '@mui/material/Box';
import { getSpanDate } from '../../utilities/dateUtilities';
import { LogType } from '../../types';

interface LogHeaderProps {
    lastCompleted: string;
    log: LogType;
}

const LogHeader: React.FC<LogHeaderProps> = ({ lastCompleted, log }) => {
    // diffRatio の計算を行う関数
    const calculateDiffRatio = () => {
        const spans = getSpanDate(lastCompleted);
        const intervalTime = log.intervalNum;
        const diffRatioMap = {
            秒: spans.diffSeconds,
            分: spans.diffMinutes,
            時: spans.diffHours,
            日: spans.diffDays,
            週: spans.diffWeeks,
            月: spans.diffMonths,
            年: spans.diffYears,
        };
        const intervalUnit = log.intervalUnit as keyof typeof diffRatioMap;
        return (diffRatioMap[intervalUnit] - intervalTime) / intervalTime;
    };

    // diffRatio に基づいて色を取得する関数
    const getIntervalColor = (diffRatio: number) => {
        if (diffRatio < 0.5) {
            return '#BEEBC6'; //緑
        } else if (diffRatio < 1) {
            return '#EBE0BE'; //黄色
        } else if (diffRatio < 2) {
            return '#EBBEC6'; //赤
        }
        return '#d0d0d0'; //グレー
    };

    const diffRatio = calculateDiffRatio();
    const intervalColor = getIntervalColor(diffRatio);

    return <Box height="10px" bgcolor={intervalColor} />;
};

export default LogHeader;
