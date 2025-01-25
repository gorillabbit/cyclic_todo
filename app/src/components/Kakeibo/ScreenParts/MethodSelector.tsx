import { Autocomplete, TextField } from '@mui/material';
import { useMethod } from '../../../hooks/useData';

type MethodSelectorProps = {
    newMethod: string;
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
    const currentMethod = methodList.find((m) => m.id === newMethod);
    console.log('methodList:', methodList);
    return (
        <Autocomplete
            value={currentMethod ?? null}
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
