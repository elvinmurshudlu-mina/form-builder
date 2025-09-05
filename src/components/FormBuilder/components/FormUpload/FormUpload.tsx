import {Button, Upload, type UploadProps} from "antd";
import ComponentWrapper from "../ComponentWrapper/ComponentWrapper";
import {useId, useState,} from "react";
import {Controller,} from "react-hook-form";
import {useFormWrapper} from "../../hooks/useFormWrapper";
import type {IFormComponentProps} from "../../type/types";
import {DeleteOutlined, FileOutlined, UploadOutlined} from "@ant-design/icons";
import {createFolder,} from "../../../../core/utils/Utils.ts";
import type {RcFile} from "antd/es/upload";
import {api_urls} from "../../../../core/api/urls.ts";
import {axiosClient} from "../../../../core/api/interceptor.ts";

interface BaseFormInputProps extends UploadProps {
    className?: string;
    extraProperties?: Record<string, any>;
}

export type FormUploadProps = BaseFormInputProps & IFormComponentProps;

type ServerFile = {
    folderName: string;
    fileName: string;
    name?: string;
    isMain?: boolean;
};

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


    const {control,} = useFormWrapper();
    const id = useId();

    // const customUploadRequest = async ({onSuccess, file}: UploadRequestOption<any>) => {
    //     let folder = folderName
    //     const f = file as RcFile;
    //     if (!folder) {
    //         const new_folder_name = await createFolder()
    //         setFolderName(new_folder_name)
    //         folder = new_folder_name
    //     }
    //     const uploaded_file = await uploadFile(f, folder)
    //
    //     if (onSuccess) onSuccess({...uploaded_file, ...extraProperties})
    //
    // };

    const customUploadRequest: UploadProps['customRequest'] = async ({
                                                                         file, onSuccess, onError, onProgress
                                                                     }) => {
        try {
            const f = file as RcFile
            let folder = folderName
            if (!folder) {
                const new_folder_name = await createFolder()
                setFolderName(new_folder_name)
                folder = new_folder_name
            }
            const formData = new FormData();
            formData.append('file', file as RcFile);
            formData.append('FolderName', folder || '')

            const data = await axiosClient.post<ServerFile>(api_urls.uploadFile, formData, {
                onUploadProgress: (e) => {
                    const percent = e.total ? Math.round((e.loaded / e.total) * 100) : 0;
                    onProgress?.({percent});
                },
            });

            // console.log('Server data',data)
            onSuccess?.({folderName: folder, fileName: data, name: f.name, ...extraProperties});
        } catch (err) {
            onError?.(err as any);
        }
    };


    return (
        <ComponentWrapper dependOn={dependOn} calculateValue={calculateValue} isVisible={isVisible}
                          className={className} label={label} fieldName={fieldName} id={id}>
            <Controller
                control={control}
                name={fieldName}
                defaultValue={[]} // boş array — Upload controlled işləsin
                render={({field}) => {
                    const fileList = (field.value ?? []) as ServerFile[];
                    return (
                        <div>
                            <Upload
                                {...inputProps}
                                showUploadList={false}
                                customRequest={customUploadRequest}
                                // defaultFileList YOX — controlled işlədiyimiz üçün **yalnız** fileList veririk
                                onChange={({file}) => {
                                    if (file && file.status == 'done') field.onChange([...fileList, file.response]);
                                }}
                            >
                                <Button icon={<UploadOutlined/>}>Yüklə</Button>
                            </Upload>
                            <FileList onDelete={(fileName) => {
                                field.onChange(fileList.filter(f => f.fileName != fileName))
                            }} fileList={fileList}/>
                        </div>
                    );
                }}
            />
        </ComponentWrapper>
    );
}


export default FormUpload;

function FileList({fileList, onDelete}: { fileList: ServerFile[], onDelete: (fileName: string) => void }) {
    return <div className="
  rounded-xl
  bg-white/50 dark:bg-slate-900/35
  backdrop-blur-2xl ring-1 ring-white/25
  shadow-[0_6px_18px_rgba(2,6,23,0.08)]
">
        <div className="divide-y divide-white/20">
            {fileList?.length ? fileList.map((f, i) => {
                const name = f?.name ?? "Fayl";

                return (
                    <div
                        key={(f as any)?.uid ?? name ?? i}
                        className="group flex items-center justify-between gap-3 p-1"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            {/* sol ikon kapsulu */}
                            <span className="inline-flex size-8 items-center justify-center rounded-md
                             bg-[#486e9b]/15 text-[#486e9b]">
              <FileOutlined className="text-[14px]"/>
            </span>

                            <span className="truncate text-sm font-medium text-slate-900 dark:text-slate-100"
                                  title={name}>
              {name}
            </span>
                        </div>

                        {/* sil düyməsi */}
                        <button
                            onClick={() => onDelete(f.fileName)}
                            type="button"
                            // istəsən buraya onClick={() => onDelete?.(f, i)} qoşa bilərsən
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full
                       text-slate-500 hover:text-red-600 hover:bg-red-50
                       focus:outline-none focus:ring-2 focus:ring-red-400/40"
                            aria-label="Sil"
                            title="Sil"
                        >
                            <DeleteOutlined/>
                        </button>
                    </div>
                );
            }) : null}
        </div>
    </div>
}