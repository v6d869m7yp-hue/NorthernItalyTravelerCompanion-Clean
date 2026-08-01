(()=>{
'use strict';
window.IVTC=window.IVTC||{};
const VERSION='1.0.0';
function requireState(){const s=window.IVTC.firebase?._state;if(!s?.user||!s.db||!s.api)throw new Error('Sign in to Firebase first.');return s;}
function activeTripId(){return window.IVTC.tripCloud?.selectedTrip?.().id||localStorage.getItem('ivtc.activeTripId');}
function emailOf(s){return String(s.user.email||'').trim().toLowerCase();}
function cleanRole(role){return role==='viewer'?'viewer':'editor';}
function serial(v){if(!v)return null;if(typeof v==='string')return v;if(v.toDate)return v.toDate().toISOString();if(v.seconds)return new Date(v.seconds*1000).toISOString();return String(v);}
function view(doc){const d=doc.data?doc.data():doc;return {id:doc.id||d.id,...d,createdAt:serial(d.createdAt),updatedAt:serial(d.updatedAt),acceptedAt:serial(d.acceptedAt),revokedAt:serial(d.revokedAt)};}
async function trip(){const s=requireState(),id=activeTripId();if(!id)throw new Error('Choose an active trip first.');const ref=s.api.doc(s.db,'trips',id),snap=await s.api.getDoc(ref);if(!snap.exists())throw new Error('The active cloud trip could not be found.');let data=snap.data();if(data.ownerUid===s.user.uid&&(!Array.isArray(data.memberUids)||!data.memberUids.includes(s.user.uid)||!data.roles?.[s.user.uid])){const memberUids=[...new Set([...(Array.isArray(data.memberUids)?data.memberUids:[]),s.user.uid])],roles={...(data.roles||{}),[s.user.uid]:'owner'};await s.api.updateDoc(ref,{memberUids,roles,travelers:memberUids.length,updatedAt:s.api.serverTimestamp()});data={...data,memberUids,roles,travelers:memberUids.length};}return {id:snap.id,...data};}
async function createInvite(email,role='editor'){
 const s=requireState(),t=await trip(),normalized=String(email||'').trim().toLowerCase();
 if(t.ownerUid!==s.user.uid)throw new Error('Only the trip owner can invite travelers.');
 if(!/^\S+@\S+\.\S+$/.test(normalized))throw new Error('Enter a valid email address.');
 if(normalized===emailOf(s))throw new Error('You are already the owner of this trip.');
 const pending=s.api.query(s.api.collection(s.db,'invitations'),s.api.where('tripId','==',t.id),s.api.where('email','==',normalized),s.api.where('status','==','pending'));
 const existing=await s.api.getDocs(pending);if(!existing.empty)throw new Error('A pending invitation already exists for this email.');
 const ref=s.api.doc(s.api.collection(s.db,'invitations'));
 await s.api.setDoc(ref,{tripId:t.id,tripLabel:t.label||'Shared trip',email:normalized,role:cleanRole(role),status:'pending',inviterUid:s.user.uid,inviterEmail:emailOf(s),createdAt:s.api.serverTimestamp(),updatedAt:s.api.serverTimestamp()});
 return ref.id;
}
async function listTripInvites(){const s=requireState(),id=activeTripId();if(!id)return[];const q=s.api.query(s.api.collection(s.db,'invitations'),s.api.where('tripId','==',id));const snap=await s.api.getDocs(q);return snap.docs.map(view).sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')));}
async function listMyInvites(){const s=requireState(),email=emailOf(s);if(!email)return[];const q=s.api.query(s.api.collection(s.db,'invitations'),s.api.where('email','==',email),s.api.where('status','==','pending'));const snap=await s.api.getDocs(q);return snap.docs.map(view).sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')));}
async function acceptInvite(inviteId){
 const s=requireState(),email=emailOf(s),inviteRef=s.api.doc(s.db,'invitations',inviteId);
 let acceptedTrip=null;
 await s.api.runTransaction(s.db,async tx=>{
  const invSnap=await tx.get(inviteRef);if(!invSnap.exists())throw new Error('This invitation no longer exists.');
  const inv=invSnap.data();if(inv.status!=='pending')throw new Error('This invitation is no longer pending.');
  if(String(inv.email||'').toLowerCase()!==email)throw new Error('This invitation belongs to a different Firebase account.');
  const tripRef=s.api.doc(s.db,'trips',inv.tripId),tripSnap=await tx.get(tripRef);if(!tripSnap.exists())throw new Error('The invited trip no longer exists.');
  const t=tripSnap.data(),members=[...new Set([...(t.memberUids||[]),s.user.uid])],roles={...(t.roles||{}),[s.user.uid]:cleanRole(inv.role)};
  tx.update(inviteRef,{status:'accepted',acceptedUid:s.user.uid,acceptedAt:s.api.serverTimestamp(),updatedAt:s.api.serverTimestamp()});
  tx.update(tripRef,{memberUids:members,roles,travelers:members.length,lastAcceptedInviteId:inviteId,updatedAt:s.api.serverTimestamp()});
  acceptedTrip={id:tripSnap.id,...t,memberUids:members,roles};
 });
 window.IVTC.tripCloud?.selectTrip?.(acceptedTrip);return acceptedTrip;
}
async function revokeInvite(inviteId){const s=requireState(),ref=s.api.doc(s.db,'invitations',inviteId);await s.api.updateDoc(ref,{status:'revoked',revokedAt:s.api.serverTimestamp(),updatedAt:s.api.serverTimestamp()});}
async function removeMember(uid){
 const s=requireState(),t=await trip();if(t.ownerUid!==s.user.uid)throw new Error('Only the trip owner can remove travelers.');if(uid===t.ownerUid)throw new Error('The owner cannot be removed.');
 const members=(t.memberUids||[]).filter(x=>x!==uid),roles={...(t.roles||{})};delete roles[uid];
 await s.api.updateDoc(s.api.doc(s.db,'trips',t.id),{memberUids:members,roles,travelers:members.length,updatedAt:s.api.serverTimestamp()});
}
async function changeRole(uid,role){const s=requireState(),t=await trip();if(t.ownerUid!==s.user.uid)throw new Error('Only the trip owner can change roles.');if(uid===t.ownerUid)throw new Error('The owner role cannot be changed.');const roles={...(t.roles||{}),[uid]:cleanRole(role)};await s.api.updateDoc(s.api.doc(s.db,'trips',t.id),{roles,updatedAt:s.api.serverTimestamp()});}
window.IVTC.collaboration=Object.freeze({version:VERSION,trip,createInvite,listTripInvites,listMyInvites,acceptInvite,revokeInvite,removeMember,changeRole});
})();
