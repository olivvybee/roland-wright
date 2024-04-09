import { Connection, ConnectionMap } from './types';


export class Tile {
  providedConnections: ConnectionMap = {
    north: Connection.None,
    east: Connection.None,
    south: Connection.None,
    west: Connection.None,
  };
  acceptedConnections: ConnectionMap;


  constructor(providedConnections: ConnectionMap, acceptedConnections?: ConnectionMap) {
    this.providedConnections = providedConnections;
    if (acceptedConnections) {
      this.acceptedConnections = acceptedConnections;
    } else {
      this.acceptedConnections = providedConnections;
    
    }
  }

  /* toString = () => {
    const str = `${colourString}${valueString}`;

    return colourise(this.colour)(str);
  }; */
}
