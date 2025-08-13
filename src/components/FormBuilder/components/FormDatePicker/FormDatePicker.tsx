import {DatePicker, type DatePickerProps, } from "antd";
import type {IFormComponentProps} from "../../type/types.ts";
import ComponentWrapper from "../ComponentWrapper/ComponentWrapper.tsx";
import {Controller} from "react-hook-form";
import {useId} from "react";
import {useFormWrapper} from "../../hooks/useFormWrapper.tsx";

interface BaseFormSelectProps extends DatePickerProps{}

type FormDatePickerProps = BaseFormSelectProps & IFormComponentProps;

function FormDatePicker({className,dependOn,calculateValue,isVisible,label,fieldName,...props}:FormDatePickerProps) {
    const {control } = useFormWrapper(label)
    const id = useId()
    return (
        <ComponentWrapper className={className} dependOn={dependOn} isVisible={isVisible} calculateValue={calculateValue} label={label} fieldName={fieldName} id={id} >
            <Controller render={({field})=>{
                return <DatePicker  style={{width:"100%"}}  {...field} {...props} id={id}
                onChange={(date)=>field.onChange(date)}
                ></DatePicker>
            }} name={fieldName} control={control}></Controller>
        </ComponentWrapper>
    );
}

export default FormDatePicker;