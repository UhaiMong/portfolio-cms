import { RiRobot2Line } from "react-icons/ri";
import useTypewriter from "./useTypewriter";
import MarkdownText from "./MarkdownText";

// Animated AI message with typewriter
function AIMessage({ content, isLatest }) {
  const { displayed } = useTypewriter(isLatest ? content : null, 14);
  const shown = isLatest ? displayed : content;

  return (
    <div className="chat-bubble ai-bubble">
      <div className="bubble-icon">
        <RiRobot2Line size={13} />
      </div>
      <div className="bubble-text">
        <MarkdownText text={shown} />
      </div>
    </div>
  );
}
export default AIMessage;
