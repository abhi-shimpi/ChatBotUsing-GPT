import { Configuration, OpenAIApi } from "openai";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import say from "say";

const app = express();
const port = 8000;
app.use(bodyParser.json());
app.use(cors());

// const text = 'Hello, world! This is a test.';
// say.speak(text);

const configuration = new Configuration({
    organization: "org-l6uGl5GKM7wKAuIYgmHfJPjo",
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);

app.post("/", async (request, response) => {
    const { chats } = request.body;

    const result = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "You are a EbereGPT.",
            },
            ...chats,
        ],
    });

    response.json({
        output: result.data.choices[0].message,
    });

    console.log(result.data.choices[0].message.content)
    const text = result.data.choices[0].message.content;
    say.speak(text);
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});