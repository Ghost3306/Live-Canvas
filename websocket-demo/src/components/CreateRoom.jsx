function CreateRoom({ onCreate }) {
  const generateCode = async () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    try {
      // 🔹 Send generated code to backend (POST)
      const response = await fetch("http://localhost:5000/create_room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ room_code: code }),
      });

      if (!response.ok) {
        throw new Error("Failed to send room code to server");
      }

      const data = await response.json();
     
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Could not send room code to server. Check console for details.");
    }

    
    onCreate(code);
  };

  return (
    <div style={{ marginTop: "20px", color: "#212529" }}>
      <h3>Create Room</h3>
      <button
        onClick={generateCode}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Generate Code
      </button>
    </div>
  );
}

export default CreateRoom;
