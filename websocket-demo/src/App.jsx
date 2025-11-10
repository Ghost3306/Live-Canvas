import { useState } from "react";
import CreateRoom from "./components/CreateRoom";
import JoinRoom from "./components/JoinRoom";
import Canvas from "./components/Canvas";

function App() {
  const [roomCode, setRoomCode] = useState("");
  const [mode, setMode] = useState(""); // "create" | "join"

  const handleCreate = (code) => {
    setRoomCode(code);
    setMode("show");
  };

  const handleJoin = (code) => {
    setRoomCode(code);
    setMode("show");
  };

  const buttonBase = {
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    color: "white",
    fontWeight: "bold",
    transition: "all 0.2s ease",
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f1f3f5",
        fontFamily: "Arial, sans-serif",
        color: "#212529",
      }}
    >
      {/* Header */}
      <header
        style={{
          position: "absolute",
          top: 0,
          width: "100%",
          padding: "20px 0",
          textAlign: "center",
          backgroundColor: "#343a40",
          color: "white",
          fontSize: "24px",
          fontWeight: "bold",
          letterSpacing: "1px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        }}
      >
        Live Canvas
      </header>

      {/* Main Card */}
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          minWidth: "320px",
          textAlign: "center",
          marginTop: "60px",
        }}
      >
        {/* <h2 style={{ marginBottom: "25px" }}>Room System Demo</h2> */}

        {mode === "" && (
          <>
            <button
              onClick={() => setMode("create")}
              style={{
                ...buttonBase,
                backgroundColor: "#007bff",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#0069d9")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
            >
              Create Room
            </button>
            <button
              onClick={() => setMode("join")}
              style={{
                ...buttonBase,
                backgroundColor: "#6f42c1",
                marginLeft: "10px",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#5936a2")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#6f42c1")}
            >
              Join Room
            </button>
          </>
        )}

        {mode === "create" && <CreateRoom onCreate={handleCreate} />}
        {mode === "join" && <JoinRoom onJoin={handleJoin} />}
        {mode === "show" && <Canvas code={roomCode} />}
      </div>
    </div>
  );
}

export default App;
