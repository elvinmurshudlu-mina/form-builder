import {FormProvider} from "../FormWrapper/FormProvider.tsx";
import {use} from "react";

export function useFormWrapper(name?:string){
    const form = use(FormProvider)
    if(!form)throw new Error(`Component ${name}: FormWrapper daxilində olmalıdır!`)
    return form.form
}