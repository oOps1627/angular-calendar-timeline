export function generateDateId(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`;
}

export function DatesCacheDecorator(): Function {
    return function(target: any, methodName: string, descriptor: PropertyDescriptor) {
        if (!target.__datesCache) {
            target.__datesCache = new Map<string, unknown>();
        }

        const originalMethod = descriptor.value;

        descriptor.value = function(...args: Date[]) {
            const cacheKey = `${methodName}-${[...args].map(date => generateDateId(date)).join('-')}`;

            if (target.__datesCache.has(cacheKey)) {
                return target.__datesCache.get(cacheKey);
            }

            const result = originalMethod.apply(this, args);
            target.__datesCache.set(cacheKey, result);

            return result;
        };
    };
}
