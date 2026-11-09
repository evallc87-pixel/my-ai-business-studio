const {callGemini}=require('./_gemini');
module.exports=async function(req,res){
if(req.method!=="POST"){return res.status(405).json({error:"Method not allowed."});}
try{
const body=(req.body&&typeof req.body==="object")?req.body:{};
const product=String(body.product||"").trim().slice(0,150);
const audience=String(body.audience||"").trim().slice(0,150);
const length=String(body.length||"30 seconds");
const platform=String(body.platform||"TikTok");
const allowedLanguages=["English","French","Haitian Creole"];
const requestedLanguage=String(body.language||"English");
const language=allowedLanguages.includes(requestedLanguage)?requestedLanguage:"English";

if(!product||!audience){
return res.status(400).json({error:"Product and audience are required."});
}

const systemPrompt=`
You are AI Video Marketing for MY AI BUSINESS STUDIO.
Your job is to write a complete, realistic advertising video concept the owner can film with a phone and the real product.

STRICT RULES:
1. Only use product facts the owner supplied. Do not invent taste, results, reviews, certifications or claims.
2. Do not suggest grinding beans if the product is ground coffee. Do not suggest non-food uses for food products.
3. Every scene must be filmable with a phone and the real product. No studio crew, no actors, no special effects that need paid software.
4. Keep the total video length exactly as requested.

REQUIRED FORMAT:
1. HOOK — the exact first 3 seconds: what is shown on screen and what is said or written on screen.
2. SCENES — 5 to 8 scenes. For each scene: shot description, duration in seconds, on-screen text, voiceover line (if any).
3. CAPTION — the text to post with the video (2 to 3 sentences).
4. HASHTAGS — 3 hashtags.
5. CALL TO ACTION — one sentence telling viewers what to do.
Write the entire answer in ${language}. Use simple, clear language.
`;

const userPrompt=`
Write a video concept for this product.
Product: ${product}
Audience: ${audience}
Video length: ${length}
Platform: ${platform}
`;
const text=await callGemini(systemPrompt,userPrompt,3000);
const result=String(text||"").trim();
if(!result){
return res.status(502).json({error:"The model returned no text. Please try again."});
}
return res.status(200).json({result});
}catch(error){
console.error("Video Marketing error:",error);
return res.status(500).json({error:"AI request failed: "+String(error&&error.message||error).slice(0,400)});
}
};
