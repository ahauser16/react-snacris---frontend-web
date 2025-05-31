import React, { useState } from "react";
import RealPropertyLegalsCard from "./RealPropertyLegalsCard";

function LegalsCardSelector({ legalsRecords }) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  return (
    <div className="w-100 mb-3">
      <div className="btn-group mb-2 d-flex flex-wrap">
        {legalsRecords.length > 0
          ? legalsRecords.map((rec, idx) => (
            <button
              key={idx}
              className={`btn btn-sm flex-fill ${selectedIdx === idx ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setSelectedIdx(idx)}
            >
              {`Lot ${rec.lot}`}
            </button>
          ))
          : <button className="btn btn-sm btn-outline-secondary" disabled>No Legals</button>
        }
      </div>
      {legalsRecords.length > 0 ? (
        <RealPropertyLegalsCard {...legalsRecords[selectedIdx]} />
      ) : (
        <div className="card mb-3 shadow-sm w-100">
          <div className="card-body">Legals Data is N/A</div>
        </div>
      )}
    </div>
  );
}

export default LegalsCardSelector;