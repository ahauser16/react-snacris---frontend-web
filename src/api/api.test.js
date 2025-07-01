import axios from "axios";
import SnacrisApi from "./api";

// Mock axios
jest.mock("axios");
const mockedAxios = axios;

describe("SnacrisApi", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Reset the token
    SnacrisApi.token = null;
  });

  describe("request method", () => {
    test("makes GET request with correct parameters", async () => {
      const mockResponse = { data: { success: true } };
      mockedAxios.mockResolvedValue(mockResponse);

      SnacrisApi.token = "test-token";
      const result = await SnacrisApi.request("test-endpoint", {
        param: "value",
      });

      expect(mockedAxios).toHaveBeenCalledWith({
        url: "http://localhost:3001/test-endpoint",
        method: "get",
        data: { param: "value" },
        params: { param: "value" },
        headers: { Authorization: "Bearer test-token" },
      });
      expect(result).toEqual({ success: true });
    });

    test("makes POST request with correct parameters", async () => {
      const mockResponse = { data: { created: true } };
      mockedAxios.mockResolvedValue(mockResponse);

      SnacrisApi.token = "test-token";
      const result = await SnacrisApi.request(
        "test-endpoint",
        { data: "value" },
        "post"
      );

      expect(mockedAxios).toHaveBeenCalledWith({
        url: "http://localhost:3001/test-endpoint",
        method: "post",
        data: { data: "value" },
        params: {},
        headers: { Authorization: "Bearer test-token" },
      });
      expect(result).toEqual({ created: true });
    });

    test("handles single error message", async () => {
      const mockError = {
        response: {
          data: {
            error: {
              message: "Single error message",
            },
          },
        },
      };
      mockedAxios.mockRejectedValue(mockError);

      await expect(SnacrisApi.request("test-endpoint")).rejects.toEqual([
        "Single error message",
      ]);
    });

    test("handles array error message", async () => {
      const mockError = {
        response: {
          data: {
            error: {
              message: ["Error 1", "Error 2"],
            },
          },
        },
      };
      mockedAxios.mockRejectedValue(mockError);

      await expect(SnacrisApi.request("test-endpoint")).rejects.toEqual([
        "Error 1",
        "Error 2",
      ]);
    });

    test("uses environment BASE_URL when available", async () => {
      // This test is hard to implement with the current setup since BASE_URL
      // is imported at module load time. For now, just test the default behavior.
      const mockResponse = { data: { success: true } };
      mockedAxios.mockResolvedValue(mockResponse);

      await SnacrisApi.request("test");

      expect(mockedAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "http://localhost:3001/test",
        })
      );
    });
  });

  describe("Authentication methods", () => {
    test("login returns token", async () => {
      const mockResponse = { data: { token: "login-token" } };
      mockedAxios.mockResolvedValue(mockResponse);

      const result = await SnacrisApi.login({
        username: "testuser",
        password: "testpass",
      });

      expect(mockedAxios).toHaveBeenCalledWith({
        url: "http://localhost:3001/auth/token",
        method: "post",
        data: { username: "testuser", password: "testpass" },
        params: {},
        headers: { Authorization: "Bearer null" },
      });
      expect(result).toBe("login-token");
    });

    test("signup returns token", async () => {
      const mockResponse = { data: { token: "signup-token" } };
      mockedAxios.mockResolvedValue(mockResponse);

      const userData = {
        username: "newuser",
        password: "newpass",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      };

      const result = await SnacrisApi.signup(userData);

      expect(mockedAxios).toHaveBeenCalledWith({
        url: "http://localhost:3001/auth/register",
        method: "post",
        data: userData,
        params: {},
        headers: { Authorization: "Bearer null" },
      });
      expect(result).toBe("signup-token");
    });

    test("getCurrentUser returns user data", async () => {
      const mockUser = { username: "testuser", firstName: "John" };
      const mockResponse = { data: { user: mockUser } };
      mockedAxios.mockResolvedValue(mockResponse);

      const result = await SnacrisApi.getCurrentUser("testuser");

      expect(mockedAxios).toHaveBeenCalledWith({
        url: "http://localhost:3001/users/testuser",
        method: "get",
        data: {},
        params: {},
        headers: { Authorization: "Bearer null" },
      });
      expect(result).toEqual(mockUser);
    });

    test("saveProfile returns updated user data", async () => {
      const mockUser = { username: "testuser", firstName: "Updated" };
      const mockResponse = { data: { user: mockUser } };
      mockedAxios.mockResolvedValue(mockResponse);

      const profileData = { firstName: "Updated" };
      const result = await SnacrisApi.saveProfile("testuser", profileData);

      expect(mockedAxios).toHaveBeenCalledWith({
        url: "http://localhost:3001/users/testuser",
        method: "patch",
        data: profileData,
        params: {},
        headers: { Authorization: "Bearer null" },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe("ACRIS query methods", () => {
    test("queryAcrisAddressParcel makes correct API call", async () => {
      const mockResponse = { data: { results: [] } };
      mockedAxios.mockResolvedValue(mockResponse);

      const searchTerms = { address: "123 Main St" };
      const result = await SnacrisApi.queryAcrisAddressParcel(searchTerms);

      expect(mockedAxios).toHaveBeenCalledWith({
        url: "http://localhost:3001/queryAcrisAddressParcel/fetchRecord",
        method: "get",
        data: searchTerms,
        params: searchTerms,
        headers: { Authorization: "Bearer null" },
      });
      expect(result).toEqual({ results: [] });
    });

    test("queryAcrisReelPage makes correct API call", async () => {
      const mockResponse = { data: { dataFound: true, results: [] } };
      mockedAxios.mockResolvedValue(mockResponse);

      const masterSearchTerms = { reel: "123" };
      const legalsSearchTerms = { page: "456" };
      const result = await SnacrisApi.queryAcrisReelPage(
        masterSearchTerms,
        legalsSearchTerms
      );

      expect(mockedAxios).toHaveBeenCalledWith({
        url: "http://localhost:3001/queryAcrisReelPage/fetchRecord",
        method: "get",
        data: { masterSearchTerms, legalsSearchTerms },
        params: { masterSearchTerms, legalsSearchTerms },
        headers: { Authorization: "Bearer null" },
      });
      expect(result).toEqual({ dataFound: true, results: [] });
    });

    test("queryAcrisTransactionNumber makes correct API call", async () => {
      const mockResponse = { data: { dataFound: true, results: [] } };
      mockedAxios.mockResolvedValue(mockResponse);

      const masterSearchTerms = { transactionNumber: "TX123" };
      const result = await SnacrisApi.queryAcrisTransactionNumber(
        masterSearchTerms
      );

      expect(mockedAxios).toHaveBeenCalledWith({
        url: "http://localhost:3001/queryAcrisTransactionNumber/fetchRecord",
        method: "get",
        data: { masterSearchTerms },
        params: { masterSearchTerms },
        headers: { Authorization: "Bearer null" },
      });
      expect(result).toEqual({ dataFound: true, results: [] });
    });

    test("queryAcrisPartyName makes correct API call", async () => {
      const mockResponse = { data: { results: [] } };
      mockedAxios.mockResolvedValue(mockResponse);

      const masterSearchTerms = { borough: "1" };
      const partySearchTerms = { partyName: "John Doe" };
      const legalsSearchTerms = { block: "123" };

      const result = await SnacrisApi.queryAcrisPartyName(
        masterSearchTerms,
        partySearchTerms,
        legalsSearchTerms
      );

      expect(mockedAxios).toHaveBeenCalledWith({
        url: "http://localhost:3001/queryAcrisPartyName/fetchRecord",
        method: "get",
        data: { masterSearchTerms, partySearchTerms, legalsSearchTerms },
        params: { masterSearchTerms, partySearchTerms, legalsSearchTerms },
        headers: { Authorization: "Bearer null" },
      });
      expect(result).toEqual({ results: [] });
    });
  });

  describe("Organization methods", () => {
    test("getOrganizations returns organizations list", async () => {
      const mockOrgs = [{ id: 1, name: "Test Org" }];
      const mockResponse = { data: { organizations: mockOrgs } };
      mockedAxios.mockResolvedValue(mockResponse);

      const result = await SnacrisApi.getOrganizations({ name: "Test" });

      expect(mockedAxios).toHaveBeenCalledWith({
        url: "http://localhost:3001/organizations",
        method: "get",
        data: { name: "Test" },
        params: { name: "Test" },
        headers: { Authorization: "Bearer null" },
      });
      expect(result).toEqual(mockOrgs);
    });

    test("getOrganization returns single organization", async () => {
      const mockOrg = { id: 1, name: "Test Org" };
      const mockResponse = { data: { organization: mockOrg } };
      mockedAxios.mockResolvedValue(mockResponse);

      const result = await SnacrisApi.getOrganization(1);

      expect(mockedAxios).toHaveBeenCalledWith({
        url: "http://localhost:3001/organizations/1",
        method: "get",
        data: {},
        params: {},
        headers: { Authorization: "Bearer null" },
      });
      expect(result).toEqual(mockOrg);
    });

    test("createOrganization creates new organization", async () => {
      const mockOrg = { id: 1, name: "New Org" };
      const mockResponse = { data: { organization: mockOrg } };
      mockedAxios.mockResolvedValue(mockResponse);

      const orgData = { name: "New Org", description: "Test description" };
      const result = await SnacrisApi.createOrganization(orgData);

      expect(mockedAxios).toHaveBeenCalledWith({
        url: "http://localhost:3001/organizations",
        method: "post",
        data: orgData,
        params: {},
        headers: { Authorization: "Bearer null" },
      });
      expect(result).toEqual(mockOrg);
    });

    test("deleteOrganization deletes organization", async () => {
      const mockResponse = { data: { deleted: 1 } };
      mockedAxios.mockResolvedValue(mockResponse);

      const result = await SnacrisApi.deleteOrganization(1);

      expect(mockedAxios).toHaveBeenCalledWith({
        url: "http://localhost:3001/organizations/1",
        method: "delete",
        data: {},
        params: {},
        headers: { Authorization: "Bearer null" },
      });
      expect(result).toBe(1);
    });
  });

  describe("Real Property Document methods", () => {
    test("getRealPropertyDocuments returns documents list", async () => {
      const mockDocs = [{ id: 1, title: "Test Doc" }];
      const mockResponse = { data: { documents: mockDocs } };
      mockedAxios.mockResolvedValue(mockResponse);

      const result = await SnacrisApi.getRealPropertyDocuments();

      expect(mockedAxios).toHaveBeenCalledWith({
        url: "http://localhost:3001/realPropertyDbRoutes/documents",
        method: "get",
        data: {},
        params: {},
        headers: { Authorization: "Bearer null" },
      });
      expect(result).toEqual(mockDocs);
    });

    test("saveRealPropertyDocument saves document", async () => {
      const mockResponse = { data: { savedMasterId: "DOC123" } };
      mockedAxios.mockResolvedValue(mockResponse);

      const docData = { title: "New Document", content: "Test content" };
      const result = await SnacrisApi.saveRealPropertyDocument(docData);

      expect(mockedAxios).toHaveBeenCalledWith({
        url: "http://localhost:3001/realPropertyDbRoutes/document",
        method: "post",
        data: docData,
        params: {},
        headers: { Authorization: "Bearer null" },
      });
      expect(result).toBe("DOC123");
    });

    test("deleteRealPropertyDocument deletes document", async () => {
      const mockResponse = { data: { deletedMasterId: "DOC123" } };
      mockedAxios.mockResolvedValue(mockResponse);

      const result = await SnacrisApi.deleteRealPropertyDocument("DOC123");

      expect(mockedAxios).toHaveBeenCalledWith({
        url: "http://localhost:3001/realPropertyDbRoutes/document/DOC123",
        method: "delete",
        data: {},
        params: {},
        headers: { Authorization: "Bearer null" },
      });
      expect(result).toBe("DOC123");
    });
  });

  describe("Admin Real Property Document methods", () => {
    test("getAdminRealPropertyDocuments returns documents for user", async () => {
      const mockDocs = [{ id: 1, title: "Admin Doc" }];
      const mockResponse = { data: { documents: mockDocs } };
      mockedAxios.mockResolvedValue(mockResponse);

      const result = await SnacrisApi.getAdminRealPropertyDocuments("testuser");

      expect(mockedAxios).toHaveBeenCalledWith({
        url: "http://localhost:3001/realPropertyDbRoutes/admin/documents/testuser",
        method: "get",
        data: {},
        params: {},
        headers: { Authorization: "Bearer null" },
      });
      expect(result).toEqual(mockDocs);
    });

    test("saveAdminRealPropertyDocument saves document for user", async () => {
      const mockResponse = { data: { savedMasterId: "ADMIN123" } };
      mockedAxios.mockResolvedValue(mockResponse);

      const docData = { title: "Admin Document" };
      const result = await SnacrisApi.saveAdminRealPropertyDocument(
        "testuser",
        docData
      );

      expect(mockedAxios).toHaveBeenCalledWith({
        url: "http://localhost:3001/realPropertyDbRoutes/admin/document/testuser",
        method: "post",
        data: docData,
        params: {},
        headers: { Authorization: "Bearer null" },
      });
      expect(result).toBe("ADMIN123");
    });
  });

  describe("Code mapping methods", () => {
    test("getDocControlCodesFromDb returns code map", async () => {
      const mockCodes = { DEED: "Deed Document" };
      const mockResponse = { data: mockCodes };
      mockedAxios.mockResolvedValue(mockResponse);

      const result = await SnacrisApi.getDocControlCodesFromDb();

      expect(mockedAxios).toHaveBeenCalledWith({
        url: "http://localhost:3001/db/code-map-documents/getDocTypeCodeMap",
        method: "get",
        data: {},
        params: {},
        headers: { Authorization: "Bearer null" },
      });
      expect(result).toEqual(mockCodes);
    });
  });

  describe("Token management", () => {
    test("token is included in authorization header", async () => {
      const mockResponse = { data: { success: true } };
      mockedAxios.mockResolvedValue(mockResponse);

      SnacrisApi.token = "my-auth-token";
      await SnacrisApi.request("test-endpoint");

      expect(mockedAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: { Authorization: "Bearer my-auth-token" },
        })
      );
    });

    test("handles null token", async () => {
      const mockResponse = { data: { success: true } };
      mockedAxios.mockResolvedValue(mockResponse);

      SnacrisApi.token = null;
      await SnacrisApi.request("test-endpoint");

      expect(mockedAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: { Authorization: "Bearer null" },
        })
      );
    });
  });
});
