import { useState, useEffect } from "react";

const numberMap = {
  ace: "ace",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
  ten: "10",
  page: "page",
  knight: "knight",
  queen: "queen",
  king: "king",
};

export default function LTarot() {
  const [started, setStarted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [cards, setCards] = useState([]);
  const [overall, setOverall] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [deepOpen, setDeepOpen] = useState(false);
  const [fallbacks, setFallbacks] = useState({});

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tarotHistory")) || [];
    setHistory(saved);
  }, []);

  const buildImagePath = (card) => {
    const name = card.name.toLowerCase();

    if (!name.includes(" of ")) {
      const formatted = name.replace(/[^a-z0-9]/g, "");
      return `/ltarot/trumps/${formatted}.png`;
    }

    const [valueWord, suit] = name.split(" of ");
    const value = numberMap[valueWord] || valueWord;

    const formatted = `${value}of${suit}`.replace(/\s/g, "").toLowerCase();
    return `/ltarot/${suit}/${formatted}.png`;
  };

  const cleanText = (text) => text.replace(/[-—–]+/g, ",");

  const formatMeaning = (card, reversed) => {
    let base = reversed ? card.meaning_rev : card.meaning_up;
    base = cleanText(base).toLowerCase();

    return reversed
      ? `${card.name} reversed hints that ${base}`
      : `${card.name} suggests that ${base}`;
  };

  const buildOverallReading = (cards) => {
    const reversedCount = cards.filter(c => c.reversed).length;
    const cardNames = cards.map(c => c.name).join(", ");
    const randomCard = cards[Math.floor(Math.random() * cards.length)].name;

    const aligned = [
      "There's a smooth confidence in the air, lean into what feels good and let yourself enjoy the moment.",
      "The energy in you feels warm and inviting. Whatever it is, let in. Don't overthink.",
      "Things feel naturally magnetic, trust your curiosity and let yourself be pulled.",
      `With ${randomCard} showing up strong, attraction and confidence are working in your favor.`,
      `The combination of ${cardNames} suggest things might get deeper than you think.`,
      "You're giving off too much of a glow. People are noticing things more than you know",
      "Don't rush the play, enjoy your time and let yourself go.",
      "Confidence is your strong language right now, speak it fluently.",
      "This is one of those moments where the leaning in feels better than holding back",
    ];

    const mixed = [
      "There's chemistry here but timming matters. Beware of that alleyway and let things unfold naturally.",
      "Something intriguing is forming, but a little restraint might make the release feel more pleasurable.",
      "The energy is flirtatious yet uncertain.",
      `With ${randomCard} here, subtlety may take you two further.`,
      `The blend of ${cardNames} suggests an attraction has been building for a while.`,
      "There's tension in the best way.",
      "Not everything needs definition now. Enjoy the ambiguity.",
      "A slow burn is more satisfying than an instant answer.",
      "Let intrigue do the heavy lifting now.",
    ];

    const blocked = [
      "Something feels slightly offbeat, take a step back and reassess.",
      "The mood may feel tangled. Breathe and find clarity.",
      "Not every spark needs chasing.",
      `With ${randomCard} turning things on, reflection might be better than reaction.`,
      `The presence of ${cardNames} hints at mixed signals.`,
      "Pause before making any moves.",
      "Give yourself some alone time and space.",
      "Mystery works both ways.",
      "Let things cool slightly, balance makes everything more compelling.",
    ];

    let pool;
    if (reversedCount === 0) pool = aligned;
    else if (reversedCount === 1) pool = mixed;
    else pool = blocked;

    return pool[Math.floor(Math.random() * pool.length)];
  };

  const startReading = async () => {
    setStarted(true);
    setRevealed(false);
    setDeepOpen(false);
    setFallbacks({});

    const res = await fetch("https://tarotapi.dev/api/v1/cards/random?n=3");
    const data = await res.json();

    const randomized = data.cards.map((card) => {
      const reversed = Math.random() < 0.5;
      return {
        name: card.name,
        image: buildImagePath(card),
        reversed,
        meaning: formatMeaning(card, reversed),
      };
    });

    setCards(randomized);

    setTimeout(() => {
      setRevealed(true);

      const overallText = buildOverallReading(randomized);
      setOverall(overallText);

      const newHistory = [
        { date: new Date().toLocaleString(), text: overallText },
        ...history,
      ].slice(0, 3);

      setHistory(newHistory);
      localStorage.setItem("tarotHistory", JSON.stringify(newHistory));

      setTimeout(() => {
        window.scrollBy({ top: 250, behavior: "smooth" });
      }, 200);
    }, 2000);
  };

  const handleImageError = (index) => {
    setFallbacks(prev => ({ ...prev, [index]: true }));
  };

  return (
    <div className="tarot-page ltarot-page">

      {/* Crystal Ball */}
      {history.length > 0 && (
        <div className="crystal-ball" onClick={() => setHistoryOpen(true)}>
          <i className="fa-solid fa-gem"></i>
        </div>
      )}

      {!started && (
        <>
          <h1 className="tarot-title">After Dark Reading</h1>
          <button className="generate-btn" onClick={startReading}>
            Get it on
          </button>
        </>
      )}

      {started && (
        <>
          <div className="cards-container">
            {cards.map((card, i) => {
              const isFallback = fallbacks[i];
              const src = isFallback
                ? "/ltarot/wands/pageofwands.png"
                : revealed
                ? card.image
                : "/ltarot/lbackcard.png";

              return (
                <div key={i} className={`card ${!revealed ? "spin" : ""}`}>
                  <img
                    src={src}
                    decoding="async"
                    loading="eager"
                    onError={() => handleImageError(i)}
                    style={{
                      transform: card.reversed ? "rotate(180deg)" : "rotate(0deg)",
                      filter: isFallback ? "blur(12px) brightness(0.7)" : "none",
                      willChange: "transform, filter",
                    }}
                  />
                  {revealed && (
                    <div className="card-meaning-modal">
                      <div className="card-meaning-content">
                        <strong>
                          {card.name} {card.reversed && "(Reversed)"}
                        </strong>
                        <p>{card.meaning}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {revealed && (
            <div style={{ marginTop: "40px" }}>
              <button className="generate-btn" onClick={() => setDeepOpen(true)}>
                Dig Deeper
              </button>
            </div>
          )}
        </>
      )}

      {/* Overall Modal */}
      {deepOpen && (
        <div className="modal-overlay" onClick={() => setDeepOpen(false)}>
          <div
            className="modal constrained-modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "rgba(0,0,0,0.75)",
              maxWidth: "500px",
              textAlign: "center",
            }}
          >
            <h2>Overall Message</h2>
            <p>{overall}</p>
          </div>
        </div>
      )}

      {/* History Modal */}
      {historyOpen && (
        <div className="modal-overlay" onClick={() => setHistoryOpen(false)}>
          <div
            className="modal constrained-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Previous Readings</h2>
            {history.map((item, index) => (
              <div key={index} style={{ marginBottom: "15px" }}>
                <strong>{item.date}</strong>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
