// Renders markdown-lite: bold, bullets
function MarkdownText({ text }) {
  const lines = text.split("\n");
  return (
    <span>
      {lines.map((line, i) => {
        // Bold: **text**
        const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
          /^\*\*[^*]+\*\*$/.test(part) ? (
            <strong key={j} style={{ fontWeight: 700 }}>
              {part.slice(2, -2)}
            </strong>
          ) : (
            part
          ),
        );
        // Bullet
        const isBullet =
          line.trim().startsWith("*") || line.trim().startsWith("-");
        return (
          <span
            key={i}
            style={{ display: "block", paddingLeft: isBullet ? "0.5rem" : 0 }}
          >
            {isBullet && (
              <span style={{ color: "var(--accent)", marginRight: 4 }}>
                {" "}
                •{" "}
              </span>
            )}
            {parts}
            {i < lines.length - 1 && !isBullet && line !== "" && <br />}
          </span>
        );
      })}
    </span>
  );
}
export default MarkdownText;
