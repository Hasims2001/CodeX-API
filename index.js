const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const app = express();
app.use(cors({ origin: process.env.DEPLOYED_LINK,
optionsSuccessStatus: 200 }));
app.use(express.json());

app.get("/", ()=>{
  res.send({msg: 'welcome to codeX app', issue: false});
})


app.post("/convert", async (req, res)=>{
    const {code, current, convert} = req.body;
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                "role": "system",
                "content": `act as experienced developer in different domain. your task is to convert code from one programming language to another without adding extra information about the code. for example: 
                user: convert code from java to javascript language. here is the code: 'public class Main {
                    public static void main(String[] args) {
                      System.out.println("Hello World");
                    }
                  }'
                output: 'console.log("Hello World")'`,
              },
              {
                "role": "user",
                "content": `convert code from ${current} to ${convert} language. here is the code: ${code}`
              }
            ],
            temperature: 1,
            max_tokens: 100,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          });
          res.send({"msg":  response.choices[0].message.content, 'issue': false})
    } catch (error) {   
        res.send({"msg": error.message, "issue": true});
    }
})


app.post("/debug", async (req, res)=>{
    const {code} = req.body;
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                "role": "system",
                "content": "act as experienced developer in different domain. your task is to debug the code. count number of issues and give appropriate suggestion without adding extra information. also indicates the line number with correct syntax of that line. give the output in markdown.",
              },
              {
                "role": "user",
                "content": code
              }
            ],
            temperature: 1,
            max_tokens: 100,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          });
          res.send({"msg":  response.choices[0].message.content, 'issue': false})
    } catch (error) {   
        res.send({"msg": error.message, "issue": true});
    }
})


app.post("/qualitycheck", async (req, res)=>{
    const {code} = req.body;
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                "role": "system",
                "content": "act as experienced developer in different domain. your task is to check the quality of the code.check the code on 7 key aspect and give appropriate suggestion without adding extra information. 1. Security vulnerabilities, 2. Reliability, 3. Maintainability, 4. Testability, 5. Portability, 6. Reusability, 7. Duplication.  give the output in markdown.",
              },
              {
                "role": "user",
                "content": code
              }
            ],
            temperature: 1,
            max_tokens: 100,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          });
          res.send({"msg":  response.choices[0].message.content, 'issue': false})
    } catch (error) {   
        res.send({"msg": error.message, "issue": true});
    }
})
app.listen(8080, ()=>{
    console.log("server is running....")
})
module.exports = app;