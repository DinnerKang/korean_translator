'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
require("isomorphic-fetch");
var admin = require('firebase-admin');
var serviceAccount = require('../translator-c4119-firebase-adminsdk-ft76z-f94e647a4a');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://translator-c4119.firebaseio.com",
});
var db = admin.database();
var ref = db.ref('translate');
var successRef = ref.child('success');
var errorRef = ref.child('error');
function activate(context) {
    var date = new Date();
    var year = String(date.getFullYear());
    var month = String(date.getMonth() + 1);
    if (Number(month) < 10) month = '0' + month;
    
    var day = String(date.getDate());
    if (Number(day) < 10) day = '0' + day;
    
    var hour = String(date.getHours());
    if (Number(hour) < 10) {
        hour = '0' + hour;
    }
    var minutes = String(date.getMinutes());
    if (Number(minutes) < 10) {
        minutes = '0' + minutes;
    }
    var time = year + month + day + hour + minutes;
    let disposable = vscode_1.commands.registerCommand('extension.translateKorean', () => {
        const editor = vscode_1.window.activeTextEditor;
        console.log('vscode의 글씨들', editor);
        if (!editor) {
            return;
        }
        const selections = editor.selections[0];
        console.log('select 된거 정보', selections);
        const selection_range = new vscode_1.Range(selections.start, selections.end);
        const text = editor.document.getText(selection_range);
        if (!text) {
            console.log('text 선택좀...');
        }
        console.log('text:', text);
        // 함수 시작
        papago(text).then(function (data) {
            console.log(data);
            translationText(editor, data.langCode);
        });
        var data = new FormData();
        data.append("json", JSON.stringify({ 'query': text }));
        // papago API
        function papago(text) {
            return new Promise(function (resolve, reject) {
                const naver_header = {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Naver-Client-Id': 'gBQ1QI8_eElsuFeCu8TC',
                    'X-Naver-Client-Secret': 'UPHmuQo2zi'
                };
                console.log('언어입니다 : ', text);
                let language = fetch(`https://openapi.naver.com/v1/papago/detectLangs`, {
                    method: 'POST',
                    headers: naver_header,
                    body: `query=${text}`
                }).then(res => res.json());
                resolve(language);
            });
        }
        function translationText(editor, langCode) {
            let source = langCode;
            let target = 'en';
            let query = text;
            const translation_headers = {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Naver-Client-Id': 'qtGsWHRHuDhH5fnL4vv_',
                'X-Naver-Client-Secret': '4CNtCk1s5p'
            };
            if (langCode == 'en') {
                source = 'en';
                target = 'ko';
            }
            query = encodeURI(query);
            return fetch(`https://openapi.naver.com/v1/papago/n2mt`, {
                method: 'POST',
                headers: translation_headers,
                body: `source=${source}&target=${target}&text=${query}`
            }).then((res) => {
                console.log('res-----', res);
                if (res.status == 200) {
                    console.log('성공');
                    return res.json();
                }
            }).then(resJson => {
                console.log('result', resJson);
                var data = resJson.message.result;
                successRef.push({
                    'Source': source,
                    'Text': text,
                    'Translation': data.translatedText,
                    'Time': time
                });
                editor.edit((edit) => edit.replace(selection_range, String(data.translatedText)));
            })
                .catch((error) => {
                console.log('실패', error);
                errorRef.push({
                    'Text': text,
                    'Source': source,
                    'Time': time
                });
            });
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map