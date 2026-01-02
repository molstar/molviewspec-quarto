# MolViewSpec Quarto Extension

A Quarto filter extension that creates interactive molecular structure editors and viewers using MolViewSpec and MolStar.

## Features

- 🧬 Interactive molecular structure visualization
- ✏️ Built-in editor for MolViewSpec JSON
- 🎨 Customizable dimensions and styling
- 📦 All dependencies properly packaged following Quarto best practices
- 🚀 Uses the molstar-components library from JSR

## Installing

To install this extension in your Quarto project:

```bash
quarto add zachcp/molviewspec-quarto
```

Or manually copy the `_extensions/molviewspec-quarto` directory to your project's `_extensions` folder.

If you're using version control, you will want to check in the `_extensions` directory.

## Usage

### Basic Setup

Add the filter to your document's YAML header:

```yaml
---
title: "My Document"
format: html
filters:
  - molviewspec-quarto
---
```

### Creating a MolViewSpec Block

Use `{.molviewspec}` code blocks with JavaScript builder code:

````markdown
```{.molviewspec}
const structure = builder
  .download({ url: 'https://www.ebi.ac.uk/pdbe/entry-files/1cbs.bcif' })
  .parse({ format: 'bcif' })
  .modelStructure();

structure
  .component({ selector: 'polymer' })
  .representation({ type: 'cartoon' })
  .color({ color: 'blue' });
```
````

## Options

You can customize the viewer with the following attributes:

| Attribute | Description | Default |
|-----------|-------------|---------|
| `title` | Set a title for the viewer | (empty) |
| `height` | Set the height of the viewer | `"600px"` |
| `width` | Set the width of the viewer | `"100%"` |

### Examples with Options

#### Custom Title

````markdown
```{.molviewspec title="My Protein Structure"}
const structure = builder
  .download({ url: 'https://www.ebi.ac.uk/pdbe/entry-files/1cbs.bcif' })
  .parse({ format: 'bcif' })
  .modelStructure();

structure
  .component({ selector: 'polymer' })
  .representation({ type: 'cartoon' });
```
````

#### Custom Dimensions

````markdown
```{.molviewspec height="800px" width="100%" title="Large Viewer"}
const structure = builder
  .download({ url: 'https://www.ebi.ac.uk/pdbe/entry-files/1cbs.bcif' })
  .parse({ format: 'bcif' })
  .modelStructure();

structure
  .component({ selector: 'polymer' })
  .representation({ type: 'cartoon' });
```
````

## How It Works

1. The Lua filter detects `{.molviewspec}` code blocks in your document
2. It extracts the JavaScript builder code from the block
3. Generates HTML containers with unique IDs for each block
4. Loads the bundled MolStar viewer library
5. Creates a MolViewSpec builder instance
6. Executes your JavaScript code to build the molecular view
7. Loads the resulting view into the MolStar viewer
8. Each viewer instance is independent and fully interactive

## Technical Details

### Architecture

The extension consists of four main components:

- **molviewspec-quarto.lua**: Lua filter that processes code blocks and generates HTML
- **molviewspec.js**: JavaScript that initializes the MolStar viewer with MolViewSpec data
- **molviewspec.css**: Styles for the viewer containers and UI elements
- **assets/molstar.js** and **assets/molstar.css**: The MolStar viewer library

### Dependencies

- **Quarto**: >= 1.8.0
- **MolStar**: Bundled with the extension (no internet required)
- **Output format**: HTML (gracefully handles other formats by showing the original code block)

### Browser Compatibility

The extension uses modern JavaScript features and requires:
- Modern browsers with ES6+ support
- Works offline (MolStar bundled with extension)

## MolViewSpec Builder API

MolViewSpec provides a JavaScript builder API for programmatically creating molecular visualizations. The builder provides a fluent interface for:

- Downloading and parsing molecular structures (PDB, mmCIF, etc.)
- Selecting components (polymer, ligand, water, etc.)
- Adding visual representations (cartoon, ball-and-stick, surface, spacefill, etc.)
- Applying colors (named colors, hex codes, or color schemes)
- Adding labels and annotations
- Focusing the camera on specific components

For more information about MolViewSpec:

- [MolViewSpec Documentation](https://molstar.org/mol-view-spec-docs/)
- [Integration Examples](https://molstar.org/mol-view-spec-docs/mvs-molstar-extension/integration/)
- [MolStar Viewer](https://molstar.org/)
- [PDB Europe](https://www.ebi.ac.uk/pdbe/)

## Example

See [example.qmd](example.qmd) for a complete working example with multiple use cases.

To preview the example:

```bash
quarto preview example.qmd
```

## Styling

The extension includes built-in styling that:

- Provides clean, modern containers for viewers
- Supports responsive design for mobile devices
- Includes dark mode support
- Shows helpful error messages if components fail to load

You can customize the appearance by overriding the CSS classes:

- `.molviewspec-container`: Main container
- `.molviewspec-header`: Title area
- `.molviewspec-title`: Title text
- `.molviewspec-content`: Viewer content area
- `.molviewspec-error`: Error message styling

## Troubleshooting

### Components Not Loading

If the MolStar components fail to load, the extension will display a fallback view with the JSON content in a text area. This can happen if:

- There's no internet connection
- The JSR registry is unavailable
- The molstar-components package URL has changed

### HTML Format Required

The extension only works with HTML output formats. For PDF, Word, or other formats, the original code block will be displayed instead.

### JSON Syntax Errors

Make sure your MolViewSpec JSON is valid. Common issues:

- Missing commas between array elements or object properties
- Trailing commas (not allowed in JSON)
- Unquoted keys or string values
- Mismatched brackets or braces

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT

## Author

Zachary Charlop-Powers

## Version

1.0.0