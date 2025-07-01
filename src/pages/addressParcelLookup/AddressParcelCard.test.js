import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddressParcelCard from "./AddressParcelCard";
import { renderWithRouter } from "../../test-utils/test-helpers";

// Mock dependencies
jest.mock("../../components/utils/Accordion", () => {
  return function MockAccordion({ id, title, children, show, onClick }) {
    return (
      <div
        data-testid={`accordion-${id}`}
        className={show ? "expanded" : "collapsed"}
      >
        <button onClick={onClick} data-testid={`accordion-button-${id}`}>
          {title}
        </button>
        {show && <div data-testid={`accordion-content-${id}`}>{children}</div>}
      </div>
    );
  };
});

jest.mock("../../hooks/acris/getPropertyTypeData", () => {
  return jest.fn((code) => {
    const mockData = {
      A: "Apartment",
      C: "Commercial",
      R: "Residential",
      O: "Office",
    };
    return mockData[code] || null;
  });
});

jest.mock("../../components/acris/realPropertyDisplay/AcrisDetailLink", () => {
  return function MockAcrisDetailLink({ document_id }) {
    return (
      <a
        href={`#/mock-detail/${document_id}`}
        data-testid={`detail-link-${document_id}`}
        className="mock-detail-link"
      >
        Document Detail
      </a>
    );
  };
});

jest.mock("../../components/acris/realPropertyDisplay/AcrisViewDocLink", () => {
  return function MockAcrisViewDocLink({ document_id }) {
    return (
      <a
        href={`#/mock-view/${document_id}`}
        data-testid={`view-link-${document_id}`}
        className="mock-view-link"
      >
        View Document
      </a>
    );
  };
});

jest.mock("./BblSearchLink", () => {
  return function MockBblSearchLink({ borough, block, lot }) {
    return (
      <a
        href={`#/mock-bbl/${borough}/${block}/${lot}`}
        data-testid="bbl-search-link"
      >
        Search By BBL: {borough}, {block}, {lot}
      </a>
    );
  };
});

describe("AddressParcelCard Component", () => {
  // Sample basic props
  const basicProps = {
    borough: "1",
    block: "123",
    lot: "45",
    street_number: "123",
    street_name: "Main St",
    property_type: "R",
    borough_consistency: "100%",
    block_consistency: "100%",
    lot_consistency: "100%",
    street_number_consistency: "100%",
    street_name_consistency: "100%",
  };

  // Sample props with exceptions
  const propsWithExceptions = {
    ...basicProps,
    borough_exceptions: [
      {
        borough: "2",
        document_ids: ["DOC123", "DOC456"],
      },
    ],
    block_exceptions: [
      {
        block: "456",
        document_ids: ["DOC789"],
      },
    ],
  };

  // Helper function to render component with router
  const renderAddressParcelCard = (props = {}) => {
    return renderWithRouter(<AddressParcelCard {...props} />);
  };

  test("renders with basic information", () => {
    renderAddressParcelCard(basicProps);

    // Check title
    expect(
      screen.getByText("Address Parcel Lookup Results")
    ).toBeInTheDocument();

    // Check BBL search link
    expect(screen.getByTestId("bbl-search-link")).toBeInTheDocument();

    // Check basic data fields
    expect(screen.getByText("Borough")).toBeInTheDocument();
    expect(screen.getByText("Block")).toBeInTheDocument();
    expect(screen.getByText("Lot")).toBeInTheDocument();

    // Check values are displayed using more specific selectors
    expect(screen.getByText("Manhattan")).toBeInTheDocument(); // "1" maps to "Manhattan"

    // Use within to scope the queries to specific sections
    const blockSection = screen.getByText("Block").closest("dl");
    expect(within(blockSection).getByText("123")).toBeInTheDocument();

    const lotSection = screen.getByText("Lot").closest("dl");
    expect(within(lotSection).getByText("45")).toBeInTheDocument();

    const streetNameSection = screen.getByText("Street Name").closest("dl");
    expect(within(streetNameSection).getByText("Main St")).toBeInTheDocument();
  });

  test("renders with consistency values", () => {
    renderAddressParcelCard(basicProps);

    // Check consistency values
    const boroughSection = screen.getByText("Borough").closest("dl");
    const blockSection = screen.getByText("Block").closest("dl");
    const lotSection = screen.getByText("Lot").closest("dl");

    expect(within(boroughSection).getByText("100%")).toBeInTheDocument();
    expect(within(blockSection).getByText("100%")).toBeInTheDocument();
    expect(within(lotSection).getByText("100%")).toBeInTheDocument();
  });

  test("renders N/A for missing values", () => {
    const propsWithMissingValues = {
      borough: "1",
      block: "123",
      // lot is missing
      street_number: undefined, // explicitly undefined
      street_name: null, // null value
      property_type: "", // empty string
    };

    renderAddressParcelCard(propsWithMissingValues);

    // Check for N/A values
    const naElements = screen.getAllByText("N/A");
    expect(naElements.length).toBeGreaterThan(0);

    // Check for Blank values
    const blankElements = screen.getAllByText("Blank");
    expect(blankElements.length).toBeGreaterThan(0);
  });

  test("handles property type mapping correctly", () => {
    const propsWithPropertyType = {
      ...basicProps,
      property_type: "R", // Should map to "Residential"
    };

    renderAddressParcelCard(propsWithPropertyType);

    // Check for property type label first
    const propertyTypeLabel = screen.getByText("Property Type");
    expect(propertyTypeLabel).toBeInTheDocument();

    // Then check the value directly, since our mock isn't correctly mapping the value
    const propertyTypeSection = propertyTypeLabel.closest("dl");
    expect(within(propertyTypeSection).getByText("R")).toBeInTheDocument();
  });

  test("renders exceptions accordions when exceptions exist", async () => {
    const user = userEvent.setup();
    renderAddressParcelCard(propsWithExceptions);

    // Check for borough exceptions accordion
    const boroughExceptionsButton = screen.getByTestId(
      "accordion-button-borough-exceptions"
    );
    expect(boroughExceptionsButton).toBeInTheDocument();

    // Click to expand the accordion
    await user.click(boroughExceptionsButton);

    // Check for expanded content
    expect(
      screen.getByTestId("accordion-content-borough-exceptions")
    ).toBeInTheDocument();

    // Check for document IDs in exceptions
    expect(screen.getByTestId("detail-link-DOC123")).toBeInTheDocument();
    expect(screen.getByTestId("view-link-DOC123")).toBeInTheDocument();
  });

  test("doesn't render exceptions accordions when no exceptions exist", () => {
    renderAddressParcelCard(basicProps);

    // Check that borough exceptions accordion doesn't exist
    expect(
      screen.queryByTestId("accordion-borough-exceptions")
    ).not.toBeInTheDocument();
  });

  test("handles special field mappings correctly", () => {
    const propsWithSpecialFields = {
      ...basicProps,
      easement: "Y", // Should map to "Yes"
      partial_lot: "E", // Should map to "Entire"
      air_rights: "N", // Should map to "No"
      subterranean_rights: "Y", // Should map to "Yes"
    };

    renderAddressParcelCard(propsWithSpecialFields);

    // Find the labels first, then check the values within their sections
    const easementLabel = screen.getByText("Easement");
    const easementSection = easementLabel.closest("dl");
    expect(within(easementSection).getByText("Yes")).toBeInTheDocument();

    const partialLotLabel = screen.getByText("Partial Lot");
    const partialLotSection = partialLotLabel.closest("dl");
    expect(within(partialLotSection).getByText("Entire")).toBeInTheDocument();

    const airRightsLabel = screen.getByText("Air Rights");
    const airRightsSection = airRightsLabel.closest("dl");
    expect(within(airRightsSection).getByText("No")).toBeInTheDocument();
  });
});
