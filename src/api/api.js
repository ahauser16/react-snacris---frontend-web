import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class SnacrisApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${SnacrisApi.token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Get the current user. */

  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  /** Get companies (filtered by name if not undefined) */

  static async getCompanies(name) {
    let res = await this.request("companies", { name });
    return res.companies;
  }

  /** Get details on a company by handle. */

  static async getCompany(handle) {
    let res = await this.request(`companies/${handle}`);
    return res.company;
  }



  /** Get list of jobs (filtered by title if not undefined) */

  static async getJobs(title) {
    let res = await this.request("jobs", { title });
    return res.jobs;
  }

  /** Apply to a job */

  static async applyToJob(username, id) {
    console.debug("API applyToJob called with:", username, id);
    //NB--> as part of debugging it was suggested to add the `await` keyword to the implementation of this function in `App.js` and `JobCard.js`
    await this.request(`users/${username}/jobs/${id}`, {}, "post");
  }

  static async queryAcrisAddressParcel(searchTerms) {
    console.debug("API queryAcrisAddressParcel called with:", searchTerms);
    const res = await this.request("queryAcrisAddressParcel/fetchRecord", searchTerms);
    console.debug("API queryAcrisAddressParcel response:", res);
    return res.records;
  }

  static async queryAcrisDocIdCrfn(searchTerms, apiSearchSources) {
    console.debug("API queryAcrisDocIdCrfn called with:", searchTerms, apiSearchSources);

    // Combine `searchTerms` and `apiSearchSources` into a single object
    const params = { ...searchTerms, ...apiSearchSources };

    // Make a GET request with all parameters serialized into the URL
    const res = await this.request("queryAcrisDocIdCrfn/fetchRecord", params);
    console.debug("API queryAcrisDocIdCrfn response:", res);
    return res.records;
  }

  static async queryAcrisPartyName(
    masterSearchTerms,
    partySearchTerms,
    legalsSearchTerms,
    remarkSearchTerms,
    referenceSearchTerms,
    primaryApiSources,
    secondaryApiSources
  ) {
    console.debug("API queryPartyName called with:", {
      masterSearchTerms,
      partySearchTerms,
      legalsSearchTerms,
      remarkSearchTerms,
      referenceSearchTerms,
      primaryApiSources,
      secondaryApiSources,
    });

    const params = {
      masterSearchTerms,
      partySearchTerms,
      legalsSearchTerms,
      remarkSearchTerms,
      referenceSearchTerms,
      primaryApiSources,
      secondaryApiSources,
    };

    const res = await this.request("queryAcrisPartyName/fetchRecord", params);
    console.debug("API queryPartyName response:", res);
    return res.records;
  }

  static async getDocControlCodesFromDb() {
    console.debug("API getDocControlCodes called");

    // Make a GET request to the backend's `/db/code-map-documents/getDocTypeCodeMap` endpoint
    const res = await this.request("db/code-map-documents/getDocTypeCodeMap");
    console.debug("API getDocControlCodes response:", res);

    // Return the data from the response
    return res;
  }
  /** Get token for login from username, password. */

  static async login(data) {
    let res = await this.request(`auth/token`, data, "post");
    return res.token;
  }

  /** Signup for site. */

  static async signup(data) {
    let res = await this.request(`auth/register`, data, "post");
    return res.token;
  }

  /** Save user profile page. */

  static async saveProfile(username, data) {
    let res = await this.request(`users/${username}`, data, "patch");
    return res.user;
  }
}

export default SnacrisApi;