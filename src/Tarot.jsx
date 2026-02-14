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

export default function Tarot() {
  const [started, setStarted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [cards, setCards] = useState([]);
  const [overall, setOverall] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [deepOpen, setDeepOpen] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tarotHistory")) || [];
    setHistory(saved);
  }, []);

  const buildImagePath = (card) => {
    const name = card.name.toLowerCase();

    if (!name.includes(" of ")) {
      const formatted = name.replace(/[^a-z0-9]/g, "");
      return `/tarotcards/trumps/${formatted}.png`;
    }

    const [valueWord, suit] = name.split(" of ");
    const value = numberMap[valueWord] || valueWord;

    const formatted = `${value}of${suit}`
      .replace(/\s/g, "")
      .toLowerCase();

    return `/tarotcards/${suit}/${formatted}.png`;
  };

  //remove any dash present in the API card description and replacing it with a comma
  const cleanText = (text) => {
    return text.replace(/[-—–]+/g, ",");
  };

  const formatMeaning = (card, reversed) => {
    let base = reversed ? card.meaning_rev : card.meaning_up;
    base = cleanText(base);

    return reversed
      ? `${card.name} reversed suggests ${base.toLowerCase()}`
      : `${card.name} suggests ${base.toLowerCase()}`;
  };

  //here i add a precise overall meaning 

  const buildOverallReading = (cards) => {
  const reversedCount = cards.filter(c => c.reversed).length;

  const cardNames = cards.map(c => c.name).join(", ");
  const randomCard = cards[Math.floor(Math.random() * cards.length)].name;

  const alignedMessages = [
    "Things are lining up in your favor, move with confidence.",
    "You are in a strong position, trust yourself and take action.",
    "Momentum is building, this is a time to step forward boldly.",
    `The presence of ${randomCard} strengthens your path, proceed without hesitation.`,
    `The cards ${cardNames} point toward forward motion, stay decisive.`,
    "Clarity surrounds you, act with certainty.",
    "Energy is steady and supportive, keep going.",
    "You are aligned with the direction ahead, continue confidently.",
    "Progress feels natural right now, trust the flow."
  ];

  const mixedMessages = [
    "There is progress here, but something needs your attention.",
    "You are close to clarity, adjust slightly and continue.",
    "Energy is shifting, stay aware and move carefully.",
    `With ${randomCard} in play, reflection will strengthen your outcome.`,
    `The combination of ${cardNames} suggests movement, but with caution.`,
    "One area requires focus, everything else is unfolding.",
    "Stay alert, small adjustments will make a difference.",
    "You are on the right track, refine your approach.",
    "Balance action with awareness, results will follow."
  ];

  const blockedMessages = [
    "There is tension beneath the surface, slow down before deciding.",
    "Something feels misaligned, reflect before pushing forward.",
    "Pause, reassess, and regain your balance.",
    `The influence of ${randomCard} signals inner resistance, take time to recalibrate.`,
    `The cards ${cardNames} suggest conflicting energies, clarity comes through patience.`,
    "Do not rush this moment, perspective is needed.",
    "Step back briefly, insight will surface.",
    "Stability must return before action is taken.",
    "Careful evaluation now prevents regret later."
  ];

  let pool;

  if (reversedCount === 0) pool = alignedMessages;
  else if (reversedCount === 1) pool = mixedMessages;
  else pool = blockedMessages;

  const randomMessage = pool[Math.floor(Math.random() * pool.length)];

  return cleanText(randomMessage);
};







  const startReading = async () => {
    setStarted(true);
    setRevealed(false);
    setDeepOpen(false);

    const res = await fetch(
      "https://tarotapi.dev/api/v1/cards/random?n=3"
    );
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
        window.scrollBy({
          top: 250,
          behavior: "smooth",
        });
      }, 200);

    }, 2000);
  };

  return (
    <div className="tarot-page">

      {history.length > 0 && (
        <div
          className="crystal-ball"
          onClick={() => setHistoryOpen(true)}
        >
          <i className="fa-solid fa-gem"></i>
        </div>
      )}

      {!started && (
        <>
          <h1 className="tarot-title">Your Tarot Reading of the Day</h1>
          <button className="generate-btn" onClick={startReading}>
            Generate Reading
          </button>
        </>
      )}

      {started && (
        <>
          <div className="cards-container">
            {cards.map((card, i) => (
              <div key={i} className={`card ${!revealed ? "spin" : ""}`}>
                <img
                  src={
                    revealed
                      ? card.image
                      : "/tarotcards/backcard.png"
                  }
                  style={{
                    transform: card.reversed
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                />
                {revealed && (
                  <div className="card-meaning-modal">
                    <div className="card-meaning-content">
                      <strong id="cardname">
                        {card.name}{" "}
                        {card.reversed && "(Reversed)"}
                      </strong>
                      <p>{card.meaning}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {revealed && (
            <div style={{ marginTop: "40px" }}>
              <button
                className="generate-btn"
                onClick={() => setDeepOpen(true)}
              >
                Dig Deeper
              </button>
            </div>
          )}
        </>
      )}

      {deepOpen && (
        <div
          className="modal-overlay"
          onClick={() => setDeepOpen(false)}
        >
          <div
            className="modal constrained-modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "rgba(0,0,0,0.75)",
              maxWidth: "500px",
              textAlign: "center"
            }}
          >
            <h2>Overall Message</h2>
            <p>{overall}</p>
          </div>
        </div>
      )}

      {historyOpen && (
        <div
          className="modal-overlay"
          onClick={() => setHistoryOpen(false)}
        >
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
