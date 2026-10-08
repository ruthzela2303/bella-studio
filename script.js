// --- FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyCGSVHmsq_kssWtE7TyEIyVfH_KQI8xjeI",
  authDomain: "bella-c0a0d.firebaseapp.com",
  projectId: "bella-c0a0d"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

let currentRole = 'duena';
const DUENA_EMAIL = 'admin@bellastudio.com';
const DUENA_PASS = 'dueña123';

function toggleTheme(){
 const b=document.body;
 const isDark=b.getAttribute('data-theme')==='dark';
 b.setAttribute('data-theme', isDark?'light':'dark');
 localStorage.setItem('theme', isDark?'light':'dark');
}
function setRole(role){
 currentRole=role;
 document.getElementById('tab-duena').classList.toggle('active', role==='duena');
 document.getElementById('tab-clienta').classList.toggle('active', role==='clienta');
 document.getElementById('login-duena').style.display=role==='duena'?'block':'none';
 document.getElementById('login-clienta').style.display=role==='clienta'?'block':'none';
}
function showRegister(){
 document.getElementById('form-login-clienta').style.display='none';
 document.getElementById('form-register-clienta').style.display='block';
}
function showLogin(){
 document.getElementById('form-login-clienta').style.display='block';
 document.getElementById('form-register-clienta').style.display='none';
}

// DUEÑA
async function loginDuena(){
 const email=document.getElementById('emailDuena').value.trim().toLowerCase();
 const pass=document.getElementById('passDuena').value.trim();
 if(!email.includes('@') || pass.length<5){ alert('Datos no válidos'); return; }
 if(email!==DUENA_EMAIL || pass!==DUENA_PASS){ alert('Solo dueña autorizada'); return; }
 try{
  await auth.signInWithEmailAndPassword(email, pass);
 }catch(e){
  if(e.code==='auth/user-not-found'){
    await auth.createUserWithEmailAndPassword(email, pass);
  }
 }
 localStorage.setItem('role','duena');
 localStorage.setItem('userEmail', email);
 window.location.href='duena.html';
}

// CLIENTA REGISTRO - FIX: guarda en 'clientes' que es donde lee duena.html
async function registerClienta(){
 const nombre=document.getElementById('regNombre').value.trim();
 const email=document.getElementById('regEmail').value.trim().toLowerCase();
 const pass=document.getElementById('regPass').value.trim();
 if(!nombre ||!email.includes('@') || pass.length<5){ alert('Completa todo bien'); return; }
 try{
   await auth.createUserWithEmailAndPassword(email, pass);
   // Guarda en COLECCION CORRECTA: clientes
   await db.collection('clientes').doc(email).set({
     nombre: nombre,
     email: email,
     puntos: 0,
     canjeados: 0,
     creado: firebase.firestore.FieldValue.serverTimestamp()
   }, {merge:true});
   localStorage.setItem('role','clienta');
   localStorage.setItem('userName', nombre);
   localStorage.setItem('userEmail', email);
   window.location.href='clienta.html';
 }catch(e){
   alert('Error Firebase: '+e.message);
 }
}

// CLIENTA LOGIN - FIX: lee de 'clientes' primero
async function loginClienta(){
 const email=document.getElementById('emailClienta').value.trim().toLowerCase();
 const pass=document.getElementById('passClienta').value.trim();
 if(!email.includes('@') || pass.length<5){ alert('Datos no válidos'); return; }
 if(email===DUENA_EMAIL){ alert('Entra por Dueña'); return; }
 try{
   await auth.signInWithEmailAndPassword(email, pass);
   let doc = await db.collection('clientes').doc(email).get();
   if(!doc.exists){
     doc = await db.collection('clientas').doc(email).get(); // fallback por si es cuenta vieja
   }
   if(!doc.exists){ alert('Cuenta no encontrada, regístrate de nuevo'); return; }
   const user = doc.data();
   localStorage.setItem('role','clienta');
   localStorage.setItem('userName', user.nombre || email.split('@')[0]);
   localStorage.setItem('userEmail', user.email || email);
   window.location.href='clienta.html';
 }catch(e){
   console.error(e);
   alert('Correo o contraseña incorrectos');
 }
}

const savedTheme=localStorage.getItem('theme');
if(savedTheme){ document.body.setAttribute('data-theme', savedTheme); }
