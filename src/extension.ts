'use strict';

import {
    window as vswindow,
    commands,
    ExtensionContext,
    Range,
} from 'vscode';
import 'isomorphic-fetch';


export function activate(context: ExtensionContext) {


    let disposable = commands.registerCommand('extension.translateKorean', () => {

        const editor = vswindow.activeTextEditor;
        console.log('vscode의 글씨들', editor);
        if (!editor) {
            return;
        }
        const selections = editor.selections[0];

        console.log('select 된거 정보', selections);
        const selection_range = new Range(selections.start, selections.end);
        console.log('select 된 라인 정보', selection_range);

        const text = editor.document.getText(selection_range);
        if (!text) {
            console.log('text 선택좀...');
        }
        console.log('text:', text);
        vswindow.showQuickPick(testCode(), {
            matchOnDescription: true,
            placeHolder: '원하는 단어를 선택하세요 !!'
        }).then(
            transText => {
                console.log('transText', transText);
                editor.edit(edit => edit.replace(selection_range, String(transText)));
            }
        );


        function testCode() {
            console.log('-------testCode--------');

            const src_lang = 'kr';
            const target_lang = 'en';
            let query = text;
            const headers = {
                'Authorization': 'KakaoAK 445700b780464ae5f43084791c7d6ca2',
                'Content-Type': 'application/json;charset=utf-8',
            };
            query = encodeURI(query);
            return fetch(
                `https://kapi.kakao.com/v1/translation/translate?src_lang=${src_lang}&target_lang=${target_lang}&query=${query}`, {
                    method: 'GET',
                    headers: headers
                }).then(
                    (res: Response) => {
                        console.log('res-----', res);
                        return res.json();
                    }
                ).then(resJson => {
                    console.log(resJson);
                    return resJson.translated_text[0];
                })
                .catch(err => console.log(err));
        }
        // testCode();
        console.log(testCode());
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}