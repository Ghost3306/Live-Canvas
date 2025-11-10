import React, { useRef, useState,useEffect } from 'react'
import { ReactSketchCanvas } from 'react-sketch-canvas'
import './Canvas.css'

export default function Canvas({code}) {
  const canvasRef = useRef(null)
  const [savedStrokes, setSavedStrokes] = useState([])
  const [isReplaying, setIsReplaying] = useState(false)
  const [strokeColor, setStrokeColor] = useState('#ff0000')
  const [strokeWidth, setStrokeWidth] = useState(4)
  const [isEraserOn, setIsEraserOn] = useState(false)
  const [strokeData, setStrokeData] = useState([])
  const [socket, setSocket] = useState(null);
  const prevColorRef = useRef(strokeColor)

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8000");
        setSocket(ws);

        ws.onopen = () => {
            console.log("Connected to server");
           
            ws.send(JSON.stringify({ type: "join", room: code }));  
        };

        ws.onmessage = async (event) => {
            try {
            const data = JSON.parse(event.data);
            

            if (data.type === "stroke" && data.stroke) {
                await drawIncomingStroke(data.stroke);
            }
            } catch (err) {
            console.error("Error parsing broadcast message:", err);
            }
        };

        ws.onclose = () => console.log("Disconnected from server");
        return () => ws.close();
        }, [code]);




  const styles = {
    border: '2px solid #9c9c9c',
    margin: 'auto',
    display: 'block',
    backgroundColor: 'white',
  }


    const drawIncomingStroke = async (strokeData) => {
  if (!canvasRef.current || !strokeData) {
    
    return;
  }

  try {
    const strokeColor = strokeData.strokeColor || "#000000";
    const strokeWidth = strokeData.strokeWidth || 2;
    const paths = Array.isArray(strokeData.paths) ? strokeData.paths : [];

    if (paths.length === 0) {
      
      return;
    }

    const animatedStroke = {
      drawMode: true,
      strokeColor,
      strokeWidth,
      paths: [],
    };

   
    for (let i = 0; i < paths.length; i++) {
      animatedStroke.paths.push(paths[i]);
      await canvasRef.current.loadPaths([animatedStroke]);
      await new Promise((r) => setTimeout(r, 5));
    }

   
  } catch (err) {
    console.error("Error drawing incoming stroke:", err);
  }
};




  const handleStroke = async () => {
    if (!canvasRef.current) return
    try {
      const strokes = await canvasRef.current.exportPaths()
      if (strokes?.length) {
        setSavedStrokes(strokes)

       
        
        if (socket && socket.readyState === WebSocket.OPEN) {
        const payload = {
            type: "stroke",
            room: code, 
            stroke: strokes[strokes.length - 1],
        };
        socket.send(JSON.stringify(payload));
        
        }


        
        const formattedData = strokes.map((stroke, index) => ({
          id: index + 1,
          color: stroke.strokeColor,
          width: stroke.strokeWidth,
          points: stroke.paths.map((p) => ({
            x: parseFloat(p.x.toFixed(2)),
            y: parseFloat(p.y.toFixed(2)),
          })),
        }))

       
      }
    } catch (err) {
      console.error('Error while exporting paths:', err)
    }
  }


  const handleReplay = async () => {
    if (!canvasRef.current || savedStrokes.length === 0) {
      console.warn('No saved strokes to replay.')
      return
    }

    setIsReplaying(true)
    await canvasRef.current.clearCanvas()

    for (let s = 0; s < savedStrokes.length; s++) {
      const stroke = savedStrokes[s]
      const animatedStroke = {
        drawMode: true,
        strokeColor: stroke.strokeColor,
        strokeWidth: stroke.strokeWidth,
        paths: [],
      }

      for (let i = 0; i < stroke.paths.length; i++) {
        animatedStroke.paths.push(stroke.paths[i])
        await canvasRef.current.loadPaths([animatedStroke])
        await new Promise((r) => setTimeout(r, 10))
      }
      await new Promise((r) => setTimeout(r, 5))
    }

    setIsReplaying(false)
    
  }


  const handleClear = () => {
    if (!canvasRef.current) return
    canvasRef.current.clearCanvas()
   
  }


  const toggleEraser = () => {
    if (isEraserOn) {
      setIsEraserOn(false)
      setStrokeColor(prevColorRef.current || '#ff0000')
    } else {
      prevColorRef.current = strokeColor
      setStrokeColor('#ffffff')
      setIsEraserOn(true)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
        marginTop: '20px',
        position: 'relative',
      }}
    >
        <h4>Your Canvas : {code}</h4>
      {/* 🎨 Left Toolbar - Color + Width */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          padding: '20px',
          backgroundColor: '#f8f8f8',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          height: 'fit-content',
        }}
      >
        {/* Color Picker */}
        <div style={{ textAlign: 'center' }}>
          <strong>Color</strong>
          <input
            type="color"
            value={strokeColor}
            disabled={isEraserOn}
            onChange={(e) => setStrokeColor(e.target.value)}
            style={{
              cursor: 'pointer',
              width: '60px',
              height: '40px',
              border: 'none',
              background: 'none',
              marginTop: '10px',
            }}
          />
        </div>

        {/* Stroke Width Slider */}
        <div style={{ textAlign: 'center' }}>
          <strong>Width</strong>
          <input
            type="range"
            min="1"
            max="20"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
            style={{ cursor: 'pointer', width: '60px', writingMode: 'bt-lr' }}
          />
          <div>{strokeWidth}px</div>
        </div>
      </div>

      {/* 🖌️ Canvas */}
      <div style={{ position: 'relative' }}>
        <ReactSketchCanvas
          ref={canvasRef}
          style={styles}
          width="1000px"
          height="600px"
          strokeWidth={strokeWidth}
          strokeColor={strokeColor}
          onStroke={handleStroke}
        />
      </div>

      {/* 🧽 Right Toolbar - Eraser + Preview */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          padding: '20px',
          backgroundColor: '#f8f8f8',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          height: 'fit-content',
        }}
      >
        {/* Brush Preview */}
        <div
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: strokeColor,
            border: '2px solid #444',
            transform: `scale(${strokeWidth / 8})`,
            transition: 'all 0.2s ease',
          }}
          title={`Color: ${strokeColor}, Width: ${strokeWidth}px`}
        ></div>

        {/* Eraser Toggle */}
        <button
          onClick={toggleEraser}
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            backgroundColor: isEraserOn ? '#ff4444' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
          }}
        >
          {isEraserOn ? 'Eraser On' : 'Eraser Off'}
        </button>

        <button
          onClick={handleClear}
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            backgroundColor: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
          }}
        >
          Clear Canvas
        </button>

        <button
          onClick={handleReplay}
          style={{
            marginRight: '10px',
            padding: '10px 20px',
            cursor: 'pointer',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
          }}
        >
          Replay Saved Strokes
        </button>
      </div>
    </div>
  )
}
