# Search By Document Type

## 6/15/25 refactor required

Currently, the Search By Document Type form is submitting data correctly but the response is not being rendered correctly. I am examining how the backend structures the data which may be in a different format than the `DocumentTypeSearchDisplay.js` component is expecting. This display component is a wrapper for the `RealPropertyCardContainer.js` so it is possible that the backend should be refactored to ensure the data is being sent back to the frontend in a format expected by `RealPropertyCardContainer.js`. Below are my notes.

**Check if architecture matches the Search By Parcel(BBL) page**

The Search By Parcel page is working and has the same frontend structure (see below).

- ParcelIdentifierSearch - contains `results`, `setResults`, `masterSearchTerms`, `legalsSearchTerms`
  - ParcelIdentifierSearchForm - receives `search` from parent
  - ParcelIdentifierSearchDisplay - `masterSearchTerms`, `setMasterSearchTerms`, `legalsSearchTerms`, `setLegalsSearchTerms`
    - DocumentIdMenu
    - RealPropertyCardContainer
      - RealPropertyMasterCard
      - LegalsCardSelector
      - PartiesCardSelector
      - RealPropertyRefsCard
      - RealPropertyRemarksCard
- DocumentTypeSearch
  - DocumentTypeSearchForm
  - DocumentTypeSearchDisplay
    - DocumentIdMenu
    - RealPropertyCardContainer
      - RealPropertyMasterCard
      - LegalsCardSelector
      - PartiesCardSelector
      - RealPropertyRefsCard
      - RealPropertyRemarksCard

The `Search By Document Type` is not behaving correctly on the backend given the empty response objects below whereas the `Query Acris Parcel` search is still working as it should. I'm going to switch to the backend to continue to debug the issue.

**Query Acris Parcel** is sent the `results` in the format below.

```bash
[
  {
    document_id: 'BK_6830029501877',
    masterRecords: [ [Object] ],
    partiesRecords: [ [Object], [Object] ],
    legalsRecords: [ [Object] ],
    referencesRecords: [],
    remarksRecords: [ [Object] ]
  },
  {
    document_id: 'BK_6830029501879',
    masterRecords: [ [Object] ],
    partiesRecords: [ [Object], [Object] ],
    legalsRecords: [ [Object] ],
    referencesRecords: [],
    remarksRecords: [ [Object] ]
  },
  {
    document_id: 'BK_7230060101439',
    masterRecords: [ [Object] ],
    partiesRecords: [ [Object], [Object] ],
    legalsRecords: [ [Object] ],
    referencesRecords: [],
    remarksRecords: [ [Object] ]
  },
  {
    document_id: 'BK_7230060101441',
    masterRecords: [ [Object] ],
    partiesRecords: [ [Object], [Object] ],
    legalsRecords: [ [Object] ],
    referencesRecords: [],
    remarksRecords: [ [Object] ]
  },
  {
    document_id: 'BK_7730091601981',
    masterRecords: [ [Object] ],
    partiesRecords: [ [Object], [Object] ],
    legalsRecords: [ [Object] ],
    referencesRecords: [],
    remarksRecords: [ [Object] ]
  },
  {
    document_id: 'BK_7730091601987',
    masterRecords: [ [Object] ],
    partiesRecords: [ [Object], [Object] ],
    legalsRecords: [ [Object] ],
    referencesRecords: [],
    remarksRecords: [ [Object] ]
  },
  {
    document_id: 'FT_3030001026203',
    masterRecords: [ [Object] ],
    partiesRecords: [ [Object], [Object], [Object], [Object] ],
    legalsRecords: [ [Object] ],
    referencesRecords: [],
    remarksRecords: []
  },
  {
    document_id: 'FT_3150000953315',
    masterRecords: [ [Object] ],
    partiesRecords: [ [Object], [Object], [Object], [Object] ],
    legalsRecords: [ [Object] ],
    referencesRecords: [],
    remarksRecords: []
  },
  {
    document_id: 'FT_3160005545216',
    masterRecords: [ [Object] ],
    partiesRecords: [ [Object], [Object], [Object] ],
    legalsRecords: [ [Object] ],
    referencesRecords: [],
    remarksRecords: []
  }
] queryAcrisParcel
```

**Query Acris Document Type** is sent the `results` in the format below.

```bash
[
    {
    document_id: '2025050200191001',
    masterRecords: [],
    partiesRecords: [],
    legalsRecords: [],
    referencesRecords: [],
    remarksRecords: []
  },
  {
    document_id: '2025050200214001',
    masterRecords: [],
    partiesRecords: [],
    legalsRecords: [],
    referencesRecords: [],
    remarksRecords: []
  },
  ... 3346 more items
] queryAcrisDocumentType results
```

The Search By Document Type on the backend is returning `'masterRecordsDocumentIds' count is:  2302` and `'legalsRecordsDocumentIds' count is:  793` which seems like `const masterRecordsDocumentIds = await MasterRealPropApi.fetchAcrisDocumentIds(masterQueryParams);` and `legalsRecordsDocumentIds = await LegalsRealPropApi.fetchAcrisDocumentIdsCrossRef(legalsQueryParams, masterRecordsDocumentIds);` are working as expected but I'm going to do some testing to make sure some of the **793** records correctly match the search criteria.  

I had to update the `fetchAcrisDocumentIdsCrossRef` in each of the five Real Property API modules so it used a `batchArray` method to create an array of URLs called `batches`.