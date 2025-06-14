 export interface smartphone { 
    id: number, 
    name: string, 
    description: string, 
    price: number, 
    brand: string, 
    category: string, 
    image: string, 
    specs: { 
        screen: string, 
        resolution: string, 
        ram: string, 
        storage: string, 
        battery: string, 
        camera: string, 
        os: string, 
    },
};
