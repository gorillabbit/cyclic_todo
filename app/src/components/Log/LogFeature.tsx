import { updateDocLog } from '../../firebase';
import { LogType, LogsCompleteLogsType } from '../../types';
import ChipWrapper from '../ChipWrapper';
import { differenceInDays } from 'date-fns';
import { useEffect, useState } from 'react';
import { checkLastLogCompleted } from '../../utilities/dateUtilities';

interface LogFeatureProp {
    log: LogType;
    isLastCompletedAvailable: boolean;
    lastCompleted: string;
    finishLogs: LogsCompleteLogsType[];
    isOpen: boolean;
}

const updateDisplayFeature = (log: LogType, feature: string) => {
    if (log.displayFeature.includes(feature)) {
        const newDisplayFeature = log.displayFeature.filter(
            (item: string) => item !== feature
        );
        updateDocLog(log.id, { displayFeature: [...newDisplayFeature] });
    } else {
        updateDocLog(log.id, {
            displayFeature: [...log.displayFeature, feature],
        });
    }
};

const LogFeature: React.FC<LogFeatureProp> = ({
    log,
    isLastCompletedAvailable,
    lastCompleted,
    finishLogs,
    isOpen,
}) => {
    const [intervalFromLastCompleted, setIntervalFromLastCompleted] =
        useState<string>('');

    useEffect(() => {
        if (isLastCompletedAvailable) {
            const lastLogCompleted =
                checkLastLogCompleted(lastCompleted) || '0分';
            setIntervalFromLastCompleted(lastLogCompleted);
            const timerId = setInterval(() => {
                setIntervalFromLastCompleted(lastLogCompleted);
            }, 1000 * 60); // 1分ごとに更新
            return () => {
                clearInterval(timerId);
            };
        }
    }, [lastCompleted, isLastCompletedAvailable]);
    const completedCounts = finishLogs.length;
    const todayCompletedCounts = finishLogs.filter(
        (finishLog) =>
            differenceInDays(
                new Date(),
                finishLog.timestamp ? finishLog.timestamp.toDate() : new Date()
            ) < 1
    );
    const displayFeature = log.displayFeature;
    if (!displayFeature) {
        return <></>;
    }
    const displayFeatureMap = [
        {
            title: '前回からの間隔',
            label: '前回から' + intervalFromLastCompleted,
            flag: intervalFromLastCompleted,
        },
        {
            title: '標準間隔',
            label: '標準間隔' + log.intervalNum + log.intervalUnit,
            flag: log.interval,
        },
        {
            title: '本日回数',
            label: '本日' + todayCompletedCounts.length + '回',
            flag: true,
        },
        {
            title: '通算回数',
            label: '通算' + completedCounts + '回',
            flag: true,
        },
        {
            title: '音声案内',
            label: '音声案内 ' + log.voiceAnnounceNum + log.voiceAnnounceUnit,
            flag: log.availableVoiceAnnounce,
        },
    ];
    return (
        <>
            {displayFeatureMap.map(
                (mapItem) =>
                    mapItem.flag &&
                    (displayFeature.includes(mapItem.title) || isOpen) && (
                        <ChipWrapper
                            key={mapItem.label}
                            label={mapItem.label}
                            isSelected={displayFeature.includes(mapItem.title)}
                            onClick={() =>
                                updateDisplayFeature(log, mapItem.title)
                            }
                        />
                    )
            )}
        </>
    );
};

export default LogFeature;
