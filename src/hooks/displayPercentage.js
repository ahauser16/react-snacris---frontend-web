function displayPercentage(percentage) {
    if (percentage === null || percentage === undefined) {
        return 'N/A';
    }
    return `${Number(percentage).toFixed(0)}%`;
}
export default displayPercentage;