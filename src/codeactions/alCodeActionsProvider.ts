import * as vscode from 'vscode';
import { DevToolsExtensionContext } from '../devToolsExtensionContext';
import { AZSymbolKind } from '../symbollibraries/azSymbolKind';
import { ALAddPageFieldsCodeCommand } from './alAddPageFiedsCodeCommand';
import { ALAddQueryFieldsCodeCommand } from './alAddQueryFieldsCodeCommand';
import { ALAddReportFieldsCodeCommand } from './alAddReportFieldsCodeCommand';
import { ALAddXmlPortFieldsCodeCommand } from './addXmlPortFieldsCodeCommand';

export class ALCodeActionsProvider implements vscode.CodeActionProvider {
    protected _toolsExtensionContext : DevToolsExtensionContext;
    protected _addPageFieldsCommand : ALAddPageFieldsCodeCommand;
    protected _addQueryFieldsCommand : ALAddQueryFieldsCodeCommand;
    protected _addReportFieldsCommand: ALAddReportFieldsCodeCommand;
    protected _addXmlPortElementsCommand: ALAddXmlPortFieldsCodeCommand;
    protected _addXmlPortAttributesCommand: ALAddXmlPortFieldsCodeCommand;

    constructor(context : DevToolsExtensionContext) {
        this._toolsExtensionContext = context;
        this._addPageFieldsCommand = new ALAddPageFieldsCodeCommand(this._toolsExtensionContext);
        this._addQueryFieldsCommand = new ALAddQueryFieldsCodeCommand(this._toolsExtensionContext);
        this._addReportFieldsCommand = new ALAddReportFieldsCodeCommand(this._toolsExtensionContext);
        this._addXmlPortElementsCommand = new ALAddXmlPortFieldsCodeCommand(this._toolsExtensionContext, 'fieldelement');
        this._addXmlPortAttributesCommand = new ALAddXmlPortFieldsCodeCommand(this._toolsExtensionContext, 'fieldattribute');
    }

    provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.ProviderResult<(vscode.Command | vscode.CodeAction)[]> {
        if (this._toolsExtensionContext.alLangProxy.version.major < 1)
            return [];

        let actions: vscode.CodeAction[] = [];

        let symbol = this._toolsExtensionContext.activeDocumentSymbols.findSymbolInRange(range);
        if (symbol) {
            //add multiple fields to a page
            if ((symbol.kind == AZSymbolKind.PageGroup) ||                 
                (symbol.kind == AZSymbolKind.PageRepeater) ||
                (symbol.kind == AZSymbolKind.ControlAddChange) ||
                (symbol.kind == AZSymbolKind.PageField)) {                
                let action : vscode.CodeAction = new vscode.CodeAction("Add multiple fields", vscode.CodeActionKind.QuickFix);
                action.command = { command: this._addPageFieldsCommand.name, title: 'Add multiple fields...' };
                actions.push(action);
            }
            //add multiple fields to a query
            if ((symbol.kind == AZSymbolKind.QueryDataItem) ||
                (symbol.kind == AZSymbolKind.QueryColumn)) {
                let action = new vscode.CodeAction("Add multiple fields", vscode.CodeActionKind.QuickFix);
                action.command = { command: this._addQueryFieldsCommand.name, title: 'Add multiple fields...' };
                actions.push(action);
            }
            //add multiple fields to a report
            if ((symbol.kind == AZSymbolKind.ReportDataItem) ||
                (symbol.kind == AZSymbolKind.ReportColumn)) {
                let action = new vscode.CodeAction("Add multiple fields", vscode.CodeActionKind.QuickFix);
                action.command = { command: this._addReportFieldsCommand.name, title: 'Add multiple fields...' };
                actions.push(action);
            }
            //add miltiple fields to an xmlport
            if ((symbol.kind == AZSymbolKind.XmlPortTableElement) ||
                (symbol.kind == AZSymbolKind.XmlPortFieldElement) ||
                (symbol.kind == AZSymbolKind.XmlPortFieldAttribute)) {
                //elements
                let action = new vscode.CodeAction("Add multiple field elements", vscode.CodeActionKind.QuickFix);
                action.command = { command: this._addXmlPortElementsCommand.name, title: 'Add multiple field elements...' };
                actions.push(action);
                //attributes
                action = new vscode.CodeAction("Add multiple field attributes", vscode.CodeActionKind.QuickFix);
                action.command = { command: this._addXmlPortAttributesCommand.name, title: 'Add multiple field attributes...' };
                actions.push(action);

            }
        }
        
        return actions;
    }

}