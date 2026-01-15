import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [socket, setSocket] = useState<null | WebSocket>(null);
  const [latestMessage, setLatestMessage] = useState<string>("");
  const [message , setMessage] = useState<string>("");
  const [sentMsg , setSentMsg] = useState<string>("")

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8002");
    ws.onopen = () => {
      console.log("Connected to the WS Server");
      setSocket(ws);
    };
    ws.onmessage = (msg) => {
      console.log("Recieved message : ", msg.data);
      setLatestMessage(msg.data);
    };
    return () => {
      ws.close();
    }
  }, []);

  const handleSend = () => {
    if (socket && message.trim() != ''){
      socket.send(message)
      setSentMsg(message);
      setMessage("");
    }
  }

  if (!socket) {
    return <div>Connecting to the Websocket server ...</div>;
  }
  return (
    <>
    <input type="text" onChange={(e) => setMessage(e.target.value)}/>
    <button onClick={handleSend}>Send</button>
      <div>{latestMessage}</div>
      <h1>Clients Message : {sentMsg}</h1>
    </>
  );
}

export default App;
