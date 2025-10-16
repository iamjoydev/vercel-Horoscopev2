import Link from "next/link";

export default function Home() {
  return (
    <main style={{padding:24,maxWidth:1000,margin:"0 auto"}}>
      <h1 style={{color:"#4f46e5"}}>ðŸ”® Vedic Horoscope (Bengali) â€” API</h1>
      <p>This site exposes an API at <code>/api/horoscope</code> which returns daily horoscope JSON.</p>
      <p><Link href="/api/horoscope"><a>Open API</a></Link></p>
    </main>
  );
}