// Shared Gemini helper for all AI endpoints.
// Primary model: gemini-3.5-flash-lite (fast, free tier).
// Fallback model: gemini-3.8-flash (free tier).
// Each attempt gets 20 seconds; if it times out or errors, the fallback is tried.
// The API key comes from the GEMINI_API_KEY environment variable in Vercel.
const PRIMARY_MODEL="gemini-3.5-flash-lite";
const FALLBACK_MODEL="gemini-3.8-flash";
function timeoutPromise(ms){return new Promise(function(_,rej){setTimeout(function(){rej(new Error("GEMINI_TIMEOUT"));},ms);});}
async function geminiOnce(model,systemPrompt,userPrompt,maxTokens,apiKey){
const url="https://generativelanguage.googleapis.com/v1beta/models/"+model+":generateContent?key="+encodeURIComponent(apiKey);
const res=await Promise.race([
fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({system_instruction:{parts:[{text:systemPrompt}]},contents:[{parts:[{text:userPrompt}]}],generationConfig:{maxOutputTokens:maxTokens,temperature:0.7}})}),
timeoutPromise(20000)
]);
if(!res.ok){
let t="";
try{t=await res.text();}catch(e){}
throw new Error("Gemini "+model+" HTTP "+res.status+": "+t.slice(0,200));
}
const data=await res.json();
let text="";
try{text=(data.candidates[0].content.parts||[]).map(function(p){return p.text||"";}).join("");}catch(e){}
if(!text){throw new Error("Gemini "+model+" returned no text.");}
return text;
}
async function callGemini(systemPrompt,userPrompt,maxTokens){
const apiKey=process.env.GEMINI_API_KEY;
if(!apiKey){throw new Error("GEMINI_API_KEY is not set on the server. Add it in Vercel Settings, Environment Variables.");}
try{return await geminiOnce(PRIMARY_MODEL,systemPrompt,userPrompt,maxTokens,apiKey);}
catch(e1){
return await geminiOnce(FALLBACK_MODEL,systemPrompt,userPrompt,maxTokens,apiKey);
}
}
module.exports={callGemini};
