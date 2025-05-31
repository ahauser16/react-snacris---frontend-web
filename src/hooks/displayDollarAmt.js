function displayDollarAmt(amount) {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return '';
    }

    const parsedAmount = parseFloat(amount);
    const options = {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: parsedAmount % 1 === 0 ? 0 : 2,
    };

    return parsedAmount.toLocaleString('en-US', options);
}

export default displayDollarAmt;