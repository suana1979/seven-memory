// Cross-Agent Communication Test
const SendMessage = ({ to, message, summary }) => {
  console.log(`Sending message to ${to}: ${summary}`);
  return { success: true };
};

// Test case
const result = SendMessage({
  to: "test-agent",
  message: "Test message",
  summary: "Test communication"
});

console.log("Test result:", result);