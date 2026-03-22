import { Editor } from "@tinymce/tinymce-react";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  error?: boolean;
  minHeight?: number;
}

export default function RichTextEditor({
  value,
  onChange,
  error = false,
  minHeight = 480,
}: RichTextEditorProps) {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <div
      className={`rounded-xl overflow-hidden transition-all duration-200 ${
        error
          ? "ring-2 ring-red-500 ring-offset-2 ring-offset-gray-900"
          : "ring-1 ring-gray-700 focus-within:ring-indigo-500"
      }`}
    >
      {isLoading && (
        <div className="bg-gray-800 w-full">
          {/* Toolbar skeleton */}
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-gray-700 flex-wrap">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-6 w-7 bg-gray-700 rounded animate-pulse"
              />
            ))}
          </div>
          {/* Content area skeleton */}
          <div className="p-4 space-y-2.5 min-h-50">
            <div className="h-3 bg-gray-700 rounded animate-pulse w-full" />
            <div className="h-3 bg-gray-700 rounded animate-pulse w-5/6" />
            <div className="h-3 bg-gray-700 rounded animate-pulse w-4/6" />
          </div>
          {/* Optional: spinner + label */}
          <div className="flex items-center justify-center gap-2 py-3 border-t border-gray-700 text-gray-500 text-xs">
            <Loader2 size={13} className="animate-spin" />
            Loading editor...
          </div>
        </div>
      )}
      <div style={{ display: isLoading ? "none" : "block" }}>
        <Editor
          apiKey={import.meta.env.VITE_TINY_MCE_API_KEY}
          value={value}
          onInit={() => setIsLoading(false)}
          onEditorChange={(content) => onChange(content)}
          init={{
            min_height: minHeight,
            menubar: true,
            skin: "oxide-dark",
            content_css: "dark",
            resize: true,

            // All possible plugins
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "visualchars",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "help",
              "wordcount",
              "emoticons",
              "template",
              "codesample",
              "directionality",
              "nonbreaking",
              "pagebreak",
              "quickbars",
              "autosave",
              "accordion",
            ],

            //  Full toolbar (split across 3 rows)
            toolbar:
              "undo redo | styles fontfamily fontsize | " +
              "bold italic underline strikethrough | " +
              "forecolor backcolor | removeformat | " +
              "alignleft aligncenter alignright alignjustify | " +
              "bullist numlist outdent indent | " +
              "blockquote codesample | " +
              "link image media table | " +
              "charmap emoticons insertdatetime | " +
              "searchreplace | visualblocks code fullscreen preview | " +
              "ltr rtl | pagebreak nonbreaking | " +
              "accordion | help",

            toolbar_mode: "sliding",
            toolbar_sticky: true,

            //  Quickbars (inline selection toolbar)
            quickbars_selection_toolbar:
              "bold italic underline | link blockquote | forecolor backcolor | removeformat",
            quickbars_insert_toolbar:
              "image media table codesample | hr pagebreak",

            // Context menu
            contextmenu:
              "link image imagetools table spellchecker configurepermanentpen",

            // Image settings
            image_advtab: true,
            image_caption: true,
            image_title: true,
            automatic_zoom_width: true,

            // Table settings
            table_responsive_width: true,
            table_default_styles: {
              width: "100%",
              "border-collapse": "collapse",
            },
            table_default_attributes: {
              border: "1",
            },

            // Link settings
            link_default_target: "_blank",
            link_assume_external_targets: true,
            link_context_toolbar: true,

            // Code sample languages
            codesample_languages: [
              { text: "HTML/XML", value: "markup" },
              { text: "JavaScript", value: "javascript" },
              { text: "TypeScript", value: "typescript" },
              { text: "CSS", value: "css" },
              { text: "SCSS", value: "scss" },
              { text: "Python", value: "python" },
              { text: "Bash", value: "bash" },
              { text: "JSON", value: "json" },
              { text: "SQL", value: "sql" },
              { text: "Go", value: "go" },
              { text: "Rust", value: "rust" },
              { text: "Java", value: "java" },
              { text: "C#", value: "csharp" },
              { text: "PHP", value: "php" },
              { text: "Ruby", value: "ruby" },
              { text: "YAML", value: "yaml" },
            ],

            // Autosave
            autosave_ask_before_unload: true,
            autosave_interval: "30s",
            autosave_prefix: "tinymce-autosave-{path}{query}-{id}-",
            autosave_restore_when_empty: false,

            // Font options
            font_family_formats:
              "System UI=system-ui,sans-serif;" +
              "Arial=arial,helvetica,sans-serif;" +
              "Georgia=georgia,palatino;" +
              "Courier New=courier new,courier;" +
              "Trebuchet MS=trebuchet ms,geneva;" +
              "Verdana=verdana,geneva;" +
              "Monaco=monaco,monospace;" +
              "Lucida Console=lucida console,monaco;",

            font_size_formats:
              "8pt 10pt 11pt 12pt 14pt 16pt 18pt 20pt 24pt 28pt 32pt 36pt 48pt 60pt 72pt",

            // Styles/headings
            style_formats: [
              {
                title: "Headings",
                items: [
                  { title: "Heading 1", format: "h1" },
                  { title: "Heading 2", format: "h2" },
                  { title: "Heading 3", format: "h3" },
                  { title: "Heading 4", format: "h4" },
                  { title: "Heading 5", format: "h5" },
                  { title: "Heading 6", format: "h6" },
                ],
              },
              {
                title: "Inline",
                items: [
                  { title: "Bold", format: "bold" },
                  { title: "Italic", format: "italic" },
                  { title: "Underline", format: "underline" },
                  { title: "Strikethrough", format: "strikethrough" },
                  { title: "Superscript", format: "superscript" },
                  { title: "Subscript", format: "subscript" },
                  { title: "Code", format: "code" },
                ],
              },
              {
                title: "Blocks",
                items: [
                  { title: "Paragraph", format: "p" },
                  { title: "Blockquote", format: "blockquote" },
                  { title: "Preformatted", format: "pre" },
                ],
              },
              {
                title: "Callouts",
                items: [
                  {
                    title: "Info",
                    block: "div",
                    classes: "callout callout-info",
                    wrapper: true,
                  },
                  {
                    title: "Warning",
                    block: "div",
                    classes: "callout callout-warning",
                    wrapper: true,
                  },
                  {
                    title: "Tip",
                    block: "div",
                    classes: "callout callout-tip",
                    wrapper: true,
                  },
                ],
              },
            ],

            // Dark content styles
            content_style: `
            body {
              font-family: system-ui, -apple-system, sans-serif;
              font-size: 14px;
              line-height: 1.75;
              color: #e5e7eb;
              background: #111827;
              padding: 1.5rem 2rem;
              max-width: 100%;
            }
            h1,h2,h3,h4,h5,h6 {
              color: #f9fafb;
              font-weight: 700;
              line-height: 1.25;
              margin-top: 1.5em;
              margin-bottom: 0.5em;
            }
            h1 { font-size: 2rem; }
            h2 { font-size: 1.5rem; border-bottom: 1px solid #374151; padding-bottom: 0.4em; }
            h3 { font-size: 1.25rem; }
            a { color: #818cf8; text-decoration: underline; }
            a:hover { color: #a5b4fc; }
            blockquote {
              border-left: 3px solid #4f46e5;
              margin: 1.5em 0;
              padding: 0.75em 1.25em;
              background: #1f2937;
              border-radius: 0 8px 8px 0;
              color: #9ca3af;
              font-style: italic;
            }
            code {
              background: #1f2937;
              border: 1px solid #374151;
              border-radius: 4px;
              padding: 0.15em 0.4em;
              font-size: 0.875em;
              font-family: 'Monaco', 'Courier New', monospace;
              color: #a78bfa;
            }
            pre {
              background: #1f2937;
              border: 1px solid #374151;
              border-radius: 8px;
              padding: 1em;
              overflow-x: auto;
            }
            pre code {
              background: none;
              border: none;
              padding: 0;
              color: #e5e7eb;
            }
            img {
              max-width: 100%;
              border-radius: 8px;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin: 1em 0;
            }
            table td, table th {
              border: 1px solid #374151;
              padding: 0.5em 0.75em;
            }
            table th {
              background: #1f2937;
              color: #f9fafb;
              font-weight: 600;
            }
            table tr:nth-child(even) {
              background: #111827;
            }
            hr {
              border: none;
              border-top: 1px solid #374151;
              margin: 2em 0;
            }
            .callout {
              padding: 1em 1.25em;
              border-radius: 8px;
              margin: 1.5em 0;
              border-left: 4px solid;
            }
            .callout-info { background: #1e3a5f; border-color: #3b82f6; }
            .callout-warning { background: #451a03; border-color: #f59e0b; }
            .callout-tip { background: #052e16; border-color: #22c55e; }
          `,

            // Misc
            branding: false,
            promotion: false,
            elementpath: true,
            statusbar: true,
            word_count_plus: true,
            paste_data_images: true,
            smart_paste: true,
            autocorrect: true,
            spellchecker_active: true,
          }}
        />
      </div>
    </div>
  );
}
