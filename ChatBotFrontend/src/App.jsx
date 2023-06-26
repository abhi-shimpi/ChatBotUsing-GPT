import 'regenerator-runtime/runtime';
import { useState ,useEffect ,useRef} from "react";
import "./App.css";
import { Configuration, OpenAIApi } from "openai";
import axios from "axios";
import SpeechRecognitionComponent from './SpeechRecognitionComponent';


const configuration = new Configuration({
  organization: "org-1BzQinbEPue60aqRSpqEL5SZ",
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

function App() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const formRef = useRef(null);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${configuration.apiKey}`,
  };

  const chat = async (e, message) => {
    e.preventDefault();

    if (!message) return;
    setIsTyping(true);
    scrollTo(0,1e10)

    let msgs = chats;
    msgs.push({ role: "user", content: message });
    setChats(msgs);

    setMessage("");

    axios
      .post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
        }, { headers })
          .then((res) => {
            msgs.push(res.data.choices[0].message);
            setChats(msgs);
            setIsTyping(false);
            scrollTo(0,1e10)
          })
          .catch((error) => {
            console.log(error);
        });
  };

  const handleTranscript = (value,listening) => {
    // Do something with the transcript value received from the child component
    console.log(value);
    setMessage(value);

  };

  const handleListeningChange = (listening) => {
    // Do something with the listening value received from the child component
    console.log(listening);
  };
  

  return (
    <main>
      <h1>Chat AI Tutorial</h1>

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
      
      <form action="" onSubmit={(e)=>chat(e,message)}>
        {/* <input
          type="text"
          name="message"
          value={message}
          placeholder="Type a message here and hit Enter..."
          onChange={(e) => setMessage(e.target.value)}
        /> */}
        <h1>Voice-to-Text</h1>
            <SpeechRecognitionComponent onTranscriptChange={handleTranscript} onListeningChange={handleListeningChange}/>
      </form>
    </main>
  );
}

export default App;