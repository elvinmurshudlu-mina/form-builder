import { Input, type InputProps } from "antd";
import ComponentWrapper from "../ComponentWrapper/ComponentWrapper";
import {  useId,  } from "react";
import { Controller,  } from "react-hook-form";
import { useFormWrapper } from "../../hooks/useFormWrapper";
import type { IFormComponentProps} from "../../type/types";

interface BaseFormInputProps extends InputProps {
    className?: string;
}
export type FormInputProps = BaseFormInputProps & IFormComponentProps;

function FormInput({
                       label,
                       fieldName,
                       className,
                       dependOn,
                       isVisible,
                       calculateValue,
    ...inputProps
                   }: FormInputProps) {
    const { control } = useFormWrapper();
    const id = useId();



    return (
        <ComponentWrapper dependOn={dependOn} calculateValue={calculateValue} isVisible={isVisible} className={className} label={label} fieldName={fieldName} id={id}>
            <Controller
                control={control}
                name={fieldName}
                render={({ field }) => <Input id={id} {...field} {...inputProps} />}
            />
        </ComponentWrapper>
    );
}

export default FormInput;
