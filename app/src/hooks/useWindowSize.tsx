import { useState, useEffect } from 'react';

// カスタムフックuseWindowSizeの定義
export const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        // サイズを設定するヘルパー関数
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        // コンポーネントがマウントされた時にサイズを設定
        handleResize();

        // resizeイベントにリスナーを設定
        window.addEventListener('resize', handleResize);

        // クリーンアップ関数
        return () => window.removeEventListener('resize', handleResize);
    }, []); // 空の依存配列を使用して、効果がマウントおよびアンマウント時にのみ実行されるようにする

    return windowSize;
};

export const useIsSmall = () => {
    const [isSmall, setIsSmall] = useState(false);
    const windowSize = useWindowSize();
    if (windowSize.width < 750 && isSmall === false) {
        setIsSmall(true);
    }
    if (windowSize.width >= 750 && isSmall === true) {
        setIsSmall(false);
    }
    return isSmall;
};
