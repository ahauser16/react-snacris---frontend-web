import React, { useRef, useEffect } from "react";
import "../commonFormStyles.css";
import "./AutocompleteStreetName.css";
import Tooltip from "../../utils/Tooltip";
import useStreetNameAutocomplete from "../../../hooks/useStreetNameAutocomplete";

const AutocompleteStreetName = ({
  value,
  onChange,
  id = "street-name",
  label = "Street Name",
  required = false,
  enableAutocomplete = true,
  debounceMs = 300,
  maxSuggestions = 15,
}) => {
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const {
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
    clearInput
  } = useStreetNameAutocomplete(value, debounceMs);

  // Sync internal state with external value prop
  useEffect(() => {
    if (value !== inputValue) {
      handleInputChange(value);
    }
  }, [value, inputValue, handleInputChange])

  // Handle input changes and notify parent component
  const handleChange = (event) => {
    const newValue = event.target.value;
    handleInputChange(newValue);
    
    // Call parent onChange handler to maintain compatibility
    if (onChange) {
      onChange(event);
    }
  };

  // Handle suggestion selection
  const onSelectSuggestion = (suggestion) => {
    selectSuggestion(suggestion);
    
    // Create synthetic event to maintain compatibility with parent components
    const syntheticEvent = {
      target: {
        name: "street_name",
        value: suggestion.street_name
      }
    };
    
    if (onChange) {
      onChange(syntheticEvent);
    }
  };

  // Handle clear button click
  const handleClear = () => {
    clearInput();
    
    // Create synthetic event for clear
    const syntheticEvent = {
      target: {
        name: "street_name",
        value: ""
      }
    };
    
    if (onChange) {
      onChange(syntheticEvent);
    }
    
    // Focus back to input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Render suggestions dropdown
  const renderSuggestions = () => {
    if (!isOpen || !enableAutocomplete) return null;

    return (
      <div className="autocomplete-suggestions" role="listbox">
        {isLoading && (
          <div className="autocomplete-loading" role="status" aria-live="polite">
            Loading street names...
          </div>
        )}
        
        {error && (
          <div className="autocomplete-error" role="alert">
            {error}
          </div>
        )}
        
        {!isLoading && !error && suggestions.length === 0 && inputValue.trim() && (
          <div className="autocomplete-no-results">
            No street names found
          </div>
        )}
        
        {!isLoading && !error && suggestions.slice(0, maxSuggestions).map((suggestion, index) => (
          <div
            key={`${suggestion.street_name}-${index}`}
            className={`autocomplete-suggestion ${index === selectedIndex ? 'selected' : ''}`}
            role="option"
            aria-selected={index === selectedIndex}
            onClick={() => onSelectSuggestion(suggestion)}
            onMouseDown={(e) => e.preventDefault()} // Prevent blur on click
          >
            <p className="autocomplete-suggestion-text">
              {highlightMatch(suggestion.street_name, inputValue)}
            </p>
          </div>
        ))}
      </div>
    );
  };

  // Highlight matching characters in suggestions
  const highlightMatch = (text, searchTerm) => {
    if (!searchTerm.trim()) return text;

    const regex = new RegExp(`^(${searchTerm.trim()})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <span key={index} className="autocomplete-highlight">{part}</span>;
      }
      return part;
    });
  };

  return (
    <div className="mb-1">
      <div className="d-flex align-items-center justify-content-between">
        <label htmlFor={id} className="form-label fw-bold mb-0">
          {label}
        </label>
        <Tooltip
          helperText="Maximum length is 32 characters. Start typing to see street name suggestions. Use arrow keys to navigate, Enter to select, or Escape to close."
          label="Street Name field information"
          iconName="icon-information"
          iconClassName="ms-1"
          iconSize={20}
        />
      </div>
      
      <div 
        className="autocomplete-street-name" 
        ref={containerRef}
      >
        <div className="autocomplete-input-container">
          <input
            ref={inputRef}
            className={`form-control form-control-md uppercase autocomplete-input ${inputValue ? 'has-value' : ''}`}
            type="text"
            id={id}
            name="street_name"
            placeholder="Enter Street Name"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-required={required}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-describedby={`${id}-helper`}
            maxLength={32}
            autoComplete="off"
          />
          
          {/* Loading spinner */}
          {isLoading && <div className="autocomplete-spinner" aria-hidden="true" />}
          
          {/* Clear button */}
          {inputValue && !isLoading && (
            <button
              type="button"
              className="autocomplete-clear-button"
              onClick={handleClear}
              aria-label="Clear street name"
              tabIndex={-1}
            >
              ×
            </button>
          )}
        </div>
        
        {/* Suggestions dropdown */}
        {renderSuggestions()}
      </div>
      
      {/* Hidden helper text for screen readers */}
      <div id={`${id}-helper`} className="visually-hidden">
        {enableAutocomplete 
          ? "Street name field with autocomplete. Type to see suggestions, use arrow keys to navigate."
          : "Street name input field"
        }
      </div>
    </div>
  );
};

export default AutocompleteStreetName;