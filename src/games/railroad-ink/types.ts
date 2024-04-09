export enum Connection {
    Road = "Road",
    Rail = "Rail",
    None = "None",
}

export interface ConnectionMap {
    north: Connection;
    east: Connection;
    south: Connection;
    west: Connection;
}