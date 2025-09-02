import {type FieldValue, type UseFormReturn,} from "react-hook-form";
import {FormProvider} from "./FormProvider.tsx";
import type {ReactNode} from "react";

interface FormWrapperProps {
    children: ReactNode;
    form:UseFormReturn<FieldValue<any>>,
    onSubmit:(values: any,) => unknown,
    className?: string,
}
function FormWrapper({children,form,onSubmit,className}: FormWrapperProps) {
    return (
       <FormProvider value={{form}}>
           <form className={className} onSubmit={form.handleSubmit(onSubmit)}>
               {children}
           </form>
       </FormProvider>
    );
}
export default FormWrapper;