// Prose renderer (markdown-like from raw HTML or text)
function RichTextContent({ content }) {
  return (
    <div
      className="blog-content px-5 sm:px-1"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
export default RichTextContent;
