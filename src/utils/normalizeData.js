export function normalizeData(data) {
    if (Array.isArray(data)) {
        return data.map(normalizeData);
    } else if (data && typeof data === 'object') {
        if ('$values' in data) {
            return normalizeData(data.$values);
        }
        const normalized = {};
        for (const key in data) {
            if (key !== '$id') {
                normalized[key] = normalizeData(data[key]);
            }
        }
        return normalized;
    }
    return data;
}
