'use strict';

import {
    window as vswindow,
    commands,
    ExtensionContext,
    Range,
} from 'vscode';
import { Translator } from './translator';

export function activate(context: ExtensionContext) {

    console.log('Congratulations, your extension "hello-world" is now active!');

    let disposable = commands.registerCommand('extension.translateKorean', () => {

        const editor = vswindow.activeTextEditor;
        const translator = new Translator();
        console.log('vscode의 글씨들',editor);
        if (!editor) {
            return;
        }
        const selections = editor.selections[0];
        
        console.log('select 된거 정보', selections);
        const selection_range = new Range(selections.start, selections.end);
        console.log('select 된 라인 정보',selection_range);

        const text = editor.document.getText(selection_range);
        if(!text){
            console.log('text 선택좀...');
        }
        console.log('text:', text);
        vswindow.showQuickPick(translator.getText(text), {
            matchOnDescription: true,
            placeHolder: '원하는 단어를 선택하세요 !!'
        }).then(
            ()=>{
                console.log('변경완료 (라고 만들고 싶...)');
            }
        );

    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}