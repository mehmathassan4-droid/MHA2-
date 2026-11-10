/* MHA Supabase compatibility layer. Stores the legacy app's document-shaped records
   in public.mha_documents so the existing MHA screens can be retained. */
(function(){
  const SUPABASE_URL='https://unmhvzdcycljpdlezlvw.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY='sb_publishable_jEodaHX6OSm1aE7KmmaFfg_Dn-hu-nJ';
  const sb=supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  const uid=u=>u?.id||u?.uid||null;
  const mapUser=u=>u?{uid:u.id,id:u.id,email:u.email,displayName:u.user_metadata?.display_name||u.email?.split('@')[0]}:null;
  const stamp=()=>new Date().toISOString();
  const clone=x=>JSON.parse(JSON.stringify(x,(k,v)=>v&&v.__mhaIncrement!==undefined?v.__mhaIncrement:v));
  function snapDoc(row){return {id:row.id,exists:!!row,data:()=>clone(row.data||{})};}
  class Query {
    constructor(col,id=null){this.col=col;this.id=id;this.filters=[];this.sort=null;this.max=null;}
    where(k,op,v){this.filters.push([k,op,v]);return this;}
    orderBy(k,dir='asc'){this.sort=[k,dir];return this;}
    limit(n){this.max=n;return this;}
    doc(id){return new Query(this.col,id||crypto.randomUUID());}
    async _rows(){
      let q=sb.from('mha_documents').select('id,data').eq('collection',this.col);
      if(this.id)q=q.eq('id',String(this.id));
      const {data,error}=await q; if(error)throw error;
      let rows=(data||[]).map(r=>({id:r.id,data:r.data||{}}));
      rows=rows.filter(r=>this.filters.every(([k,op,v])=>{const a=r.data?.[k];switch(op){case '==':case '===':return a===v;case '!=':return a!==v;case '>':return a>v;case '>=':return a>=v;case '<':return a<v;case '<=':return a<=v;case 'in':return Array.isArray(v)&&v.includes(a);default:return false;}}));
      if(this.sort){const [k,d]=this.sort;rows.sort((a,b)=>{const x=a.data?.[k],y=b.data?.[k];const xx=x??'',yy=y??'';return (xx>yy?1:xx<yy?-1:0)*(d==='desc'?-1:1)});}
      if(this.max!=null)rows=rows.slice(0,this.max);
      return rows;
    }
    async get(){const rows=await this._rows();if(this.id)return {exists:!!rows[0],id:this.id,data:()=>clone(rows[0]?.data||{})};return {docs:rows.map(snapDoc),empty:!rows.length,size:rows.length};}
    async set(data,opts={}){const id=String(this.id||crypto.randomUUID());let payload=clone(data||{});if(this.col==='profiles'&&!opts.merge){const {data:sessionData}=await sb.auth.getSession();if(!sessionData.session){const {error:rpcError}=await sb.rpc('mha_create_profile_request',{p_user_id:id,p_email:payload.email,p_requested_role:payload.requestedRole||'booker'});if(rpcError)throw rpcError;return {id};}}if(opts.merge){const old=await this.get().catch(()=>({exists:false,data:()=>({})}));payload={...(old.exists?old.data():{}),...payload};}const {error}=await sb.from('mha_documents').upsert({collection:this.col,id,data:payload,updated_at:stamp()},{onConflict:'collection,id'});if(error)throw error;return {id};}
    async add(data){const id=crypto.randomUUID();await this.doc(id).set(data);return {id};}
    async update(data){const old=await this.get();if(!old.exists)throw new Error(`Record ${this.id} does not exist in ${this.col}`);const current=old.data(),next={...current};for(const [k,v] of Object.entries(data||{})){if(v&&typeof v==='object'&&v.__mhaIncrement!==undefined)next[k]=Number(current[k]||0)+Number(v.__mhaIncrement);else next[k]=v;}return this.set(next);}
    async delete(){const {error}=await sb.from('mha_documents').delete().eq('collection',this.col).eq('id',String(this.id));if(error)throw error;}
  }
  const db={collection:n=>new Query(n),batch:()=>{const ops=[];return {set:(r,d,o)=>ops.push(()=>r.set(d,o)),update:(r,d)=>ops.push(()=>r.update(d)),delete:r=>ops.push(()=>r.delete()),commit:async()=>{for(const f of ops)await f();return true;}};}};
  db.enablePersistence=async()=>{};
  const auth={
    onAuthStateChanged(cb){let live=true;const {data:{subscription}}=sb.auth.onAuthStateChange((_e,s)=>{if(live)cb(mapUser(s?.user));});return()=>{live=false;subscription.unsubscribe();};},
    async signInWithEmailAndPassword(email,password){const {data,error}=await sb.auth.signInWithPassword({email,password});if(error)throw error;return {user:mapUser(data.user)};},
    async createUserWithEmailAndPassword(email,password){const {data,error}=await sb.auth.signUp({email,password,options:{data:{display_name:email.split('@')[0]}}});if(error)throw error;return {user:mapUser(data.user)};},
    async signOut(){const {error}=await sb.auth.signOut();if(error)throw error;},
    async currentUser(){const {data}=await sb.auth.getUser();return mapUser(data.user);}
  };
  window.supabaseClient=sb;
  window.firebase={apps:[{}],auth:()=>auth,firestore:()=>db};
  window.firebase.firestore.FieldValue={serverTimestamp:stamp,increment:n=>({__mhaIncrement:Number(n||0)})};
})();
