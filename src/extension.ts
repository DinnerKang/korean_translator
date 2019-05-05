'use strict';

import {
    window as vswindow,
    commands,
    ExtensionContext,
    Range,
} from 'vscode';
import 'isomorphic-fetch';
var admin = require('firebase-admin');
var serviceAccount = require('../translator-c4119-firebase-adminsdk-ft76z-f94e647a4a.json');
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
    var day = String(date.getDate());
    var hour = String(date.getHours());
    var minutes = String(date.getMinutes());

    if (Number(month) < 10) month = '0' + month;
    if (Number(day) < 10) day = '0' + day;
    if (Number(hour) < 10) hour = '0' + hour;
    if (Number(minutes) < 10) minutes = '0' + minutes;

    // 시간
    var time = year + month + day + hour + minutes;

    let disposable = commands.registerCommand('extension.translateKorean', () => {

        let editor = vswindow.activeTextEditor;

        if (!editor) return vswindow.showInformationMessage('선택된 Text가 없음.');

        const selections = editor.selections[0];

        const selection_range = new Range(selections.start, selections.end);
        const text = editor.document.getText(selection_range);

        const papago_header = {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Naver-Client-Id': 'gBQ1QI8_eElsuFeCu8TC',
            'X-Naver-Client-Secret': 'UPHmuQo2zi'
        };
        const translation_headers = {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Naver-Client-Id': 'qtGsWHRHuDhH5fnL4vv_',
            'X-Naver-Client-Secret': '4CNtCk1s5p'
        };

        // papago 언어감지 API
        async function translator(text: any) {
            console.log('언어 감지할 Text', text);

            let target = 'en';
            try{
                let language = await fetch(`https://openapi.naver.com/v1/papago/detectLangs`,{
                                            method: 'POST',
                                            headers: papago_header,
                                            body: `query=${text}`})
                                            .then(res => res.json());

                if(language.langCode == 'en'){
                    target = 'ko';
                }

                let translate = await fetch(`https://openapi.naver.com/v1/papago/n2mt`, {
                                            method: 'POST',
                                            headers: translation_headers,
                                            body: `source=${language.langCode}&target=${target}&text=${text}`})
                                            .then(res=> res.json());
                
                await editor!.edit((edit: any) => edit.replace(selection_range, String(translate.message.result.translatedText)));
                await successRef.push({
                        'Source': language.langCode,
                        'Text': text,
                        'Translation': translate.message.result.translatedText,
                        'Time': time
                });
            }catch(err){
                errorRef.push({
                    'Text': text,
                    'Error': err,
                    'Time': time
                });
                vswindow.showInformationMessage(err);
            }
        }
        translator(text);
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
}