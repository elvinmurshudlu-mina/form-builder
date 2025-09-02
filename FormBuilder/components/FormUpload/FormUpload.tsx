import {Button, Upload, type UploadProps} from "antd";
import ComponentWrapper from "../ComponentWrapper/ComponentWrapper";
import {useId, useState,} from "react";
import {Controller,} from "react-hook-form";
import {useFormWrapper} from "../../hooks/useFormWrapper";
import type {IFormComponentProps} from "../../type/types";
import {UploadOutlined} from "@ant-design/icons";
import {type UploadRequestOption} from 'rc-upload/lib/interface';
import {createFolder, uploadFile} from "../../../../core/utils/Utils.ts";
import type {RcFile} from "antd/es/upload";

interface BaseFormInputProps extends UploadProps {
    className?: string;
    extraProperties?: Record<string, any>;
}

export type FormUploadProps = BaseFormInputProps & IFormComponentProps;


function FormUpload({
                        label,
                        fieldName,
                        className,
                        dependOn,
                        isVisible,
                        calculateValue,
                        extraProperties = {},
                        ...inputProps
                    }: FormUploadProps) {

    const [folderName, setFolderName] = useState<string | null>(null);


    const {control} = useFormWrapper();
    const id = useId();

    const customUploadRequest = async ({onSuccess, file}: UploadRequestOption<any>) => {
        let folder = folderName
        const f = file as RcFile;

        console.log(f,'FILE+>')
        if (!folder) {
            const new_folder_name = await createFolder()
            setFolderName(new_folder_name)
            folder = new_folder_name
        }

        const uploaded_file = await uploadFile(f, folder)

        if (onSuccess) onSuccess({...uploaded_file, ...extraProperties})

    };


    return (
        <ComponentWrapper dependOn={dependOn} calculateValue={calculateValue} isVisible={isVisible}
                          className={className} label={label} fieldName={fieldName} id={id}>
            <Controller
                control={control}
                name={fieldName}
                render={({field}) =>
                    <Upload customRequest={customUploadRequest}
                            id={id}  {...inputProps}
                            defaultFileList={field.value}
                            onChange={(info) => {
                                const {file} = info;
                                if (file.status === 'done' && file.response) {
                                    field.onChange([...(field.value || []), file.response]);     // birbaşa response-u yaz
                                } else if (file.status === 'removed') {
                                    field.onChange(field.value.filter((f: any) => f.fileName != file.response.fileName));              // silinibsə, formdan təmizlə
                                }
                            }}


                    ><Button icon={<UploadOutlined/>}>Upload</Button></Upload>}/>
        </ComponentWrapper>
    );
}


export default FormUpload;