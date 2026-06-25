import React from "react";
import { useStore } from "../store/useStore";
import "./NotesWidget.css";

const NotesWidget = () => {
  const notes = useStore((state) => state.notes);
  const setNotes = useStore((state) => state.setNotes);

  return (
    <div className="notes-widget" id="notes-widget">
      <div className="notes-widget__header">
        <h3 className="notes-widget__title">📝 Quick Notes</h3>
        {notes && (
          <button
            onClick={() => setNotes("")}
            className="notes-widget__clear"
            id="notes-clear-btn"
            title="Clear all notes"
          >
            Clear
          </button>
        )}
      </div>
      <textarea
        className="notes-widget__area"
        placeholder="Start typing your notes here..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        id="notes-textarea"
      />
      <div className="notes-widget__footer">
        <span className="notes-widget__autosave">
          {notes ? "✓ Auto-saved to local storage" : "Notes persist across page reloads"}
        </span>
        <span className="notes-widget__count">{notes.length} chars</span>
      </div>
    </div>
  );
};

export default NotesWidget;
