# Selectoplasm

Selectoplasm is a CSS design experience made for developers. It runs as a dev dependency in your project and allows you to style your app in runtime, in the browser. It provides the following features:

- realtime, instant feedback - quickly observe and iterate through changes before committing them to your stylesheet
- emmett-inspired syntax to quickly set up and style components
- use your preferred set of utility classes during the design process, but ship without them.
- keep your CSS entirely separate from your application's html and javascript
- create reusable components with default settings that can be customised in any app you drop them in
- BYO design system or generate one dynamically with a powerful plugin system
- create your own **zero-build** plugins using plain html, css and javascript
- an unbelievably simple developer experience from beginning to end

## Installation

***NOTE**: selectoplasm is currently only available for Vite-based projects.*

### Vite-based projects

Install **selectoplasm** with `npm install save-dev selectoplasm` or the equivalent command for your package manager.

Edit your `vite.config.js` with the following:

```js
// existing imports
import { selectoplasm, servePlugins } from 'selectoplasm/vite'

export default defineConfig({
  /* existing config */
  plugins: [/* existing plugins */, selectoplasm(), servePlugins()],
  /* existing config */
})
```

That's it! Selectoplasm should now attach itself to your project's DOM in dev mode, providing a complete css design experience for your app.

## User Guide

### Quickstart

First, run your app using `npm run dev` or equivalent. Once your page loads, you can press the `backtick/tilde` key to make selectoplasm visible. You should see a row of buttons appear.

You can use the following key bindings:

`e`: will activate the Elements Context Menu. This lets you quickly target an element and create a component (a CSS ruleset) for that element.
`c`: Toggles the Component Library window on and off.
`s`: Toggles the Stylesheet Library window on and off.
`p`: Toggles the Plugin Manager window on and off.

### How Selectoplasm Works

Very basically, selectoplasm uses plugins to generate stylesheets, which you then interact with using the Component Builder.

The Component Builder has an input called the Combo Input, which allows you to type an emmet-inspired syntax to quickly add declarations and rulesets to your component.

## License

© 2025 Jim Bridger. All rights reserved.

This software is provided with restricted rights and no formal open source license. The following terms apply:

### Permitted
- You may use the compiled application as a development dependency in your personal or commercial projects
- The code and files you create using this tool belong to you

### Prohibited
- You may not include this software as a production dependency
- You may not redistribute, copy, or share the source code
- You may not modify the source code or create derivative works
- You may not reverse engineer the compiled application
- You may not sublicense, sell, or distribute the software in either source or compiled form
