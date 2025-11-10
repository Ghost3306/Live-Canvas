import { useState } from "react";

function JoinRoom({ onJoin }) {
  const [input, setInput] = useState("");

  const handleJoin = () => {
    if (input.trim().length !== 5) {
      alert("Room code must be exactly 5 characters!");
      return;
    }
    onJoin(input.toUpperCase());
  };

  return (
    <div style={{ marginTop: "20px", color: "#212529" }}>
      <h3>Join Room</h3>
      <input
        type="text"
        maxLength={5}
        placeholder="Enter 5-char code"
        value={input}
        onChange={(e) => setInput(e.target.value.toUpperCase())}
        style={{
          padding: "10px 15px",
          textTransform: "uppercase",
          marginRight: "10px",
          borderRadius: "8px",
          border: "2px solid #6f42c1", 
          color: "#212529",
          backgroundColor: "#f9f6ff", 
          fontWeight: "bold",
          letterSpacing: "2px",
          outline: "none",
          boxShadow: "0 2px 6px rgba(111, 66, 193, 0.2)",
          transition: "all 0.2s ease-in-out",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#5936a2";
          e.target.style.boxShadow = "0 0 6px rgba(89, 54, 162, 0.5)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#6f42c1";
          e.target.style.boxShadow = "0 2px 6px rgba(111, 66, 193, 0.2)";
        }}
      />
      <button
        onClick={handleJoin}
        style={{
          padding: "10px 18px",
          backgroundColor: "#6f42c1",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
          transition: "background 0.2s ease",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#5936a2")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#6f42c1")}
      >
        Join
      </button>
    </div>
  );
}

export default JoinRoom;
