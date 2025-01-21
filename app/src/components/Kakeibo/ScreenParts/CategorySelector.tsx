import { Autocomplete, TextField } from '@mui/material';
import { usePurchase } from '../../../hooks/useData';

type CategorySelectorProps = {
    newCategory: string;
    handleInput: (name: string, value: any) => void;
    isSmall?: boolean;
};

const CategorySelector = ({ newCategory, handleInput, isSmall }: CategorySelectorProps) => {
    const { categorySet } = usePurchase();
    const handleChange = (v: string | null) => {
        handleInput('category', v || ''); // nullだとグラフがバグるので空文字に変換
    };
    return (
        <Autocomplete
            value={newCategory}
            sx={{ minWidth: 150 }}
            options={categorySet}
            freeSolo
            autoSelect
            clearOnEscape
            onChange={(_e, v) => handleChange(v)}
            renderInput={(params) => (
                <TextField {...params} label="カテゴリー" size={isSmall ? 'small' : 'medium'} />
            )}
        />
    );
};

export default CategorySelector;
