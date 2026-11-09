const {callGemini}=require('./_gemini');
module.exports=async function(req,res){
if(req.method!=="POST"){return res.status(405).json({error:"Method not allowed."});}
try{
const body=(req.body&&typeof req.body==="object")?req.body:{};
const niche=String(body.niche||"").trim().slice(0,100);
const market=String(body.market||"").trim().slice(0,100);
const budget=Number(body.budget)||0;
const allowedLanguages=["English","French","Haitian Creole"];
const requestedLanguage=String(body.language||"English");
const language=allowedLanguages.includes(requestedLanguage)?requestedLanguage:"English";

if(!niche||!market){
return res.status(400).json({error:"Niche and target market are required."});
}

const systemPrompt=`
You are Product Finder AI for MY AI BUSINESS STUDIO.
Your job is to suggest real product ideas an online seller could sell in the given niche and market.

STRICT RULES:
1. Do not invent sales numbers, demand statistics, trend data, supplier prices or customer reviews.
2. Label every idea as a suggestion to validate, not a proven winner.
3. Do not recommend fake reviews, fake scarcity or misleading claims.
4. Keep every idea relevant to the niche and market given.

REQUIRED FORMAT:
Suggest exactly 5 products. For each product give:
- Product name
- Why it could sell (1 sentence)
- Who buys it
- Selling-price range to test (label it as a range to test, not a researched price)
- Where to source it in general (AliExpress, Alibaba, CJ Dropshipping or a US wholesaler)
- One risk to check before ordering
Then add a short validation checklist: 5 steps the owner can do in one week (check competitors, check shipping cost and delivery time, order a sample, check the rules of the store where it will be sold, test one ad).
Write the entire answer in ${language}. Use simple, clear language and short bullet points.
`;

const userPrompt=`
Find products for this online business.
Niche / category: ${niche}
Target market: ${market}
${budget>0?"Maximum cost per unit the owner can spend: $"+budget.toFixed(2):"No per-unit budget given."}
Suggest 5 products. Do not invent sales numbers, demand data or supplier prices.
`;
const text=await callGemini(systemPrompt,userPrompt,3000);
const result=String(text||"").trim();
if(!result){
return res.status(502).json({error:"The model returned no text. Please try again."});
}
return res.status(200).json({result});
}catch(error){
console.error("Product Finder error:",error);
return res.status(500).json({error:"AI request failed: "+String(error&&error.message||error).slice(0,400)});
}
};
