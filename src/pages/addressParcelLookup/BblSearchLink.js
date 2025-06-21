import React from "react";
import { Link } from "react-router-dom";

/**
 * BblSearchLink - A button-like link to /parcelIdentifierSearch with BBL params.
 * @param {Object} props
 * @param {string|number} props.borough
 * @param {string|number} props.block
 * @param {string|number} props.lot
 */
function BblSearchLink({ borough, block, lot }) {
  const params = new URLSearchParams({ borough, block, lot }).toString();
  return (
    <Link
      to={`/parcelIdentifierSearch?${params}`}
      className="btn btn-outline-primary btn-sm mt-2"
      aria-label={`Search By BBL: ${borough}, ${block}, ${lot}`}
    >
      Search By BBL: {borough}, {block}, {lot}
    </Link>
  );
}

export default BblSearchLink;