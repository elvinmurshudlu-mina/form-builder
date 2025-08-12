import s from './style.module.scss'
import { ErrorMessage } from "@hookform/error-message"
import {useFormWrapper} from "../../hooks/useFormWrapper.tsx";
import type {ComponentWrapperDependOnProps, } from "../../type/types.ts";
import {useWatch} from "react-hook-form";
import {useEffect, useMemo} from "react";
interface BaseComponentWrapperProps {
    label:string,
   fieldName:string,
    children:React.ReactNode,
    id:string,
    className?:string
}
type ComponentWrapperProps = BaseComponentWrapperProps & ComponentWrapperDependOnProps

function ComponentWrapper({children,label,fieldName,id,dependOn,isVisible,calculateValue}:ComponentWrapperProps) {
    const {formState:{errors}, setValue, getValues,control} = useFormWrapper(label)
    const depValues = useWatch({
        control,
        name: (dependOn ?? []) ,
    });

    const canRender = useMemo(() => {
        if (!dependOn?.length || !isVisible) return true;
        return isVisible(depValues );
    }, [isVisible, dependOn?.join("|"), JSON.stringify(depValues)]);


    useEffect(() => {
        if (!calculateValue || !dependOn?.length) return;
        const next = calculateValue(depValues);
        const prev = getValues(fieldName);


        if (prev !== next) {
            setValue(fieldName, next, { shouldDirty: true, shouldValidate: true });
        }
    }, [calculateValue, fieldName, setValue, getValues, JSON.stringify(depValues), dependOn?.join("|")]);



    if (!canRender) return null;
    return (
        <div className={s.container}>
            <label htmlFor={id} className={s.label}>{label}</label>
            {children}
           <ErrorMessage render={({message})=><span className={s.error}>{message}</span>}  name={fieldName} errors={errors}></ErrorMessage>
        </div>
    );
}

export default ComponentWrapper;