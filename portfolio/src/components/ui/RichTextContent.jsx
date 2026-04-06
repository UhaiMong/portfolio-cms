// Prose renderer (markdown-like from raw HTML or text)
import DOMPurify from "dompurify";
function RichTextContent({ content }) {
  return (
    <div
      className="blog-content px-5 sm:px-1"
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
    />
  );
}
export default RichTextContent;
