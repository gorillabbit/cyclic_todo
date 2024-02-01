import React, { useState, useEffect } from "react";

function Clock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // 1秒ごとに更新

    return () => {
      clearInterval(timerId); // コンポーネントのクリーンアップ時にタイマーを停止
    };
  }, []);

  // 日付と曜日をフォーマットする関数
  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    };
    return date.toLocaleDateString("ja-JP", options);
  };

  return (
    <div style={{ margin: "10px" }}>
      {formatDate(currentTime)} {currentTime.toLocaleTimeString()}
    </div>
  );
}

export default Clock;
