// pages/index.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main style={{minHeight:"100vh",display:"grid",placeItems:"center",background:"#0c1420",color:"#c9d1d9"}}>
      <div style={{textAlign:"center"}}>
        <h1 style={{color:"#fff",fontSize:28,marginBottom:12}}>ClinicaAI App</h1>
        <p style={{marginBottom:16}}>This is a minimal landing page for the Vercel app.</p>
        <Link href="/signup" style={{padding:"10px 14px",borderRadius:12,background:"#2a3342",border:"1px solid #3a465a",color:"#fff",textDecoration:"none"}}>
          Go to /signup
        </Link>
      </div>
    </main>
  );
}
