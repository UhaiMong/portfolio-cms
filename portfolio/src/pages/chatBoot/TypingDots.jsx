// Typing indicator
function TypingDots() {
  return (
    <div className="chat-bubble ai-bubble typing-indicator">
      <div className="bubble-icon">
        <RiRobot2Line size={13} />
      </div>
      <div className="dots">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
export default TypingDots;
