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
    var day = String(date.getDate());
    var hour = String(date.getHours());
    var minutes = String(date.getMinutes());
    if (Number(month) < 10) month = '0' + month;
    
    if (Number(day) < 10) day = '0' + day;
    
    if (Number(hour) < 10) hour = '0' + hour;

    if (Number(minutes) < 10) minutes = '0' + minutes;
    
    var time = year + month + day + hour + minutes;
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

        // 함수 시작
        papago(text).then(
            function(data: any){
                console.log(data);
                translationText(editor, data.langCode);
            }
        );
        
        var data = new FormData();
        data.append("json", JSON.stringify({'query' : text}));

        // papago API
        function papago(text: any){
            return new Promise( function(resolve, reject){
                const naver_header = {
                    'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Naver-Client-Id' : 'gBQ1QI8_eElsuFeCu8TC',
                    'X-Naver-Client-Secret' : 'UPHmuQo2zi'
                };
                console.log('언어입니다 : ', text);
                
                let language = fetch(`https://openapi.naver.com/v1/papago/detectLangs`, {
                    method : 'POST',
                    headers: naver_header,
                    body : `query=${text}`
                }).then( res=> res.json());
                resolve(language);
            });
        }

        function translationText(editor:any ,langCode: any) {
            let source = langCode;
            let target = 'en';
            let query = text;
            
            const translation_headers = {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Naver-Client-Id' : 'qtGsWHRHuDhH5fnL4vv_',
                    'X-Naver-Client-Secret' : '4CNtCk1s5p'
            };
            if(langCode == 'en'){
                source = 'en';
                target = 'ko';
            }
            
            query = encodeURI(query);
            return fetch(
                `https://openapi.naver.com/v1/papago/n2mt`, {
                    method: 'POST',
                    headers: translation_headers,
                    body : `source=${source}&target=${target}&text=${query}`
                }).then(
                    (res: Response) => {
                        console.log('res-----', res);
                        if (res.status == 200) {
                            console.log('성공');
                            return res.json();
                        }
                    }
                ).then(resJson => {
                    console.log('result', resJson);
                    var data = resJson.message.result;
                    successRef.push({
                        'Source' : source,
                        'Text': text,
                        'Translation': data.translatedText,
                        'Time': time
                    });
                    editor.edit((edit: any) => edit.replace(selection_range, String(data.translatedText)));
                })
                .catch((error: Error) => {
                    console.log('실패', error);
                    errorRef.push({
                        'Text': text,
                        'Source' : source,
                        'Time': time
                    });
                });
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
}