import { LabeledMap, ArrayedMap } from "./maps.js";
export function NestedLabeledMap() {
    const baseMap = LabeledMap();
    return {
        ...baseMap,
        setNested(key, value) {
            baseMap.set(key, value);
        },
        getNested(key) {
            return baseMap.get(key);
        },
        export() {
            const result = {};
            for (const [key, value] of baseMap.entries()) {
                if (value && typeof value === 'object' && 'export' in value) {
                    result[key] = value.export();
                }
                else {
                    result[key] = value;
                }
            }
            return result;
        },
        import(data) {
            for (const [key, value] of Object.entries(data)) {
                if (value && typeof value === 'object' && !Array.isArray(value)) {
                    const nestedMap = NestedLabeledMap();
                    nestedMap.import(value);
                    baseMap.set(key, nestedMap);
                }
                else {
                    baseMap.set(key, value);
                }
            }
            return baseMap;
        }
    };
}
export function NestedArrayedMap() {
    const baseMap = ArrayedMap();
    return {
        ...baseMap,
        setNested(index, value) {
            baseMap.set(index, value);
        },
        getNested(index) {
            return baseMap.get(index);
        },
        export() {
            const result = [];
            for (const [index, value] of baseMap.entries()) {
                if (value && typeof value === 'object' && 'export' in value) {
                    result[index] = value.export();
                }
                else {
                    result[index] = value;
                }
            }
            return result;
        },
        import(data) {
            data.forEach((value, index) => {
                if (value && typeof value === 'object' && !Array.isArray(value)) {
                    const nestedMap = NestedArrayedMap();
                    nestedMap.import(value);
                    baseMap.set(index, nestedMap);
                }
                else {
                    baseMap.set(index, value);
                }
            });
            return baseMap;
        }
    };
}
