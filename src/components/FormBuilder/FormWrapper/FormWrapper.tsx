import {type FieldValue, type UseFormReturn,} from "react-hook-form";
import {FormProvider} from "./FormProvider.tsx";
import type {ReactNode} from "react";


interface FormWrapperProps {
    children: ReactNode;
    form:UseFormReturn<FieldValue<any>>,
    onSubmit:(values: any,) => unknown
}

function FormWrapper({children,form,onSubmit,}: FormWrapperProps) {

    return (
       <FormProvider value={{form}}>
           <form onSubmit={form.handleSubmit(onSubmit)}>
               {children}
           </form>
       </FormProvider>
    );
}

export default FormWrapper;