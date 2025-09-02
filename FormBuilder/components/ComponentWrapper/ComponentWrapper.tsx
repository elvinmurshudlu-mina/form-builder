import s from './style.module.scss'
import {ErrorMessage} from "@hookform/error-message"
import {useFormWrapper} from "../../hooks/useFormWrapper.tsx";
import type {ComponentWrapperDependOnProps,} from "../../type/types.ts";
import {useWatch} from "react-hook-form";
import {useEffect, useMemo} from "react";
import {  ExclamationCircleOutlined} from "@ant-design/icons";

interface BaseComponentWrapperProps {
    label: string,
    fieldName: string,
    children: React.ReactNode,
    id: string,
    className?: string
}

type ComponentWrapperProps = BaseComponentWrapperProps & ComponentWrapperDependOnProps

function ComponentWrapper({
                              children,
                              label,
                              fieldName,
                              id,
                              dependOn,
                              isVisible,
                              calculateValue,
                              className
                          }: ComponentWrapperProps) {
    const {formState: {errors}, setValue, getValues, control} = useFormWrapper(label)
    const depValues = useWatch({
        control,
        name: (dependOn ?? []),
    });

    const canRender = useMemo(() => {
        if (!dependOn?.length || !isVisible) return true;
        return isVisible(depValues);
    }, [isVisible, dependOn?.join("|"), JSON.stringify(depValues)]);


    useEffect(() => {
        if (!calculateValue || !dependOn?.length) return;
        const next = calculateValue(depValues);
        const prev = getValues(fieldName);


        if (prev !== next) {
            setValue(fieldName, next, {shouldDirty: true, shouldValidate: true});
        }
    }, [calculateValue, fieldName, setValue, getValues, JSON.stringify(depValues), dependOn?.join("|")]);


    if (!canRender) return null;
    return (
        <div className={`${s.container} ${className}`}>
            <label htmlFor={id} className={`
      ${s.label}
      block text-sm font-medium
      text-gray-700 dark:text-gray-300
    `}>{label}</label>
            {children}
            <FormError errors={errors} fieldName={fieldName}></FormError>
        </div>
    );
}

export default ComponentWrapper;


export function FormError({fieldName, errors}: { fieldName: string, errors?: Error[] | undefined | any }) {
    return <ErrorMessage
        name={fieldName}
        errors={errors}
        render={({ message }) => (
            <span
                role="alert"
                aria-live="polite"
                className="
        mt-1 inline-flex items-center gap-2
        text-[13px] leading-5 font-medium
        text-[var(--ant-colorError)]
        bg-red-500/10 dark:bg-red-400/10
        backdrop-blur-[2px]
        rounded-lg px-2.5 py-1.5
        ring-1 ring-red-500/20 dark:ring-red-400/20
        shadow-sm
      "
            >
      <ExclamationCircleOutlined className="text-[16px]" />
      <span className="whitespace-pre-line">{message}</span>
    </span>
        )}
    />
}