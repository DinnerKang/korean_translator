'use strict';

import {
    window as vswindow,
    commands,
    ExtensionContext,
    Range,
} from 'vscode';
import { Translator } from "./translator";
import 'isomorphic-fetch';


import { Observable } from "rxjs/Observable";
import { pipe } from "rxjs/Rx";
import { from } from "rxjs/observable/from";
import { filter, map, mergeMap, retry, window } from "rxjs/operators";

export interface resultT {
    source: string;
    target: string;
    text: string;
}

export function activate(context: ExtensionContext) {


    let disposable = commands.registerCommand('extension.translateKorean', () => {

        const editor = vswindow.activeTextEditor;
        const translator = new Translator();
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
        vswindow.showQuickPick(translator.getText(text), {
            matchOnDescription: true,
            placeHolder: '원하는 단어를 선택하세요 !!'
        }).then(
            () => {
                console.log('변경완료 (라고 만들고 싶...)');
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
                ).then( resJson => {
                    console.log(resJson);
                })
                .catch(err => console.log(err));
        }
        testCode();
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}