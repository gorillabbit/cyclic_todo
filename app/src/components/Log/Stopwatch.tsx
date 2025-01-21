import { useState, useEffect } from 'react';
import { LogType } from '../../types';

const formatElapsedTime = (seconds: number): string => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${days}日${hours}時間${minutes}分${remainingSeconds}秒`;
};

const UnitTimeMap = {
    秒: 1000,
    分: 1000 * 60,
    時: 1000 * 60 * 60,
    日: 1000 * 60 * 60 * 24,
    週: 1000 * 60 * 60 * 24 * 7,
    月: 1000 * 60 * 60 * 24 * 30, // 月の日数を30と仮定
    年: 1000 * 60 * 60 * 24 * 365, // 年の日数を365と仮定
};

const Stopwatch: React.FC<{ log: LogType }> = ({ log }) => {
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [announceCount, setAnnounceCount] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedTime((prevTime) => prevTime + 1);
        }, 1000);

        const announceInterval = setInterval(
            () => {
                setAnnounceCount((prev) => prev + 1);
            },
            UnitTimeMap[(log.voiceAnnounceUnit ?? '秒') as keyof typeof UnitTimeMap] *
                (log.voiceAnnounceNum ?? 60)
        );

        return () => {
            clearInterval(interval);
            clearInterval(announceInterval);
        };
    }, [log.voiceAnnounceNum, log.voiceAnnounceUnit]);

    useEffect(() => {
        if (log.availableVoiceAnnounce && announceCount !== 0) {
            const shortedElapsedTime = formatElapsedTime(elapsedTime).replace(
                /\b0[^\d\s]+\s*/g,
                ''
            );
            window.speechSynthesis.speak(new SpeechSynthesisUtterance(shortedElapsedTime));
        }
    }, [announceCount, elapsedTime, log.availableVoiceAnnounce]);

    return <div>経過 {formatElapsedTime(elapsedTime)}</div>;
};

export default Stopwatch;
