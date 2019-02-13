'use strict';

import {
    window as vswindow,
    commands,
    ExtensionContext,
    Range,
} from 'vscode';
import 'isomorphic-fetch';
var admin = require('firebase-admin');
var serviceAccount = require('../translator-c4119-firebase-adminsdk-ft76z-126df85c6a');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://translator-c4119.firebaseio.com",
});
var db = admin.database();
var ref = db.ref('translate');
var successRef = ref.child('success');
var errorRef = ref.child('error');


export function activate(context: ExtensionContext) {
    var date = new Date();

    var year = String(date.getFullYear());
    var month = String(date.getMonth() + 1);
    if (Number(month) < 10) {
        month = '0' + month;
    }
    var day = String(date.getDate());
    if (Number(day) < 10) {
        day = '0' + day;
    }
    var hour = String(date.getHours());
    if (Number(hour) < 10) {
        hour = '0' + hour;
    }

    var minutes = String(date.getMinutes());
    if (Number(minutes) < 10) {
        minutes = '0' + minutes;
    }
    var time = year + month + day + hour + minutes;
    console.log(time);

    let disposable = commands.registerCommand('extension.translateKorean', () => {

        const editor = vswindow.activeTextEditor;
        console.log('vscode의 글씨들', editor);
        if (!editor) {
            return;
        }
        const selections = editor.selections[0];

        console.log('select 된거 정보', selections);
        const selection_range = new Range(selections.start, selections.end);
        const text = editor.document.getText(selection_range);
        if (!text) {
            console.log('text 선택좀...');
        }
        console.log('text:', text);

        translationText(editor);

        function translationText(editor: any) {
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
                        }
                        if(res.status == 400){
                            errorRef.push({
                                'Error': text,
                                'Time': time
                            });
                            vswindow.showInformationMessage('단어에 특수문자가 들어갔습니다.');
                        }
                    }
                ).then(resJson => {
                    console.log(resJson);
                    if (resJson.translated_text[0] == '') {
                        console.log('번역 불가');
                        resJson.translated_text[0] = ['번역이 불가능합니다 ㅠ'];
                    }
                    console.log(resJson.translated_text[0][0]);
                    successRef.push({
                        Korean: text,
                        English: resJson.translated_text[0][0],
                        Time: time
                    });
                    editor.edit((edit: any) => edit.replace(selection_range, String(resJson.translated_text[0])));

                    return resJson.translated_text[0];
                })
                .catch((error: Error) => {
                    console.log('실패', error);
                });
        }

    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
}