import React, { useState } from "react";
import DocClassTypeSelect from '../../components/acris/documentControlCodeForms/DocClassTypeSelect';
import RecordedDateRangeWrapper from "../../components/acris/masterForms/RecordedDateRangeWrapper";
import DocumentTypeSearchWrapperBoroughSelect from './DocumentTypeSearchWrapperBoroughSelect'

const DocumentTypeSearchForm = ({ searchFor }) => {
    console.debug("DocumentTypeSearchForm", "searchFor=", typeof searchFor);

    const [masterSearchTerms, setMasterSearchTerms] = React.useState({
        recorded_date_range: "to-current-date-default",
        recorded_date_start: "",
        recorded_date_end: "",
        doc_type: "doc-type-default",
        doc_class: "all-classes-default",
    });

    const [legalsSearchTerms, setLegalsSearchTerms] = React.useState({
        borough: "",
    });

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
        <div className="DocumentTypeSearchForm">
            <form onSubmit={handleSubmit}>
                <fieldset className="text-start">
                    <RecordedDateRangeWrapper
                        masterSearchTerms={masterSearchTerms}
                        setMasterSearchTerms={setMasterSearchTerms}
                    />
                    <DocClassTypeSelect
                        masterSearchTerms={masterSearchTerms}
                        setMasterSearchTerms={setMasterSearchTerms}
                    />
                    <DocumentTypeSearchWrapperBoroughSelect
                        legalsSearchTerms={legalsSearchTerms}
                        handleLegalsChange={handleLegalsChange}
                    />
                </fieldset>
                <button type="submit" className="btn btn-lg btn-primary mx-auto">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default DocumentTypeSearchForm