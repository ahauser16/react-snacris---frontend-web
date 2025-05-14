import React from "react";

function DateRange({ dateRange, setDateRange, rangeName }) {
  function calculateDateRange(days) {
    const currentDate = new Date();
    const startDate = new Date();
    startDate.setDate(currentDate.getDate() - days);
    return {
      start: startDate.toISOString().split("T")[0],
      end: currentDate.toISOString().split("T")[0],
    };
  }

  function getPredefinedDateRange(option) {
    switch (option) {
      case "last-7-days":
        return calculateDateRange(7);
      case "last-30-days":
        return calculateDateRange(30);
      case "last-90-days":
        return calculateDateRange(90);
      case "last-1-year":
        return calculateDateRange(365);
      case "last-2-years":
        return calculateDateRange(365 * 2);
      case "last-5-years":
        return calculateDateRange(365 * 5);
      default:
        return { start: "", end: "" };
    }
  }

  function handleDateRangeChange(evt) {
    const { name, value } = evt.target;

    if (name === `${rangeName}_range`) {
      if (value === "custom-date-range") {
        setDateRange((data) => ({
          ...data,
          [`${rangeName}_range`]: value,
          [`${rangeName}_start`]: "",
          [`${rangeName}_end`]: "",
        }));
      } else {
        const dateRange = getPredefinedDateRange(value);
        setDateRange((data) => ({
          ...data,
          [`${rangeName}_range`]: value,
          [`${rangeName}_start`]: dateRange.start,
          [`${rangeName}_end`]: dateRange.end,
        }));
      }
    } else {
      setDateRange((data) => ({
        ...data,
        [name]: value,
      }));
    }
  }

  return (
    <div>
      <select
        className="form-select form-select-lg mb-1"
        name={`${rangeName}_range`}
        value={dateRange[`${rangeName}_range`]}
        onChange={handleDateRangeChange}
      >
        <option value="to-current-date-default">To Current Date</option>
        <option value="last-7-days">Last 7 Days</option>
        <option value="last-30-days">Last 30 Days</option>
        <option value="last-90-days">Last 90 Days</option>
        <option value="last-1-year">Last 1 Year</option>
        <option value="last-2-years">Last 2 Years</option>
        <option value="last-5-years">Last 5 Years</option>
        <option value="custom-date-range">Choose Custom Date Range</option>
      </select>

      {dateRange[`${rangeName}_range`] === "custom-date-range" && (
        <div className="mt-3">
          <label htmlFor={`${rangeName}_start`} className="form-label">
            Start Date:
          </label>
          <input
            type="date"
            id={`${rangeName}_start`}
            name={`${rangeName}_start`}
            className="form-control mb-3"
            value={dateRange[`${rangeName}_start`]}
            onChange={handleDateRangeChange}
          />
          <label htmlFor={`${rangeName}_end`} className="form-label">
            End Date:
          </label>
          <input
            type="date"
            id={`${rangeName}_end`}
            name={`${rangeName}_end`}
            className="form-control mb-1"
            value={dateRange[`${rangeName}_end`]}
            onChange={handleDateRangeChange}
          />
        </div>
      )}
    </div>
  );
}

export default DateRange;