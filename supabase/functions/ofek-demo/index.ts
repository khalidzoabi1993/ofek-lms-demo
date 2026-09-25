const headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, apikey, content-type, x-client-info','Access-Control-Allow-Methods':'GET, POST, OPTIONS','Content-Type':'application/json'};
const respond=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers});
Deno.serve(async(req:Request)=>{
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(!['GET','POST'].includes(req.method))return respond({error:'Method not allowed'},405);
 const authorization=req.headers.get('Authorization')||'';
 if(!authorization.startsWith('Bearer '))return respond({error:'נדרשת כניסה'},401);
 const url=Deno.env.get('SUPABASE_URL')!,key=Deno.env.get('SUPABASE_ANON_KEY')!;
 const h={apikey:key,Authorization:authorization,'Content-Type':'application/json'};
 const identity=await fetch(`${url}/auth/v1/user`,{headers:h});
 if(!identity.ok)return respond({error:'הכניסה פגה או אינה תקפה'},401);
 const user=await identity.json(); if(!user.id)return respond({error:'נדרשת כניסה'},401);
 try{
  if(req.method==='GET'){
   const names=['ofek_demo_workspaces','ofek_demo_courses','ofek_demo_assignments','ofek_demo_attempts'];
   const results=await Promise.all(names.map(async n=>{const r=await fetch(`${url}/rest/v1/${n}?owner_id=eq.${user.id}&select=*`,{headers:h});if(!r.ok)throw new Error('Database read failed');return r.json()}));
   const [w,c,a,t]=results;return respond({state:w.length?{...w[0].config,courses:c.map((x:any)=>x.metadata),assignments:a.map((x:any)=>x.payload),attempts:t.map((x:any)=>x.payload)}:null,updatedAt:w[0]?.updated_at??null});
  }
  const raw=await req.text();if(raw.length>3500000)return respond({error:'המידע גדול מדי לשמירת הדגמה'},413);
  const body=JSON.parse(raw);if(!body.state||!Array.isArray(body.state.courses)||!Array.isArray(body.state.attempts)||!Array.isArray(body.state.assignments))return respond({error:'מבנה נתונים לא תקין'},400);
  const result=await fetch(`${url}/rest/v1/rpc/ofek_demo_save`,{method:'POST',headers:h,body:JSON.stringify({p_state:body.state})});
  if(!result.ok){console.error('Save rejected',result.status);return respond({error:'שמירת הנתונים נדחתה. נסו שוב.'},400)}
  return respond(await result.json());
 }catch{ return respond({error:'השירות אינו זמין כרגע. הנתונים נשארו בדפדפן.'},500)}
});
