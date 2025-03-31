import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import JoblyApi from "../../api/api";
import JobCardList from "../jobs/JobCardList";
import LoadingSpinner from "../../common/LoadingSpinner";
import "./CompanyDetail.css";

/** Company Detail page.
 *
 * Renders information about company, along with the jobs at that company.
 *
 * Routed at /companies/:handle
 *
 * Routes -> CompanyDetail -> JobCardList
 */

//The CompanyDetail component displays detailed information about a single company, including its associated jobs. It is rendered when the user navigates to `/companies/:handle`.
function CompanyDetail() {
  //Uses the `useParams` hook from react-router-dom to extract the `handle` parameter from the URL which is used to fetch the details of the specific company from the backend.
  const { handle } = useParams();
  console.debug("CompanyDetail", "handle=", handle);

  //company is a state variable that holds the details of the company fetched from the backend which is initially set to `null`.
  const [company, setCompany] = useState(null);

  //the useEffect hook runs when the component mounts or when the `handle` changes and calls `JoblyApi.getCompany(handle)` to fetch the company details, including its associated jobs.
  useEffect(
    function getCompanyAndJobsForUser() {
      async function getCompany() {
        //Calls JoblyApi.getCompany(handle) to fetch the details of the company, including its jobs.
        //The backend responds with an object containing: name (the name of the company), description (description of the company) and jobs (an array of job objects associated with the company).
        setCompany(await JoblyApi.getCompany(handle));
      }

      getCompany();
    },
    [handle]
  );

  //Rendering: if company is null, a LoadingSpinner is displayed while data is being fetched
  if (!company) return <LoadingSpinner />;

  //Rendering: once the data is loaded, the company’s name and description are displayed. 
  return (
    <div className="CompanyDetail col-md-8 offset-md-2">
      <h4 className="CompanyDetail">{company.name}</h4>
      <p className="CompanyDetail">{company.description}</p>
      {/* Rendering: the JobCardList component is used to render a list of jobs associated with the company. */}
      {/* JobCardList displays a list of jobs associated with the company and each job is rendered as a `JobCard` component. */}
      <JobCardList jobs={company.jobs} />
    </div>
  );
}

export default CompanyDetail;
