import Link from "next/link";
import { GuessMap } from "../../components/guess-map";

export default function GamePage() {
  return (
    <main className="game-page">
      <header className="game-header">
        <Link className="wordmark" href="/">Kiwi<span>Quest</span></Link>
        <p>Practice round 01</p>
      </header>
      <GuessMap />
    </main>
  );
}
