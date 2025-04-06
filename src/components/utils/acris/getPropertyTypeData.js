import propertyTypeControlCodes from './propertyTypeControlCodes.json';

function getPropertyTypeData(propertyType) {
    for (const item of propertyTypeControlCodes) {
        if (item.property_type === propertyType) {
            return item.description;
        }
    }
    return null; // Return null if no matching property_type is found
}

export default getPropertyTypeData;