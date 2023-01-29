export interface Settings {
    majorGridlines?: number
    minorGridlines?: number
}

export const defaultSettings = (overrides: Settings) : Settings =>{
    const defaults: Settings ={}
    return {
        ...defaults,
        ...overrides
    }
}