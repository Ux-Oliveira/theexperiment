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
      return `/ltarot/trumps/${formatted}.png`;
    } //ill create a new folder for the lewd cards

    const [valueWord, suit] = name.split(" of ");
    const value = numberMap[valueWord] || valueWord;

    const formatted = `${value}of${suit}`
      .replace(/\s/g, "")
      .toLowerCase();

    return `/ltarot/${suit}/${formatted}.png`;
  };

  //remove any dash present in the API card description and replacing it with a comma
  const cleanText = (text) => {
    return text.replace(/[-—–]+/g, ",");
  };

  const formatMeaning = (card, reversed) => {
    let base = reversed ? card.meaning_rev : card.meaning_up;
    base = cleanText(base).toLowerCase();

    const flirtOpeners = [
      "There's a certain tension here",
      "You may notice a certain spark building",
      "Are you happy to see me or...",
      "The energy is undeniably magnetic",
      "Something feels a little charged",
    ];

    const opener = flirtOpeners[Math.floor(Math.random() * flirtOpeners.length)];

    return reversed
      ? `${card.name} reversed hints that ${base.toLowerCase()}`
      : `${card.name} suggests that ${base.toLowerCase()}`;
  };

  //here i add a precise overall meaning 

  const buildOverallReading = (cards) => {
  const reversedCount = cards.filter(c => c.reversed).length;

  const cardNames = cards.map(c => c.name).join(", ");
  const randomCard = cards[Math.floor(Math.random() * cards.length)].name;

  const alignedMessages = [
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

  const mixedMessages = [
    "There's chemistry here but timming matters. Beware of that alleyway and let things unfold naturally.",
    "Something intriguing is forming, but a little restraint might make the release feel more pleasurable.",
    "The energy is flirtatious yet uncertain, sometimes you gotta ask yourself: would it be worth potentially losing a kidney?",
    `With ${randomCard} here, subtlety may take you two further.`,
    `The blend of ${cardNames} suggests an attraction has been building for a while. But one of ya'll is playin.`,
    "There's tension in the best wat, sometimes a little roughness is needed to resolve that.",
    "Not everything needs definition now. Enjoy the ambiguity.",
    "A slow burn is more satisfying than an instant answer. But the time to answer is now!",
    "Let intrigue do the heavy lifting now. Lean against the wall.",
  ];

  const blockedMessages = [
    "Something feels slightly offbeat, step back and ask yourself who they voted for.",
    "The mood may feel tangled. Take a step back and breathe so you can see things more clearly.",
    "Not every spark needs chasing. Sometimes the edge feels just as good.",
    `With ${randomCard} turning things on, reflaction might be better than reaction.`,
    `The presence of ${cardNames} hints that your mixed signals are justified. They're not who they say they are.`,
    "Pause before sliding in anything. Self-assurance is the best rubber!",
    "Give yourself some alone time and some room to rest. Preferably one you can be as loud as you want in.",
    "Mystery works both ways. They think you're a murderer too. Don't loose yourself trying to resolve that enigma.",
    "LEt things cool slightly, balance makes everything more compelling.",
  ];

  let pool;

  if (reversedCount === 0) pool = alignedMessages;
  else if (reversedCount === 1) pool = mixedMessages;
  else pool = blockedMessages;

  return pool[Math.floor(Math.random() * pool.length)];
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
          <h1 className="tarot-title">After Dark Reading</h1>
          <button className="generate-btn" onClick={startReading}>
            Get it on
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
                      : "/ltarot/backcard.png"
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
                Reveal the mood
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
            <h2>Overall Energy</h2>
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
            <h2>Previous Nights</h2>
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
