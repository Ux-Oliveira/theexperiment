import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(true);
  const [showAgeModal, setShowAgeModal] = useState(false);

  return (
    <div className="home">

      {showVideo && (
        <div className="video-wrapper">
          <video
            className="banner-video"
            autoPlay
            loop
            muted
            onClick={() =>
              window.open("https://youtube.com/@ricksahuman", "_blank")
            }
          >
            <source src="/corn.mp4" type="video/mp4" />
          </video>

          <div
            className="close-video"
            onClick={() => setShowVideo(false)}
          >
            ×
          </div>
        </div>
      )}

      <div className="quadrant-container">

        <div
          title="Movie-based minigame"
          className="quadrant"
          onClick={() => window.open("https://leaderbox.co", "_blank")}
        >
          <img src="/box.gif" />
          <div id="cardname" className="title">LeaderBox</div>
        </div>

        <div
          title="Get your tarot reading today"
          className="quadrant"
          onClick={() => navigate("/tarot")}
        >
          <img src="/witch.png" />
          <div id="cardname" className="title">Tarot Express</div>
        </div>

        <div
          title="Vids to gifs for Piffy"
          className="quadrant"
          onClick={() => window.open("https://vidtogif.vercel.app", "_blank")}
        >
          <img src="/gify.gif" />
          <div id="cardname" className="title">VidToGif</div>
        </div>

        <div
          title="After Dark Reading"
          className="quadrant"
          onClick={() => {
            const accepted = localStorage.getItem("ltarot18");

            if (accepted === "yes") {
              navigate("/ltarot");
            } else {
              setShowAgeModal(true);
            }
          }}
        >
          <img src="/afterback.png" />
          <div id="cardname" className="title">Tarot After Dark</div>
        </div>

        <div
          title="What Goes Here?"
          className="quadrant"
          /*onClick={() => window.open("", "_blank")}*/
        >
          <img src="/placeholder.png" />
          <div id="cardname" className="title">What Goes Here?</div>
        </div>

        <div
          title="What Goes Here?"
          className="quadrant"
          /*onClick={() => window.open("", "_blank")}*/
        >
          <img src="/placeholder.png" />
          <div id="cardname" className="title">What Goes Here?</div>
        </div>

        <div
          title="What Goes Here?"
          className="quadrant"
          /*onClick={() => window.open("", "_blank")}*/
        >
          <img src="/placeholder.png" />
          <div id="cardname" className="title">What Goes Here?</div>
        </div>

        <div
          title="What Goes Here?"
          className="quadrant"
          /*onClick={() => window.open("", "_blank")}*/
        >
          <img src="/placeholder.png" />
          <div id="cardname" className="title">What Goes Here?</div>
        </div>

        <div
          title="What Goes Here?"
          className="quadrant"
          /*onClick={() => window.open("", "_blank")}*/
        >
          <img src="/placeholder.png" />
          <div id="cardname" className="title">What Goes Here?</div>
        </div>

      </div>

      {showAgeModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowAgeModal(false)}
        >
          <div
            className="modal"
            id="modaltext"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Are you over 18?</h3>

            <div style={{ marginTop: "20px", display: "flex", gap: "15px", justifyContent: "center" }}>
              <button
                className="generate-btn"
                onClick={() => {
                  localStorage.setItem("ltarot18", "yes");
                  navigate("/ltarot");
                }}
              >
                Yes
              </button>

              <button
                className="generate-btn"
                onClick={() => setShowAgeModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
