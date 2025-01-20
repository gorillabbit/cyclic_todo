import {
    Table,
    TableBody,
    TableContainer,
    TableRow,
    Paper,
    IconButton,
    TableHead,
    TableCell,
    Tooltip,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { addDocAsset } from '../../../firebase';
import { memo, useCallback, useState } from 'react';
import { AssetListType } from '../../../types';
import AssetRow from './AssetRow';
import { useAccount, useAsset, useTab } from '../../../hooks/useData';
import TableCellWrapper from '../TableCellWrapper';

type PlainAssetsListProps = {
    assetList: AssetListType[];
    addAsset: () => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
};

const PlainAssetsList = memo(
    (props: PlainAssetsListProps): JSX.Element => (
        <TableContainer component={Paper} sx={{ marginY: 2 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell padding="none">
                            <Tooltip
                                title={
                                    props.isOpen
                                        ? '編集を終える'
                                        : '資産を編集する'
                                }
                            >
                                <IconButton
                                    onClick={() =>
                                        props.setIsOpen(!props.isOpen)
                                    }
                                >
                                    {props.isOpen ? (
                                        <CloseFullscreenIcon />
                                    ) : (
                                        <KeyboardArrowDownIcon />
                                    )}
                                </IconButton>
                            </Tooltip>
                        </TableCell>
                        <TableCellWrapper label="名前" />
                        <TableCellWrapper label="残高" />
                        <TableCellWrapper label="月末残高" />
                        <TableCellWrapper />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.assetList.map((asset) => (
                        <AssetRow
                            asset={asset}
                            key={asset.id}
                            isOpen={props.isOpen}
                        />
                    ))}
                    <TableRow>
                        <TableCellWrapper label="合計" colSpan={2} />
                    </TableRow>
                </TableBody>
            </Table>
            {props.isOpen && (
                <IconButton onClick={props.addAsset} color="primary">
                    <AddCircleOutlineIcon />
                </IconButton>
            )}
        </TableContainer>
    )
);

const AssetTable = memo(() => {
    const { assetList } = useAsset();
    const { tabId } = useTab();
    const { Account } = useAccount();
    const [isOpen, setIsOpen] = useState(false);

    // TODO 追加時に「残高調整」というメソッドを自動でつくる
    const addAsset = useCallback(() => {
        if (!Account) return;
        const newAssetLog = {
            userId: Account.id,
            tabId,
            name: '',
        };
        addDocAsset(newAssetLog);
    }, [Account, tabId]);

    const plainProps = {
        assetList,
        addAsset,
        isOpen,
        setIsOpen,
    };

    return <PlainAssetsList {...plainProps} />;
});

export default AssetTable;
