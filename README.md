# Code to Webview

## Usage

```jsonc
// .vscode/settings.json
{
  // Your custom script URL
  "code2webview.scriptURL": "https://example.org/example.js"
}
```

```js
// Your custom script source code

window.addEventListener(
  'message',
  (event) => {
    const { data } = event; // The JSON data what extension sent

    if (root) {
      // example
      const root = document.body.querySelector('#root');
      const pre = document.createElement('pre');
      const code = document.createElement('code');
      code.textContent = JSON.stringify(data, null, 2);
      pre.append(code);
      root.innerHTML = '';
      root.append(pre);
    }
  },
  false
);
```
