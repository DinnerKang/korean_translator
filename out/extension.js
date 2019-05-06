'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
require("isomorphic-fetch");
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
function activate(context) {
    let disposable = vscode_1.commands.registerCommand('extension.translateKorean', () => {
        function getNowTime() {
            const date = new Date();
            let year = String(date.getFullYear());
            let month = String(date.getMonth() + 1);
            let day = String(date.getDate());
            let hour = String(date.getHours());
            let minutes = String(date.getMinutes());
            if (Number(month) < 10)
                month = '0' + month;
            if (Number(day) < 10)
                day = '0' + day;
            if (Number(hour) < 10)
                hour = '0' + hour;
            if (Number(minutes) < 10)
                minutes = '0' + minutes;
            const nowTime = year + month + day + hour + minutes;
            return nowTime;
        }
        let editor = vscode_1.window.activeTextEditor;
        if (!editor)
            return vscode_1.window.showInformationMessage('선택된 Text가 없음.');
        const selections = editor.selections[0];
        const selectionRange = new vscode_1.Range(selections.start, selections.end);
        const text = editor.document.getText(selectionRange);
        // papago 언어감지 API
        function translateWords(text) {
            return __awaiter(this, void 0, void 0, function* () {
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
                try {
                    const language = yield fetch(`https://openapi.naver.com/v1/papago/detectLangs`, {
                        method: 'POST',
                        headers: papagoHeader,
                        body: `query=${text}`
                    });
                    const languageResult = yield language.json();
                    if (languageResult.langCode === 'en')
                        target = 'ko';
                    const translate = yield fetch(`https://openapi.naver.com/v1/papago/n2mt`, {
                        method: 'POST',
                        headers: translationHeaders,
                        body: `source=${languageResult.langCode}&target=${target}&text=${text}`
                    });
                    const translateResult = yield translate.json();
                    yield editor.edit((edited) => edited.replace(selectionRange, String(translateResult.message.result.translatedText)));
                    yield successRef.push({
                        'Source': languageResult.langCode,
                        'Text': text,
                        'Translation': translateResult.message.result.translatedText,
                        'Time': getNowTime()
                    });
                }
                catch (err) {
                    errorRef.push({
                        'Text': text,
                        'Error': err,
                        'Time': getNowTime()
                    });
                    vscode_1.window.showInformationMessage(err);
                }
            });
        }
        translateWords(text);
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map