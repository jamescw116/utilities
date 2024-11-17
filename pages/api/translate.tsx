"use server"

import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const { text, lang } = req.body;

        try {
            const gResp = await fetch(
                `https://translation.googleapis.com/language/translate/v2?key=${process.env.NEXT_PUBLIC_GCP_CloudTranslate}`
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

            res.status(200).json(gRespDataArr.map((data: { translatedText: string }) => (
                data.translatedText
            )));
        }
        catch (error: unknown) {
            console.log(error);
            res.status(500).json({ message: 'Error translating text' });
        }
    }
}
// Apple
// Orange
export default handler;