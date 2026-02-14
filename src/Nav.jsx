import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Nav.css";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isTarot = location.pathname === "/tarot";

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <div
            className="computer-icon"
            onClick={() => {
              if (isTarot) {
                navigate("/");
              } else {
                setOpen(true);
              }
            }}
          >
            <i
              className={`fa-solid ${
                isTarot ? "fa-house" : "fa-computer"
              }`}
            ></i>
          </div>
        </div>

        <div className="nav-right">
          <h1 className="experiment-title">The Experiment</h1>
        </div>
      </nav>

      {!isTarot && open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal" id="modaltext" onClick={(e) => e.stopPropagation()}>
            This website is a collective effort. Whatever you want goes on it!
          </div>
          <div className="modal" id="modaltext"><a id="modaltext" href="https://youtube.com/@ricksahuman" target="_blank">Check out the channel on YT!</a></div>
        </div>
      )}
    </>
  );
}
