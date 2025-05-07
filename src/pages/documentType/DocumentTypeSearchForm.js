import React, { useState } from "react";
import Alert from "../../common/Alert";
import DocClassTypeSelect from '../../components/acris/DocClassTypeSelect'
import DocumentDateRange from '../../components/acris/DocumentDateRange'
import BoroughSelect from '../../components/acris/legalsForms/BoroughSelect'

/*
* 
* On mount, the DocClassTypeSelect component loads Document Control Codes from Server's database which are used to populate the dropdowns in the search form.  I seeded the database with the Document Control Codes from the Document Control Codes ACRIS API.
 * Sends the Server query parameters associated with Real Property Master API and Real Property Legals API.
*
*/
const DocumentTypeSearchForm = ({ searchFor }) => {
    console.debug("DocumentTypeSearchForm", "searchFor=", typeof searchFor);

    const [masterSearchTerms, setMasterSearchTerms] = React.useState({
        document_date_range: "to-current-date-default",
        document_date_start: "start-date-default",
        document_date_end: "end-date-default",
        doc_type: "doc-type-default",
        doc_class: "all-classes-default",
    });

    const [legalsSearchTerms, setLegalsSearchTerms] = React.useState({
        borough: "all-boroughs-default",
    });

    const [formErrors, setFormErrors] = useState([]);


    function handleSubmit(evt) {
        evt.preventDefault();
        console.debug(
            "DocumentTypeSearchForm: handleSubmit called with:",
            masterSearchTerms,
            legalsSearchTerms
        );
        searchFor(masterSearchTerms, legalsSearchTerms);
    }

    function handleMasterChange(evt) {
        const { name, value } = evt.target;
        setMasterSearchTerms((data) => ({
            ...data,
            [name]: value,
        }));
    }

    function handleLegalsChange(evt) {
        const { name, value } = evt.target;
        setLegalsSearchTerms((data) => ({
            ...data,
            [name]: value,
        }));
    }

    return (
        <div className="DocumentTypeSearchForm mb-4">
            <form onSubmit={handleSubmit}>
                <div className="row justify-content-center justify-content-lg-start gx-4 gy-4">
                    <fieldset className="col-6 justify-content-start text-start">
                        <DocumentDateRange
                            masterSearchTerms={masterSearchTerms}
                            setMasterSearchTerms={setMasterSearchTerms}
                        />
                        <DocClassTypeSelect
                            masterSearchTerms={masterSearchTerms}
                            setMasterSearchTerms={setMasterSearchTerms}
                        />
                        <BoroughSelect
                            legalsSearchTerms={legalsSearchTerms}
                            handleLegalsChange={handleLegalsChange}
                        />
                    </fieldset>
                    <button type="submit" className="btn btn-lg btn-primary mx-auto">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default DocumentTypeSearchForm