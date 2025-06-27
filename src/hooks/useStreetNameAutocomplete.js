import { useState, useEffect, useCallback, useRef } from "react";
import StreetNameService from "../services/streetNameService";

/**
 * Custom hook for street name autocomplete functionality
 * Handles debouncing, API calls, caching, and state management
 */
const useStreetNameAutocomplete = (initialValue = "", debounceMs = 300) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [error, setError] = useState(null);

  // Refs for managing timers and component state
  const debounceTimerRef = useRef(null);
  const mounted = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mounted.current = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  /**
   * Search for street names with debouncing
   */
  const searchStreetNames = useCallback(async (searchTerm) => {
    if (!mounted.current) return;

    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Don't search for empty or very short terms
    if (!searchTerm || searchTerm.trim().length === 0) {
      setSuggestions([]);
      setIsOpen(false);
      setError(null);
      return;
    }

    // Debounce the search
    debounceTimerRef.current = setTimeout(async () => {
      if (!mounted.current) return;

      try {
        setIsLoading(true);
        setError(null);

        const results = await StreetNameService.searchStreetNames(searchTerm);
        
        if (!mounted.current) return;

        setSuggestions(results);
        setIsOpen(results.length > 0);
        setSelectedIndex(-1);
      } catch (err) {
        if (!mounted.current) return;
        
        console.error("useStreetNameAutocomplete: Search error:", err);
        setError("Failed to load street names");
        setSuggestions([]);
        setIsOpen(false);
      } finally {
        if (mounted.current) {
          setIsLoading(false);
        }
      }
    }, debounceMs);
  }, [debounceMs]);

  /**
   * Handle input value changes
   */
  const handleInputChange = useCallback((value) => {
    setInputValue(value);
    searchStreetNames(value);
  }, [searchStreetNames]);

  /**
   * Handle suggestion selection
   */
  const selectSuggestion = useCallback((suggestion) => {
    const streetName = suggestion.street_name || suggestion;
    setInputValue(streetName);
    setSuggestions([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    setError(null);
  }, []);

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = useCallback((event) => {
    if (!isOpen || suggestions.length === 0) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      
      case "ArrowUp":
        event.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      
      case "Enter":
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          selectSuggestion(suggestions[selectedIndex]);
        }
        break;
      
      case "Escape":
        event.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
      
      default:
        break;
    }
  }, [isOpen, suggestions, selectedIndex, selectSuggestion]);

  /**
   * Close suggestions dropdown
   */
  const closeSuggestions = useCallback(() => {
    setIsOpen(false);
    setSelectedIndex(-1);
  }, []);

  /**
   * Clear input and suggestions
   */
  const clearInput = useCallback(() => {
    setInputValue("");
    setSuggestions([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    setError(null);
  }, []);

  /**
   * Focus handler - show suggestions if we have them
   */
  const handleFocus = useCallback(() => {
    if (suggestions.length > 0) {
      setIsOpen(true);
    }
  }, [suggestions.length]);

  /**
   * Blur handler - close suggestions with delay to allow for clicks
   */
  const handleBlur = useCallback(() => {
    // Delay closing to allow suggestion clicks
    setTimeout(() => {
      if (mounted.current) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    }, 150);
  }, []);

  return {
    inputValue,
    suggestions,
    isLoading,
    isOpen,
    selectedIndex,
    error,
    handleInputChange,
    selectSuggestion,
    handleKeyDown,
    handleFocus,
    handleBlur,
    closeSuggestions,
    clearInput
  };
};

export default useStreetNameAutocomplete;