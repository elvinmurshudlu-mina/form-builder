import  {useId} from 'react';
import ComponentWrapper from "../ComponentWrapper/ComponentWrapper.tsx";
import {Select, type SelectProps} from "antd";
import type { IFormComponentProps} from "../../type/types.ts";
import {Controller} from "react-hook-form";
import {useFormWrapper} from "../../hooks/useFormWrapper.tsx";
interface BaseFormSelectProps extends SelectProps{

}

type FormSelectProps = BaseFormSelectProps &IFormComponentProps;

function FormSelect({label,fieldName,dependOn,isVisible,calculateValue,className,initialValue,...props}:FormSelectProps) {
    const {control } = useFormWrapper(label)
    const id = useId()
    return (
        <ComponentWrapper className={className} dependOn={dependOn} isVisible={isVisible} calculateValue={calculateValue} label={label} fieldName={fieldName} id={id} >
            <Controller render={({field})=>{
                return <Select style={{width:"100%"}} defaultValue={initialValue} {...field} {...props} id={id}></Select>
            }} name={fieldName} control={control}></Controller>
        </ComponentWrapper>

    );
}

export default FormSelect;