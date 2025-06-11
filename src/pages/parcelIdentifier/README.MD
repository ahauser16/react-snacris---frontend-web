# Parcel Identifier Search Notes

## `PartyIdentifierSearch` Refactor Based On `PartyNameSearch` as template

Currently when I submit the `ParceiIdentifierSearchForm` the data is sent to my server using the data structure below.

ParcelIdentifierSearch: search called with:
```json
{
    "recorded_date_range": "last-2-years",
    "recorded_date_start": "2023-05-27",
    "recorded_date_end": "2025-05-26",
    "doc_type": "doc-type-default",
    "doc_class": "DEEDS AND OTHER CONVEYANCES"
}
{
    "borough": "",
    "block": "05159",
    "lot": "47",
    "unit": ""
}
```


However, I need to add a route to the `api.js` file for my `ParceiIdentifierSearch` to call in its `search` function which is currently named "queryAcrisParcelData".  I will add this function using the `queryAcrisPartyName` as its template.