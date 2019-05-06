'use strict';

import {
    window as vswindow, TextEditorEdit,
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
    let disposable = commands.registerCommand('extension.translateKorean', () => {
        
        function getNowTime(){
            const date = new Date();

            let year = String(date.getFullYear());
            let month = String(date.getMonth() + 1);
            let day = String(date.getDate());
            let hour = String(date.getHours());
            let minutes = String(date.getMinutes());

            if (Number(month) < 10) month = '0' + month;
            if (Number(day) < 10) day = '0' + day;
            if (Number(hour) < 10) hour = '0' + hour;
            if (Number(minutes) < 10) minutes = '0' + minutes;
            const nowTime = year + month + day + hour + minutes;

            return nowTime;
        }

        let editor = vswindow.activeTextEditor;
        if (!editor) return vswindow.showInformationMessage('선택된 Text가 없음.');
        const selections = editor.selections[0];
        const selectionRange = new Range(selections.start, selections.end);
        const text = editor.document.getText(selectionRange);

        
        // papago 언어감지 API
        async function translateWords(text: String) {
            console.log('언어 감지할 Text', text);

            const papagoHeader = {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Naver-Client-Id': 'gBQ1QI8_eElsuFeCu8TC',
                'X-Naver-Client-Secret': 'UPHmuQo2zi'
            };
            const translationHeaders = {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Naver-Client-Id': 'qtGsWHRHuDhH5fnL4vv_',
                'X-Naver-Client-Secret': '4CNtCk1s5p'
            };

            let target = 'en';
            try{
                const language = await fetch(`https://openapi.naver.com/v1/papago/detectLangs`,{
                                            method: 'POST',
                                            headers: papagoHeader,
                                            body: `query=${text}`});
                const languageResult = await language.json();

                if(languageResult.langCode === 'en') target = 'ko';
                
                const translate = await fetch(`https://openapi.naver.com/v1/papago/n2mt`, {
                                            method: 'POST',
                                            headers: translationHeaders,
                                            body: `source=${languageResult.langCode}&target=${target}&text=${text}`});
                const translateResult = await translate.json();

                await editor!.edit((edited: TextEditorEdit) => 
                    edited.replace(selectionRange, String(translateResult.message.result.translatedText)));

                await successRef.push({
                        'Source': languageResult.langCode,
                        'Text': text,
                        'Translation': translateResult.message.result.translatedText,
                        'Time': getNowTime()
                });
            }catch(err){
                errorRef.push({
                    'Text': text,
                    'Error': err,
                    'Time': getNowTime()
                });
                vswindow.showInformationMessage(err);
            }
        }
        translateWords(text);
    });
    context.subscriptions.push(disposable);
}

export function deactivate() {
}