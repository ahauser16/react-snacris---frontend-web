function displayPercentage(percentage) {
    if (percentage === null || percentage === undefined) {
        return 'N/A';
    }
    return `${(percentage * 100).toFixed(0)}%`;
}
export default displayPercentage;