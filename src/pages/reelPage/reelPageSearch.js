import React, { useState, useEffect } from "react";
import SearchForm from "../../common/SearchForm";
import JoblyApi from "../../api/api";
// import CompanyCard from "./CompanyCard";
import LoadingSpinner from "../../common/LoadingSpinner";

/** Show page with list of companies.
 *
 * On mount, loads companies from API.
 * Re-loads filtered companies on submit from search form.
 *
 * This is routed to at /companies
 *
 * Routes -> { CompanyCard, SearchForm }
 */

function ReelPageSearch() {
  //console.debug("CompanyList");

  //`companies` is a state variable that holds the list of companies fetched from the backend which is initially set to null.
  //const [companies, setCompanies] = useState(null);

  //the useEffect hook runs when the component mounts which calls the `search()` function to fetch all companies from the backend using the `JoblyApi.getCompanies()` method
  /*useEffect(function getCompaniesOnMount() {
    console.debug("CompanyList useEffect getCompaniesOnMount");
    search();
  }, []);*/

  /** Triggered by search form submit; reloads companies. 
   * the SearchForm component allows users to filter companies by name. When the search form is submitted, the `search()` function is called with the search term, and the list of companies is updated.
  */
  async function search(name) {
    //let companies = await JoblyApi.getCompanies(name);
    //setCompanies(companies);
  }

  //Rendering: If companies is null, a LoadingSpinner is displayed while data is being fetched.
  //if (!companies) return <LoadingSpinner />;

  return (
    <div className="container text-center">
      {/* Provides the search functionality and calls the search() function in CompanyList with the search term. */}
      <h1 className="mb-4 fw-bold">Search By Reel & Page</h1>
      <SearchForm searchFor={search} />
      {/* Rendering: If companies are found, a list of CompanyCard components is rendered.  */}
      {/* {companies.length ? (
        <div className="CompanyList-list">
          {companies.map((c) => (
            //Each company in the list is rendered as a CompanyCard component.
            <CompanyCard
              key={c.handle}
              handle={c.handle}
              name={c.name}
              description={c.description}
              logoUrl={c.logoUrl}
            />
          ))}
        </div>
      ) : (
        //Rendering: If no companies match the search, a message is displayed.
        <p className="lead">Sorry, no results were found!</p>
      )} */}
    </div>
  );
}

export default ReelPageSearch;
