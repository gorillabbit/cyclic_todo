import {
    Line,
    LineChart,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    Brush,
} from 'recharts';
import { format, set } from 'date-fns';
import { usePurchase, useAsset } from '../../../../hooks/useData';
import { getFutureMonthFirstDay } from '../../../../utilities/dateUtilities';
import { fontSizeObj } from './DefaultConst';
import { generateColor } from './ChartUtils';

const BalanceChart = () => {
    const { purchaseList } = usePurchase();
    const lastPurchase = purchaseList.filter(
        (p) =>
            // とりあえず2ヶ月先までのデータを表示 TODO: 条件は変更できるように
            p.pay_date < getFutureMonthFirstDay(2) &&
            // 2024年4月以降のデータを表示 TODO: 条件は変更できるように
            p.pay_date >= new Date('2024-04-01')
    );
    const { assetList } = useAsset();

    // データセットを作成
    const datasets = lastPurchase
        // 支払いの日付でソート
        .sort((a, b) => a.pay_date.getTime() - b.pay_date.getTime())
        .map((p, index) => {
            const asset = assetList.find((asset) => asset.id === p.asset_id);
            if (!asset) {
                return;
            }
            return {
                time: set(p.pay_date, {
                    // データが更新されるとき、同じ時刻のデータが大量に作成される問題があるので暫定的解決策　TODO: 修正
                    milliseconds: index,
                }).getTime(),
                [asset.name]: p.balance,
            };
        })
        // nullを除外
        .filter((data) => data);

    return (
        <ResponsiveContainer width="100%" height={200}>
            <LineChart width={500} height={300} data={datasets}>
                <XAxis
                    dataKey="time"
                    tickFormatter={(t) => format(t, 'MM月dd日')}
                    type="number"
                    scale="time"
                    domain={['auto', 'auto']}
                    tick={fontSizeObj}
                />
                <YAxis yAxisId="left" tick={fontSizeObj} />
                <YAxis yAxisId="right" orientation="right" tick={fontSizeObj} />
                <Tooltip
                    filterNull
                    cursor={{ stroke: 'red', strokeWidth: 0.5 }}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                />
                <Brush />
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                {assetList.map((asset, index) => (
                    <Line
                        type="monotone"
                        dataKey={asset.name}
                        stroke={generateColor(index)}
                        key={asset.id}
                        connectNulls
                        activeDot={{ r: 6 }}
                        dot={{ r: 1 }}
                        strokeWidth={2}
                        // SMBCだけ金額が大きいので左側のY軸に表示
                        // TODO: どの資産を左右に表示するかは設定で変更できるように
                        yAxisId={asset.name === 'SMBC' ? 'left' : 'right'}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};

export default BalanceChart;
