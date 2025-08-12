export interface FormComponentsProps{
    label: string,
    fieldName: string,
    initialValue?: string,
}
export type ComponentWrapperDependOnProps = { dependOn?: string[]; isVisible?: (values: any[]) => boolean ,calculateValue?: (values: any[]) => any}

export type DependOnProps =
    | { dependOn: string[]; isVisible?: (values: any[]) => boolean ,calculateValue?: (values: any[]) => any}
    | { dependOn?: never; isVisible?: undefined, calculateValue?: never};


export type IFormComponentProps = FormComponentsProps & DependOnProps;

