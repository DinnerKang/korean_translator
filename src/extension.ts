'use strict';

import {
    window as vswindow, TextEditorEdit,
    commands,
    ExtensionContext,
    Range,
} from 'vscode';
import 'isomorphic-fetch';
import * as admin from 'firebase-admin';
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

            if (Number(month) < 10) {month = '0' + month;}
            if (Number(day) < 10) {day = '0' + day;}
            if (Number(hour) < 10) {hour = '0' + hour;}
            if (Number(minutes) < 10) {minutes = '0' + minutes;}
            const nowTime = year + month + day + hour + minutes;

            return nowTime;
        }
        

        let editor = vswindow.activeTextEditor;
        if (!editor) {return vswindow.showInformationMessage('선택된 Text가 없음.');}
        const selections = editor.selections[0];
        const selectionRange = new Range(selections.start, selections.end);
        const text = editor.document.getText(selectionRange);
        if(!/"/.exec(text)){
            abuseCheck(text);
        }else{
            vswindow.showInformationMessage('금지 문자가 포함되었습니다.');
        }
        
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

                if(languageResult.langCode === 'en') {target = 'ko';}
                
                const translate = await fetch(`https://openapi.naver.com/v1/papago/n2mt`, {
                                            method: 'POST',
                                            headers: translationHeaders,
                                            body: `source=${languageResult.langCode}&target=${target}&text=${text}`});
                const translateResult = await translate.json();

                if(translateResult.errorMessage){
                    vswindow.showInformationMessage(translateResult.errorMessage);
                    throw errorRef.push({
                        'Text': text,
                        'Error': translateResult.errorMessage,
                        'Time': getNowTime()
                    });
                }
                
                editor!.edit((edited: TextEditorEdit) => 
                    edited.replace(selectionRange, String(translateResult.message.result.translatedText)));

                successRef.push({
                        'Source': languageResult.langCode,
                        'Text': text,
                        'Translation': translateResult.message.result.translatedText,
                        'Time': getNowTime()
                });
                return;
            }catch(e){
                errorRef.push({
                    'Text': text,
                    'Error': e,
                    'Time': getNowTime()
                });
                vswindow.showInformationMessage(e);
            }
        }
        // 어뷰징 감지
        function abuseCheck(text: string){
            try{
                let check = true;
                db.ref("translate/success").on("value", function (snapshot: admin.database.DataSnapshot | null ){
                    if(snapshot && check) {
                        const data = Object.values(snapshot.val());
                        const search:any = data.filter(function(data:any){ return data.Time===getNowTime();});
                        if(search.length !==0){
                            for(var i=0, search_len=search.length; i<search_len; i++){
                                if(search[i].Text === text){
                                    vswindow.showInformationMessage('Abuse Checking');
                                    throw new Error();
                                }
                                if(i===(search_len-1)){
                                    translateWords(text);
                                }
                            }
                        }else{
                            translateWords(text);
                        }
                        check = false;
                    }
                });
            }catch(e){
                console.log(e);
            }
        }
        
    });
    context.subscriptions.push(disposable);
}

export function deactivate() {
}