import 'regenerator-runtime/runtime';
import { useState, useEffect, useRef } from "react";
import "./App.css";
import { Configuration, OpenAIApi } from "openai";
import axios from "axios";
import SpeechRecognitionComponent from './SpeechRecognitionComponent';

const configuration = new Configuration({
  organization: "org-l6uGl5GKM7wKAuIYgmHfJPjo",
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

function App() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${configuration.apiKey}`,
  };

  const chat = async (e, message) => {
    e.preventDefault();
    console.log("message", message)
    if (!message) return;
    setIsTyping(true);
    scrollTo(0, 1e10)

    let msgs = chats;
    msgs.push({ role: "user", content: message });
    setChats(msgs);

    setMessage("");

    fetch("http://localhost:8000/", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        chats,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        msgs.push(data.output);
        setChats(msgs);
        setIsTyping(false);
      })
      .catch((error) => {
        console.log(error);
      });
    setMessage("");
  };

  const handleTranscript = (value) => {
    // Do something with the transcript value received from the child component
    console.log(value);
    setMessage(value);
    // if(!listening) setMessage(value);

  };

  const handleListeningChange = (listening) => {
    // Do something with the listening value received from the child component
    console.log(listening);
  };


  return (
    <main>
      <h1>Chat AI Tutorial</h1>

      <div className='chat-section'>
        <section>
          {chats && chats.length
            ? chats.map((chat, index) => (
              <p key={index} className={chat.role === "user" ? "user_msg" : ""}>
                <span>
                  <b>{chat.role.toUpperCase()}</b>
                </span>
                <span>:</span>
                <span>{chat.content}</span>
              </p>
            ))
            : ""}
        </section>

        <div className={isTyping ? "" : "hide"}>
          <p>
            <i>{isTyping ? "Typing" : ""}</i>
          </p>
        </div>
      </div>
      
      <div className='input-fields'>
        <form action="" onSubmit={(e) => chat(e, message)}>
          <button className='button' type="submit">Send</button>
        </form>
        <SpeechRecognitionComponent onTranscriptChange={handleTranscript} onListeningChange={handleListeningChange} />
      </div>

    </main>
  );
}

export default App;