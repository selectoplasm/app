# Changelog

## [0.0.1-alpha.8] - 2025-04-07

- added bun support
- simplified plugin rulesets
- changed shadow-root div to selectoplasm-div
- updated fonts
- added stylesheet context for declaration components
- removed sharedScripts
- added staticCss to plugins
- moved previewCss to local style tag in plugin previewCss

## [0.0.1-alpha.7] - 2025-03-29

- fixed color preview related bug
- updated ui fonts
- updated Plugin Manager to use simplified rulesets

## [0.0.1-alpha.6] - 2025-03-28

- fixed scroll menu hover in Chrome
- removed rootElement
- utility classes can now handle multiple declarations
- added Style Observer (not Lea Verou's one, mine is way crappier)
- added Stylesheet Viewer
- removed scoped styles from all libraries
- selector-builder fixes
- added file save endpoint
- combined vite plugins into a single plugin

## [0.0.1-alpha.5] 2025-03-06

- Fixed inherited styles bleeding into shadow DOM with `:host { all: initial !important; }`
- fixed multiple instances of app appearing after HMR
- added key bindings for elements menu, plugin manager, component library and stylesheet library
- added global selectoplasm visibility keybinding
- added exports to package.json
