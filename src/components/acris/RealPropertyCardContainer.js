import React from "react";
import RealPropertyMasterCard from "./RealPropertyMasterCard";
import LegalsCardSelector from "./LegalsCardSelector";
import PartiesCardSelector from "./PartiesCardSelector";
import RealPropertyRefsCard from "./RealPropertyRefsCard";
import RealPropertyRemarksCard from "./RealPropertyRemarksCard";
import "./CommonAcrisComponent.css";

// Helper to get doc_type for parties
function getDocTypeForParties(masterRecords) {
    return masterRecords?.[0]?.doc_type || "";
}

// Always show a card for Refs, even if empty
function RefsCardDisplay({ referencesRecords, document_id }) {
    if (!referencesRecords || referencesRecords.length === 0) {
        return (
            <div className="card mb-3 shadow-sm w-100">
                <div className="card-body notApplic" aria-label="Reference data not available">
                    <span aria-hidden="true">References Data is N/A</span>
                    <span className="visually-hidden">Reference data not available</span>
                </div>
            </div>
        );
    }
    return referencesRecords.map((rec, idx) => (
        <RealPropertyRefsCard key={`refs-${document_id}-${idx}`} {...rec} />
    ));
}

// Always show a card for Remarks, even if empty
function RemarksCardDisplay({ remarksRecords, document_id }) {
    if (!remarksRecords || remarksRecords.length === 0) {
        return (
            <div className="card mb-3 shadow-sm w-100">
                <div className="card-body notApplic" aria-label="Remarks data not available">
                    <span aria-hidden="true">Remarks Data is N/A</span>
                    <span className="visually-hidden">Remarks data not available</span>
                </div>
            </div>
        );
    }
    return remarksRecords.map((rec, idx) => (
        <RealPropertyRemarksCard key={`remarks-${document_id}-${idx}`} {...rec} />
    ));
}

function RealPropertyCardContainer({ group }) {
    const docType = getDocTypeForParties(group.masterRecords);
    const docId = group.document_id;
    const detailUrl = `https://a836-acris.nyc.gov/DS/DocumentSearch/DocumentDetail?doc_id=${docId}`;
    const imageUrl = `https://a836-acris.nyc.gov/DS/DocumentSearch/DocumentImageView?doc_id=${docId}`;

    return (
        <div className="card mb-3 shadow-sm w-100 p-1">
            <h4 className="card-header text-primary mb-1">
                Document ID: {docId}
            </h4>
            <div className="mb-3">
                <a
                    href={detailUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary me-2"
                >
                    Document Detail
                </a>
                <a
                    href={imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary me-2"
                >
                    View Document
                </a>
            </div>
            {/* Stack these vertically, full width */}
            <div className="d-flex flex-column gap-3">
                <div>
                    {group.masterRecords?.length > 0 ? (
                        <RealPropertyMasterCard {...group.masterRecords[0]} />
                    ) : (
                        <div className="card mb-3 shadow-sm w-100">
                            <div className="card-body notApplic" aria-label="Master data not available">
                                <span aria-hidden="true">N/A</span>
                                <span className="visually-hidden">Master data not available</span>
                            </div>
                        </div>
                    )}
                </div>
                <LegalsCardSelector legalsRecords={group.legalsRecords || []} />
                <PartiesCardSelector
                    partiesRecords={group.partiesRecords || []}
                    docType={docType}
                />
            </div>
            <div className="row justify-content-center mt-4">
                <div className="col-md-6">
                    <RefsCardDisplay
                        referencesRecords={group.referencesRecords || []}
                        document_id={group.document_id}
                    />
                </div>
                <div className="col-md-6">
                    <RemarksCardDisplay
                        remarksRecords={group.remarksRecords || []}
                        document_id={group.document_id}
                    />
                </div>
            </div>
        </div>
    );
}

export default RealPropertyCardContainer;