// import SnacrisApi from "../api/api";

/**
 * Service for street name autocomplete functionality
 * Handles API communication with backend for street name suggestions
 */
class StreetNameService {
  // Cache for storing recent search results
  static cache = new Map();
  
  // Maximum cache size to prevent memory bloat
  static MAX_CACHE_SIZE = 100;

  /**
   * Search for street names based on search term
   * @param {string} searchTerm - The search term to query
   * @returns {Promise<Array>} Array of street name suggestions
   */
  static async searchStreetNames(searchTerm) {
    try {
      // Normalize search term
      const normalizedTerm = searchTerm.trim().toUpperCase();
      
      if (!normalizedTerm || normalizedTerm.length === 0) {
        return [];
      }

      // Check cache first
      if (this.cache.has(normalizedTerm)) {
        console.debug("StreetNameService: returning cached results for", normalizedTerm);
        return this.cache.get(normalizedTerm);
      }

      console.debug("StreetNameService: searching for", normalizedTerm);

      // Make API call - for now using a placeholder endpoint
      // This will need to be implemented in the backend
      const results = await this.queryStreetNames(normalizedTerm);
      
      // Cache results
      this.cacheResults(normalizedTerm, results);
      
      return results;
    } catch (error) {
      console.error("StreetNameService: Error searching street names:", error);
      throw error;
    }
  }

  /**
   * Query backend for street names
   * @param {string} searchTerm - Normalized search term
   * @returns {Promise<Array>} Street name results
   */
  static async queryStreetNames(searchTerm) {
    try {
      // For now, we'll create a mock endpoint call that follows the existing API pattern
      // This should be replaced with an actual backend endpoint for street name search
      
      // Using the existing API structure - this endpoint needs to be implemented in backend
      // const params = { 
      //   search_term: searchTerm,
      //   limit: 20 // Limit results as per requirements
      // };

      // Mock response for now - in production this would call a real endpoint
      // const response = await SnacrisApi.request("streetNames/search", params);
      
      // For development/testing, return mock data
      const mockStreetNames = this.getMockStreetNames(searchTerm);
      
      return mockStreetNames;
    } catch (error) {
      console.error("StreetNameService: API call failed:", error);
      throw error;
    }
  }

  /**
   * Cache search results
   * @param {string} searchTerm - The search term
   * @param {Array} results - Results to cache
   */
  static cacheResults(searchTerm, results) {
    // Implement LRU-style cache by removing oldest entries when at max size
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(searchTerm, results);
  }

  /**
   * Clear the cache
   */
  static clearCache() {
    this.cache.clear();
  }

  /**
   * Mock street names for development/testing
   * This should be removed when real backend endpoint is available
   * @param {string} searchTerm - Search term to filter against
   * @returns {Array} Array of matching street names
   */
  static getMockStreetNames(searchTerm) {
    const mockStreets = [
      "JEFFERSON STREET",
      "JAMAICA AVENUE", 
      "JACKSON AVENUE",
      "JEROME AVENUE",
      "JOHNSON AVENUE",
      "JOHN STREET",
      "JAY STREET",
      "JUNIUS STREET",
      "JUPITER STREET",
      "JUNIPER VALLEY ROAD",
      "ABRAHAM LINCOLN STREET",
      "ADAMS STREET",
      "ALEXANDER AVENUE",
      "AMSTERDAM AVENUE",
      "ATLANTIC AVENUE",
      "BROADWAY",
      "BROOKLYN AVENUE",
      "BRONX RIVER AVENUE",
      "BUSHWICK AVENUE",
      "CENTRAL PARK WEST",
      "CHURCH AVENUE",
      "COLUMBUS AVENUE",
      "DELANCEY STREET",
      "EASTERN PARKWAY",
      "FLATBUSH AVENUE",
      "FORDHAM ROAD",
      "GRAND CONCOURSE",
      "MAIN STREET",
      "PARK AVENUE",
      "QUEENS BOULEVARD"
    ];

    // Filter mock streets that start with the search term
    return mockStreets
      .filter(street => street.startsWith(searchTerm))
      .slice(0, 20) // Limit to 20 results
      .map(street => ({ street_name: street }));
  }
}

export default StreetNameService;