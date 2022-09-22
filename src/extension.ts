// eslint-disable-next-line import/no-nodejs-modules
import * as vscode from 'vscode';

function html([string]: TemplateStringsArray) {
  return string;
}

const template = html`<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      <title>Code to Webview</title>
      <!-- style -->
      <!-- script -->
    </head>
    <body>
      <div id="root"></div>
    </body>
  </html>`;

function getTemplate({
  styleURL,
  scriptURL,
}: {
  styleURL: string;
  scriptURL: string;
}): string {
  const io = styleURL
    ? template.replace(
        '<!-- style -->',
        `<link rel="stylesheet" href="${styleURL}" type="text/css">`,
      )
    : template;

  return scriptURL
    ? io.replace(
        '<!-- script -->',
        `<script defer src="${scriptURL}"></script>`,
      )
    : template;
}

export function activate(context: vscode.ExtensionContext) {
  let currentPanel: vscode.WebviewPanel | undefined;

  function updatePanel(activeEditor = vscode.window.activeTextEditor) {
    if (activeEditor) {
      const uri = activeEditor?.document?.uri;

      const source = activeEditor.document.getText();

      if (currentPanel && (uri || source)) {
        currentPanel.webview.postMessage({
          code2webview: true,
          uri,
          source,
        });
      }
    }
  }

  function code2webview() {
    if (currentPanel) {
      currentPanel.reveal(vscode.ViewColumn.Two);

      updatePanel();
    } else {
      currentPanel = vscode.window.createWebviewPanel(
        'code2webview',
        'Code to Webview',
        vscode.ViewColumn.Two,
        { enableScripts: true, enableFindWidget: true },
      );

      const { scriptURL, styleURL } =
        vscode.workspace.getConfiguration('code2webview');
      currentPanel.webview.html = getTemplate({ styleURL, scriptURL });

      updatePanel();

      currentPanel.onDidDispose(
        () => {
          currentPanel = undefined;
        },
        null,
        context.subscriptions,
      );

      currentPanel.onDidChangeViewState(
        () => {
          updatePanel();
        },
        null,
        context.subscriptions,
      );
    }
  }

  const webviewCommand = vscode.commands.registerCommand(
    'code2webview.open',
    code2webview,
  );

  context.subscriptions.push(webviewCommand);
}
