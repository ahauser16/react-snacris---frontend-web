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

  /** User and authentication related routes */

  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
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

  // search page related routes

  static async queryAcrisAddressParcel(searchTerms) {
    console.debug("API queryAcrisAddressParcel called with:", searchTerms);

    const params = { ...searchTerms };

    const res = await this.request(
      "queryAcrisAddressParcel/fetchRecord",
      params
    );
    console.debug("API queryAcrisAddressParcel response:", res);
    return res;
  }

  static async queryAcrisReelPage(masterSearchTerms, legalsSearchTerms) {
    console.debug(
      "API queryAcrisReelPage called with:",
      masterSearchTerms,
      legalsSearchTerms
    );

    const params = { masterSearchTerms, legalsSearchTerms };

    const res = await this.request("queryAcrisReelPage/fetchRecord", params);
    console.debug("API queryAcrisReelPage response:", res);
    return res;
  }

  static async queryAcrisTransactionNumber(masterSearchTerms) {
    console.debug(
      "API queryAcrisTransactionNumber called with:",
      masterSearchTerms
    );

    const params = { masterSearchTerms };

    const res = await this.request(
      "queryAcrisTransactionNumber/fetchRecord",
      params
    );
    console.debug("API queryAcrisTransactionNumber response:", res);
    return res;
  }

  static async queryAcrisUccFedLienNum(masterSearchTerms, legalsSearchTerms) {
    console.debug(
      "API queryAcrisUccFedLienNum called with:",
      masterSearchTerms,
      legalsSearchTerms
    );

    const params = { masterSearchTerms, legalsSearchTerms };

    const res = await this.request(
      "queryAcrisUccFedLienNum/fetchRecord",
      params
    );
    console.debug("API queryAcrisUccFedLienNum response:", res);
    return res;
  }

  static async queryAcrisDocIdCrfn(masterSearchTerms) {
    console.debug("API queryAcrisDocIdCrfn called with:", masterSearchTerms);

    const params = { masterSearchTerms };

    const res = await this.request("queryAcrisDocIdCrfn/fetchRecord", params);
    console.debug("API queryAcrisDocIdCrfn response:", res);
    return res;
  }

  static async queryAcrisDocumentType(masterSearchTerms, legalsSearchTerms) {
    console.debug(
      "API queryAcrisDocumentType called with:",
      masterSearchTerms,
      legalsSearchTerms
    );

    // Combine `searchTerms` and `apiSearchSources` into a single object
    const params = { masterSearchTerms, legalsSearchTerms };

    // Make a GET request with all parameters serialized into the URL
    const res = await this.request(
      "queryAcrisDocumentType/fetchRecord",
      params
    );
    console.debug("API queryAcrisDocumentType response:", res);
    return res;
  }

  static async queryAcrisPartyName(
    masterSearchTerms,
    partySearchTerms,
    legalsSearchTerms
  ) {
    console.debug("API queryPartyName called with:", {
      masterSearchTerms,
      partySearchTerms,
      legalsSearchTerms,
    });
    const params = { masterSearchTerms, partySearchTerms, legalsSearchTerms };

    //use this function's structure to refactor the others.
    const res = await this.request("queryAcrisPartyName/fetchRecord", params);
    console.debug("API queryPartyName response:", res);
    return res;
  }

  static async queryAcrisParcel(masterSearchTerms, legalsSearchTerms) {
    console.debug("API queryAcrisParcel called with:", {
      masterSearchTerms,
      legalsSearchTerms,
    });
    const params = { masterSearchTerms, legalsSearchTerms };

    const res = await this.request("queryAcrisParcel/fetchRecord", params);
    console.debug("API queryAcrisParcel response:", res);
    return res;
  }

  //routes related to code maps retrieved from database

  static async getDocControlCodesFromDb() {
    console.debug("API getDocControlCodes called");

    // Make a GET request to the backend's `/db/code-map-documents/getDocTypeCodeMap` endpoint
    const res = await this.request("db/code-map-documents/getDocTypeCodeMap");
    console.debug("API getDocControlCodes response:", res);

    // Return the data from the response
    return res;
  }

  //routes related to organizaitons
  /** Get all organizations (optionally filtered by query params) */
  static async getOrganizations(params = {}) {
    // params can include: name, description, isActive, createdBy, username
    const res = await this.request("organizations", params);
    return res.organizations;
  }

  /** Get a single organization by id */
  static async getOrganization(id) {
    const res = await this.request(`organizations/${id}`);
    return res.organization;
  }

  /** Get all organizations associated with the currentUser */
  static async getMyOrganizations() {
    const res = await this.request("organizations/my");
    return res.organizations;
  }

  /** Get all members of an organization */
  static async getOrganizationMembers(id) {
    const res = await this.request(`organizations/${id}/members`);
    return res.members;
  }

  /** Create a new organization */
  static async createOrganization(data) {
    const res = await this.request("organizations", data, "post");
    return res.organization;
  }

  /** Update an organization */
  static async updateOrganization(id, data) {
    const res = await this.request(`organizations/${id}`, data, "patch");
    return res.organization;
  }

  /** Delete an organization */
  static async deleteOrganization(id) {
    const res = await this.request(`organizations/${id}`, {}, "delete");
    return res.deleted;
  }
}

export default SnacrisApi;
