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


        translationText(editor);


        function translationText(editor: any) {
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
                        if (res.status == 200) {
                            console.log('성공');
                            return res.json();
                        } else if (res.status == 503) {
                            console.log('실패');
                            vswindow.showInformationMessage('카카오에 문제가 있습니다.');
                        } 
                    }
                ).then(resJson => {
                    console.log(resJson);
                    if (resJson.translated_text[0] == '') {
                        console.log('번역 불가');
                        resJson.translated_text[0] = ['번역이 불가능합니다 ㅠ'];
                    }
                    console.log(resJson.translated_text[0]);

                    editor.edit((edit: any) => edit.replace(selection_range, String(resJson.translated_text[0])));

                    return resJson.translated_text[0];
                })
                .catch(err => {
                    if(err.code === -10){
                        vswindow.showInformationMessage('API 허용량 초과입니다.');
                    }
                    
                });
        }

    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
}