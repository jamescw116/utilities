"use client"

import { useEffect, useState } from "react";
import Input, { TInputValue } from "../Components/Input";
import Loading from "../Components/Loading";

type TValueTmp = { v1?: string, v2?: string };

const Translate: React.FC = () => {
    const v1Lang = "en-US";
    const [value1, setValue1] = useState<string>("");
    const v2Lang = "zh-TW";
    const [value2, setValue2] = useState<string>("");

    const [valueTmp, setValueTmp] = useState<TValueTmp | undefined>(undefined);
    const [isFetch, setIsFetch] = useState<boolean>(false);

    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    const fnTranslate = async (text: string, lang: string): Promise<string> => {
        let result: Array<string> = [];

        try {
            const gResp = await fetch(
                `https://translation.googleapis.com/language/translate/v2?key=${process.env.NEXT_PUBLIC_GCP_CLOUDTRANSLATE}`
                , {
                    method: "POST"
                    , headers: { 'Content-Type': 'application/json' }
                    , body: JSON.stringify({
                        q: text
                        , target: lang
                    })
                }
            );

            const gRespJson = await gResp.json();
            const gRespData = gRespJson.data.translations;
            const gRespDataArr = Array.isArray(gRespData) ? gRespData : [gRespData];

            result = gRespDataArr.map((data: { translatedText: string }) => (
                data.translatedText
            ));
        }
        catch (error: unknown) {
            console.log(error);
        }

        return result.join(", ");
    }

    const fnUpd = async (param: { v1?: string, v2?: string }) => {
        if (timer) {
            clearTimeout(timer);
        }

        if (param.v1) {
            setValue1(param.v1);
            setValue2("");
        }
        else if (param.v2) {
            setValue2(param.v2);
            setValue1("");
        }

        setValueTmp(param);

        setTimer(setTimeout(() => { setIsFetch(true); }, 3000));
    }

    useEffect(() => {
        if (isFetch) {
            if (valueTmp?.v1) {
                fnTranslate(valueTmp.v1, v2Lang)
                    .then((v2: string) => { setValue2(v2); });
            }
            else if (valueTmp?.v2) {
                fnTranslate(valueTmp.v2, v1Lang)
                    .then((v1: string) => { setValue1(v1) });
            }

            setValueTmp(undefined);
            setIsFetch(false);
        }
    }, [isFetch]);

    return (
        <div className="flex flex-col gap-4 p-2">
            <div className="flex flex-row">
                <div>
                    <span className="text-sm text-nowrap uppercase bg-sky-500 text-white p-1 rounded-md m-1">{v1Lang.slice(0, 2)}</span>
                </div>
                <Input classNames={["border-b-2", "px-2", "w-full"]} value={value1} fnOnChange={(v: TInputValue) => fnUpd({ v1: v.toString() })} />
                <Loading isLoading={timer !== undefined && valueTmp?.v2 !== undefined} />
            </div>
            <div className="flex flex-row">
                <div>
                    <span className="text-sm text-nowrap uppercase bg-sky-500 text-white p-1 rounded-md m-1">{v2Lang.slice(0, 2)}</span>
                </div>
                <Input classNames={["border-b-2", "px-2", "w-full"]} value={value2} fnOnChange={(v: TInputValue) => fnUpd({ v2: v.toString() })} />
                <Loading isLoading={timer !== undefined && valueTmp?.v1 !== undefined} />
            </div>
        </div>
    )
};


export default Translate;