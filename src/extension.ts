'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {
    window as vswindow,
    commands,
    ExtensionContext,
    Range,
} from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "hello-world" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = commands.registerCommand('extension.sayHello', () => {
        // The code you place here will be executed every time your command is executed
        const editor = vswindow.activeTextEditor;
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
        vswindow.showQuickPick(['보여줄','리스트', '입니다'], {
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