import './App.css'
import FormWrapper from "./components/FormBuilder/FormWrapper/FormWrapper.tsx";
import FormInput from "./components/FormBuilder/components/FormInput/FormInput.tsx";
import {Button} from "antd";
import * as yup from "yup";
import '@ant-design/v5-patch-for-react-19';
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import FormSelect from "./components/FormBuilder/components/FormSelect/FormSelect.tsx";
import FormDatePicker from "./components/FormBuilder/components/FormDatePicker/FormDatePicker.tsx";
import dayjs from "dayjs";


const schema = yup.object().shape({
    name: yup.string().required(),
    surname: yup.string().required(),
    gender: yup.string().required(),
    birthday: yup.mixed().required(),
})

function App() {
    const form = useForm({
        resolver: yupResolver(schema),
        defaultValues:{
            gender: "male",
            birthday:dayjs("2001-10-23")
        }
    });

    console.log(form.watch());

    return (
        <>
            <FormWrapper form={form} onSubmit={(values) => console.log(values)}>
                <FormInput fieldName={'name'} label={'Name'} initialValue={'Elvin'}></FormInput>
                <FormInput fieldName={'surname'} label={'Surname'}></FormInput>
                <FormSelect  dependOn={['name']}   label={"Select gender"} fieldName={'gender'} options={[
                    {
                        label:'Male',
                        value:'male'
                    },
                    {
                        label:'Female',
                        value:'female'
                    }
                ]}></FormSelect>
                <FormDatePicker  label={'Birthday'} fieldName={'birthday'}></FormDatePicker>
                <Button htmlType={'submit'}>Submit</Button>
            </FormWrapper>
        </>
    )
}

export default App
