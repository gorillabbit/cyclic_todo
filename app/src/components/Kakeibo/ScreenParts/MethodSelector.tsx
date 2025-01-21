import { Autocomplete, TextField } from '@mui/material';
import { useMethod } from '../../../hooks/useData';
import { MethodListType } from '../../../types';

type MethodSelectorProps = {
    newMethod: MethodListType;
    handleInput: (name: string, value: any) => void;
    errors: string | undefined;
    inputName?: string;
    isSmall?: boolean;
};

const MethodSelector = ({
    newMethod,
    handleInput,
    errors,
    inputName,
    isSmall,
}: MethodSelectorProps) => {
    const { methodList } = useMethod();
    return (
        <Autocomplete
            value={newMethod?.label ? newMethod : null}
            sx={{ minWidth: 150 }}
            options={methodList}
            onChange={(_e, v) => handleInput(inputName ?? 'method', v)}
            isOptionEqualToValue={(option, value) => option.label === value?.label}
            renderInput={(params) => (
                <TextField
                    {...params}
                    error={!!errors}
                    helperText={errors}
                    label="支払い方法"
                    size={isSmall ? 'small' : 'medium'}
                />
            )}
        />
    );
};

export default MethodSelector;
