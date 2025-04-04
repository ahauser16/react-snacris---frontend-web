import React from "react";
import { Link } from "react-router-dom";
import "./CompanyCard.css";

/** Show limited information about a company
 *
 * Is rendered by CompanyList to show a "card" for each company.
 * 
 * Clicking on a CompanyCard navigates to the CompanyDetail page for the selected company.
 *
 * CompanyList -> CompanyCard
 */
// CompanyCard is a presentational component that displays a summary of a single company. 
// It is rendered by CompanyList.js for each company in the list.
// It Receives name, description, logoUrl, and handle as props from the CompanyList component.
function CompanyCard({ name, description, logoUrl, handle }) {
  console.debug("CompanyCard", logoUrl);

  return (
    //Displays the company’s name, description, and logo (if available) in a Link component from react-router-dom, which navigates to the CompanyDetail page for the specific company when clicked.
    //The `to` prop of the Link component is set to `/companies/${handle}` which ensures that clicking on a company card navigates to the CompanyDetail page for that company.
    <Link className="CompanyCard card" to={`/companies/${handle}`}>
      <div className="card-body">
        <h6 className="card-title">
          {name}
          {logoUrl && (
            <img src={logoUrl} alt={name} className="float-end ms-5" />
          )}
        </h6>
        <p>
          <small>{description}</small>
        </p>
      </div>
    </Link>
  );
}

export default CompanyCard;
