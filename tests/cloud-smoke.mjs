// Explicit opt-in against the linked demo project. Never prints tokens or credentials.
import assert from 'node:assert/strict';
import {CLOUD} from '../dist/config.js';
const email=process.env.OFEK_DEMO_EMAIL,password=process.env.OFEK_DEMO_PASSWORD;
if(!email||!password)throw new Error('Set OFEK_DEMO_EMAIL and OFEK_DEMO_PASSWORD privately before running this opt-in check.');
async function request(path,{method='GET',body,token}={}){const response=await fetch(CLOUD.url+path,{method,headers:{apikey:CLOUD.anonKey,'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:body?JSON.stringify(body):undefined});return {status:response.status,data:await response.json()}}
const auth=await request('/auth/v1/token?grant_type=password',{method:'POST',body:{email,password}});assert.equal(auth.status,200);const token=auth.data.access_token;
assert.equal((await request('/functions/v1/ofek-demo')).status,401);
assert.equal((await request('/functions/v1/ofek-demo',{token:'invalid'})).status,401);
const state=await request('/functions/v1/ofek-demo',{token});assert.equal(state.status,200);assert.ok('state' in state.data);
assert.ok([401,403].includes((await request('/rest/v1/ofek_demo_workspaces?select=*')).status));
const foreign=crypto.randomUUID();const hidden=await request(`/rest/v1/ofek_demo_workspaces?owner_id=eq.${foreign}&select=*`,{token});assert.equal(hidden.status,200);assert.deepEqual(hidden.data,[]);
const forbidden=await request('/rest/v1/ofek_demo_workspaces',{method:'POST',token,body:{owner_id:foreign,config:{}}});assert.equal(forbidden.status,403);
const invalid=await request('/functions/v1/ofek-demo',{method:'POST',token,body:{state:{courses:'not-an-array'}}});assert.equal(invalid.status,400);
console.log('PASS: real authentication, data load, missing/invalid token rejection, anonymous denial, owner isolation, invalid input rejection.');
