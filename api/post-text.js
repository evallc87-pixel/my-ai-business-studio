const {callGemini}=require('./_gemini');
module.exports=async function(req,res){
if(req.method!=="POST"){return res.status(405).json({error:"Method not allowed."});}
try{
const body=(req.body&&typeof req.body==="object")?req.body:{};
const product=String(body.product||"").trim().slice(0,150);
const price=Number(body.price)||0;
const platform=String(body.platform||"Instagram");
const allowedLanguages=["English","French","Haitian Creole"];
const requestedLanguage=String(body.language||"English");
const language=allowedLanguages.includes(requestedLanguage)?requestedLanguage:"English";

if(!product){
return res.status(400).json({error:"Product name is required."});
}

const systemPrompt=`
You are a social media copywriter for MY AI BUSINESS STUDIO.
Write short, attractive marketing copy for one product post that makes people stop, click and ask for more information.
STRICT RULES:
1. Only use facts the owner supplied. Do not invent taste, results, reviews, discounts, certifications or claims.
2. Do not recommend fake reviews, fake scarcity or misleading discounts.
3. Keep it punchy and specific to the product.
Return ONLY valid JSON, no other text, no code fences:
{"headline":"...","subtext":"...","cta":"...","caption":"...","hashtags":["#...","#...","#..."]}
- headline: max 8 words, the big hook.
- subtext: max 15 words, one benefit.
- cta: max 5 words, tells the viewer what to do.
- caption: 2 sentences for the post.
- hashtags: 3 hashtags in English.
Write everything in ${language} except the hashtags, which stay in English.
`;

const userPrompt=`
Write marketing copy for this product post.
Product: ${product}
${price>0?"Price: $"+price.toFixed(2):"No price given."}
Platform: ${platform}
`;
let text=String(await callGemini(systemPrompt,userPrompt,800)||"").trim();
text=text.replace(/^```json\s*/i,"").replace(/^```\s*/,"").replace(/\s*```$/,"").trim();
var braceStart=text.indexOf("{");
var braceEnd=text.lastIndexOf("}");
if(braceStart>=0&&braceEnd>braceStart){text=text.slice(braceStart,braceEnd+1);}
let copy=null;
try{
copy=JSON.parse(text);
}catch(e){
copy=null;
}
if(!copy||typeof copy.headline!=="string"||!copy.headline){
copy={
headline:product,
subtext:"Fresh, premium quality.",
cta:"Shop now",
caption:product+" — order yours today.",
hashtags:["#ShopNow","#NewProduct","#MustHave"]
};
}
if(typeof copy.subtext!=="string")copy.subtext="Fresh, premium quality.";
if(typeof copy.cta!=="string")copy.cta="Shop now";
if(typeof copy.caption!=="string")copy.caption=product+" — order yours today.";
if(!Array.isArray(copy.hashtags))copy.hashtags=["#ShopNow","#NewProduct","#MustHave"];
return res.status(200).json({copy});
}catch(error){
console.error("Post text error:",error);
return res.status(500).json({error:"AI request failed: "+String(error&&error.message||error).slice(0,400)});
}
};
