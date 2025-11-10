import asyncio
import websockets
import threading
from flask import Flask, jsonify, request
from flask_cors import CORS
import json
from mongodb import create_collection,insert_data,get_room_data

# Flask setup
app = Flask(__name__)
CORS(app, origins=["*"])

created_rooms = []


@app.route("/create_room", methods=["POST"])
def create_room():
    data = request.get_json()
    room_code = data.get("room_code")
    if not room_code:
        return jsonify({"error": "Missing room_code"}), 400

    if create_collection("test-canvas", room_code):
        print("[FLASK] Room created successfully:", room_code)
        return jsonify({"status": "true", "room_code": room_code})
    else:
        print("[FLASK] Room creation failed:", room_code)
        return jsonify({"status": "false", "room_code": room_code})


@app.route("/rooms", methods=["GET"])
def get_rooms():
    return jsonify({"rooms": created_rooms})


def run_flask():
    app.run(host="0.0.0.0", port=5000, debug=False)



# -----------------------------
# WebSocket Server (broadcast + MongoDB storage)
# -----------------------------
connected_clients = set()


async def handle_connection(websocket):
    connected_clients.add(websocket)
    print("New WebSocket client connected")
    print(f"Total connected clients: {len(connected_clients)}")

    try:
        async for message in websocket:
            try:
                data = json.loads(message)
                print("Received from frontend:")
                print(json.dumps(data, indent=2))

                room_code = data.get("room", "unknown_room")

                # Handle JOIN — send all past data to this client
                if data.get("type") == "join":
                    print(f"Client joined room: {room_code}")
                    try:
                        room_history = get_room_data("test-canvas", room_code)
                        if room_history:
                            for doc in room_history:
                                await websocket.send(json.dumps(doc["data"]))
                            print(f"Sent {len(room_history)} past strokes to new client in {room_code}")
                    except Exception as e:
                        print("Error sending room history:", e)
                    continue

                # Save new stroke data in MongoDB
                if data.get("type") == "stroke":
                    document = {"room_code": room_code, "data": data}
                    insert_data("test-canvas", room_code, document)
                    print(f"Inserted stroke into MongoDB for room: {room_code}")

                    # Broadcast to all connected clients
                    broadcast_message = json.dumps(data)
                    disconnected = []
                    for client in connected_clients:
                        try:
                            await client.send(broadcast_message)
                        except Exception:
                            disconnected.append(client)
                    for dc in disconnected:
                        connected_clients.discard(dc)

                    print(f"Broadcasted to {len(connected_clients)} clients")

            except json.JSONDecodeError:
                print(f"Invalid JSON message: {message}")
            except Exception as e:
                print(f"Error handling message: {e}")

    except websockets.ConnectionClosed:
        print("Client disconnected")

    finally:
        connected_clients.discard(websocket)
        print(f"Client removed — total clients: {len(connected_clients)}")



async def start_websocket():
    """Start the WebSocket server."""
    print("[SYSTEM] Starting WebSocket server on ws://localhost:8000...")
    async with websockets.serve(handle_connection, "localhost", 8000):
        await asyncio.Future()  # keep running


if __name__ == "__main__":
    # Run Flask in background thread
    flask_thread = threading.Thread(target=run_flask, daemon=True)
    flask_thread.start()

    # Run WebSocket on main thread
    asyncio.run(start_websocket())