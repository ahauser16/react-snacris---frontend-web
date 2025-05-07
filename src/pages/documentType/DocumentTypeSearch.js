import React, { useState, useEffect } from "react";
import SnacrisApi from "../../api/api";
import DocumentTypeSearchForm from "./DocumentTypeSearchForm";


/** Search ACRIS by Document Class & Type, Document Date and Borough.
 *

 *
 * Navigation.js --> <NavLink className="nav-link" to="/documentTypeSearch">.
 *
 * RoutesList.js --> `<Route path="/documentTypeSearch" element={<DocumentTypeSearch />} />`
 */

function DocumentTypeSearch() {
  console.debug("DocumentTypeSearch");

  //`results` is a state variable that holds the results of the ACRIS API call that is executed from the backend and is initially set to `null`.
  const [results, setResults] = useState(null);

  //the useEffect hook runs when the component mounts which calls the `search()` function to fetch all companies from the backend using the `JoblyApi.getCompanies()` method
  /*useEffect(function getCompaniesOnMount() {
    console.debug("CompanyList useEffect getCompaniesOnMount");
    search();
  }, []);*/

  /** Triggered by DocumentTypeSearchForm submit; displays results from Real Property Master and Legals datasets. 
   * the DocumentTypeSearchForm component allows users to send query parameters to the Server which makes GET requests to the Real Property Master and Legals datasets, cross references the results of each response and sends them back to be displayed by DocumentTypeSearch.
  */
  async function search(masterSearchTerms, legalsSearchTerms) {
    console.debug("DocumentTypeSearch search called with:", masterSearchTerms, legalsSearchTerms);
    try {
      const results = await SnacrisApi.queryAcrisDocTypeSearch(masterSearchTerms, legalsSearchTerms);
      console.debug("DocumentTypeSearch search results:", results);
      setResults(results);
    } catch (err) {
      console.error("Error fetching results:", err);
      setResults([]);
    }
  }



  return (
    <div className="container text-center">
      <h1 className="mb-4 fw-bold">Search By Document Type</h1>
      <h2 className="mb-4 fw-bold">Recorded Documents Only</h2>
      <hr />
      <DocumentTypeSearchForm searchFor={search} />
    </div>
  );
}

export default DocumentTypeSearch;
