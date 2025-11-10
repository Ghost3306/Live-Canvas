# 🖌️ Live Canvas

**Live Canvas** is a real-time collaborative drawing app built using **React**, **Flask**, **WebSocket**, and **MongoDB**.  
Users can **create** or **join** rooms with a 5-character code and draw together instantly.  
Every stroke is broadcasted live to all connected users and saved in MongoDB — new users joining later automatically get the full drawing history.

---

## 🚀 Features
- 🎨 Real-time collaborative drawing
- 💾 MongoDB persistence for every stroke
- 🔁 Auto-load of previous drawings for new users
- 🧩 Room system with unique 5-letter codes
- 🧠 Flask API + WebSocket hybrid backend

---

## ⚙️ Tech Stack
**Frontend:** React, WebSocket  
**Backend:** Flask, Asyncio, WebSockets  
**Database:** MongoDB  
**Language:** Python, JavaScript  

---
Installation

Step 1 : Clone the repo
https://github.com/Ghost3306/Live-Canvas.git
open 2 cmd prompt
	1st CMD : Server -> cd where server file is there
	2nd CMD : Frontend -> cd where react file is there

Step 2 : Download and Setup MongoDB

Step 3 : 
	1st CMD : 
		-pip install -r requirements.txt
		-python server.py
	2nd CMD :
		-npm install i
		-npm run dev



