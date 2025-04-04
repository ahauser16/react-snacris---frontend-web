import docControlCodes from './docControlCodes.json';

function getDocTypeData(doc__type) {
    for (const code of docControlCodes) {
        if (code.doc__type === doc__type) {
            return {
                doc__type_description: code.doc__type_description,
                class_code_description: code.class_code_description,
                party1_type: code.party1_type,
                party2_type: code.party2_type || null,
                party3_type: code.party3_type || null
            };
        }
    }
    return null; // Return null if no match is found
}

export default getDocTypeData;