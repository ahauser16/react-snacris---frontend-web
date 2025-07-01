import React, { useState } from "react";
import "./SearchForm.css";

/** Search widget.
 *
 * ARCHIVED.  thsi component was used in a template's components: CompanyList and JobList so that these can be filtered
 * down.  It's here for reference only.
 *
 * This component doesn't *do* the searching, but it renders the search
 * form and calls the `searchFor` function prop that runs in a parent to do the
 * searching.
 *
 * { CompanyList, JobList } -> SearchForm
 */

function SearchForm({ searchFor }) {
  console.debug("SearchForm", "searchFor=", typeof searchFor);

  const [searchTerm, setSearchTerm] = useState("");

  /** Tell parent to filter */
  function handleSubmit(evt) {
    // take care of accidentally trying to search for just spaces
    evt.preventDefault();
    try {
      searchFor(searchTerm.trim() || undefined);
    } catch (err) {
      console.error("Error in searchFor:", err);
      // Don't throw the error, allow the component to continue functioning
    }
    setSearchTerm(searchTerm.trim());
  }

  /** Update form fields */
  function handleChange(evt) {
    setSearchTerm(evt.target.value);
  }

  /** Handle Enter key press on input */
  function handleKeyDown(evt) {
    if (evt.key === "Enter") {
      handleSubmit(evt);
    }
  }

  return (
    <div className="SearchForm mb-4">
      <form onSubmit={handleSubmit} aria-label="search-form" role="form">
        <div className="row justify-content-center justify-content-lg-start gx-0">
          <div className="col-8">
            <input
              className="form-control form-control-lg"
              name="searchTerm"
              type="text"
              placeholder="Enter search term.."
              value={searchTerm}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="col-auto">
            <button type="submit" className="btn btn-lg btn-primary">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SearchForm;
