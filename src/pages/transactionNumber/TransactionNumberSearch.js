import React from "react";
import { Helmet } from "react-helmet";
// import Alert from "../../common/Alert";
// import SnacrisApi from "../../api/api";
// import TransNumSearchForm from "./TransNumSearchForm";
// import TransNumSearchDisplay from "./TransNumSearchDisplay";

function TransactionNumberSearch() {
  console.debug("TransactionNumberSearch - disabled due to API limitations");

  // Commented out - Transaction Number search is disabled
  // const [results, setResults] = useState([]);
  // const [alert, setAlert] = useState({ type: "", messages: [] });

  // async function search(masterSearchTerms, setAlert) { ... }

  return (
    <div className="container">
      <Helmet>
        <title>SNACRIS 🚧 Transaction Number</title>
      </Helmet>
      <div className="row mb-1">
        <div
          className="alert alert-info col-12 col-lg-12 d-flex flex-column align-items-start justify-content-start mb-1 p-1"
          role="alert"
        >
          <div className="d-flex align-items-end justify-content-start mb-0">
            <h2 className="title mb-0 me-2">Search By Transaction Number</h2>
            <em className="subtitle mb-0">Recorded Documents Only</em>
          </div>
          <p>
            A Transaction Number is a unique number which is automatically
            assigned by ACRIS when a new cover page is created. It identifies a
            group of related documents. Only after printing the Cover Pages for
            a new document will the Transaction screen be presented. Only
            documents recorded/filed on or after January 2, 2003 will have
            Transaction Numbers.
          </p>
          <p className="mb-0">
            <strong>Note:</strong> Transaction Number search is currently
            unavailable as this data is not accessible through the public ACRIS
            API datasets. Please use Document ID, CRFN, or other available
            search methods instead.
          </p>
        </div>
      </div>
      <div className="row mb-2">
        {/* Alert section removed - using warning alert below instead */}
      </div>
      <div className="row">
        <div className="col-12">
          <div className="alert alert-warning" role="alert">
            <h5 className="alert-heading">Search Currently Unavailable</h5>
            <p className="mb-0">
              Transaction Number search functionality is disabled because
              transaction number data is not available through the public ACRIS
              API datasets. Please use other search methods such as Document
              ID/CRFN, Party Name, or Address/Parcel searches to find the
              records you need.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionNumberSearch;
