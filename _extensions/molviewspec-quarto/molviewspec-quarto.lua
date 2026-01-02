-- MolViewSpec Quarto Filter
-- Processes molviewspec code blocks and creates interactive MolStar viewers

local counter = 0
local dependencies_added = false
local monaco_injected = false

-- Function to add HTML dependencies (JS and CSS)
local function add_dependencies()
  if dependencies_added then
    return
  end

  -- Only add dependencies if quarto global is available
  if quarto and quarto.doc and quarto.doc.addHtmlDependency then
    -- Add MolStar and extension assets
    quarto.doc.addHtmlDependency({
      name = "molviewspec-quarto",
      version = "1.0.0",
      scripts = {
        { path = "assets/molstar.js" },
        { path = "molviewspec.js", attribs = {type = "module"} }
      },
      stylesheets = {
        "assets/molstar.css",
        "molviewspec.css"
      }
    })
  end

  dependencies_added = true
end

-- Function to inject Monaco Editor loader (only once)
local function inject_monaco()
  if monaco_injected then
    return ""
  end
  monaco_injected = true

  return [[
<script src="https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js"></script>
<script>
require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' }});
require(['vs/editor/editor.main'], function() {
  console.log('Monaco Editor loaded and available at window.monaco');
});
</script>
]]
end

-- Function to generate unique ID
local function generate_id()
  counter = counter + 1
  return "molviewspec-" .. counter
end

-- Process CodeBlock elements
function CodeBlock(el)
  -- Check if this is a molviewspec code block
  if el.classes:includes("molviewspec") then

    -- Only process for HTML output (check if quarto global exists)
    if quarto and quarto.doc then
      if not quarto.doc.isFormat("html") then
        -- For non-HTML formats, return the original code block
        return el
      end
    end

    -- Add dependencies on first use
    add_dependencies()

    -- Generate unique ID for this instance
    local id = generate_id()

    -- Get the code content (JavaScript builder code)
    local content = el.text

    -- Get optional attributes
    local height = el.attributes.height or "600px"
    local width = el.attributes.width or "100%"
    local title = el.attributes.title or ""

    -- Inject Monaco loader before first viewer (only once)
    local monaco_loader = inject_monaco()

    -- Create HTML structure with script tag to store code (avoids escape issues)
    local html = string.format([[%s
<div class="molviewspec-container" id="%s" style="height: %s; width: %s;">
  %s
  <script type="application/json" id="%s-code">%s</script>
  <div class="molviewspec-viewer" id="%s-viewer"></div>
</div>
]], monaco_loader, id, height, width,
    title ~= "" and string.format('<div class="molviewspec-header"><h4 class="molviewspec-title">%s</h4></div>', title) or "",
    id, content,
    id)

    -- Return as raw HTML block
    return pandoc.RawBlock('html', html)
  end

  -- Return unchanged if not a molviewspec block
  return el
end

-- Return filter function
return {
  { CodeBlock = CodeBlock }
}
