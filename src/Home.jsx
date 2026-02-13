import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(true);

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
          onClick={() => window.open("https:vidtogif.vercel.app", "_blank")}
        >
          <img src="/gify.gif" />
          <div id="cardname" className="title">VidToGif</div>
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

        <div
          title="What Goes Here?"
          className="quadrant"
          /*onClick={() => window.open("", "_blank")}*/
        >
          <img src="/placeholder.png" />
          <div id="cardname" className="title">What Goes Here?</div>
        </div>



      </div>
    </div>
  );
}
