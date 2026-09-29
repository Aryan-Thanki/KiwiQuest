import Link from "next/link";

export default function Home() {
  return (
    <main>
      <nav className="site-nav" aria-label="Main navigation">
        <Link className="wordmark" href="/">Kiwi<span>Quest</span></Link>
        <div className="nav-links">
          <a href="#how-to-play">How to play</a>
          <Link className="nav-play" href="/game">Play now</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">New Zealand, one pin at a time</p>
          <h1>How well do you know Aotearoa?</h1>
          <p className="hero-description">
            Explore a mystery spot, read the landscape, and drop your pin as close
            to the real location as you can.
          </p>
          <Link className="button button-primary" href="/game">Start a round <span aria-hidden="true">→</span></Link>
        </div>
        <div className="hero-landscape" aria-label="Stylised New Zealand landscape">
          <div className="sun" />
          <div className="mountain mountain-back" />
          <div className="mountain mountain-front" />
          <div className="lake" />
          <div className="fern fern-one">✦</div>
          <div className="fern fern-two">✦</div>
          <p>Can you pinpoint it?</p>
        </div>
      </section>

      <section className="how-to-play" id="how-to-play">
        <p className="eyebrow">The rules are simple</p>
        <h2>Explore. Pin. Score.</h2>
        <div className="steps">
          <article><span>01</span><h3>Explore the scene</h3><p>Use clues in the landscape, road signs, and surroundings.</p></article>
          <article><span>02</span><h3>Place your pin</h3><p>Click the map where you think the location is.</p></article>
          <article><span>03</span><h3>See how close you got</h3><p>Your score rewards accurate guesses—every kilometre matters.</p></article>
        </div>
      </section>
    </main>
  );
}
