import { Connection, ConnectionMap } from './types';
import { connectionToString } from './utils';

export class Tile {
  providedConnections: ConnectionMap = {
    north: Connection.None,
    east: Connection.None,
    south: Connection.None,
    west: Connection.None,
  };
  acceptedConnections: ConnectionMap;

  constructor(
    providedConnections: ConnectionMap,
    acceptedConnections?: ConnectionMap
  ) {
    this.providedConnections = providedConnections;
    if (acceptedConnections) {
      this.acceptedConnections = acceptedConnections;
    } else {
      this.acceptedConnections = providedConnections;
    }
  }

  get configuration() {
    const { north, east, south, west } = this.providedConnections;
    return [north, east, south, west].map(connectionToString).join('');
  }

  toString = () => {
    const { north, east, south, west } = this.providedConnections;

    const top = `  ${connectionToString(north)}  `;
    const middle = `${connectionToString(west)}   ${connectionToString(east)}`;
    const bottom = `  ${connectionToString(south)}  `;

    return `${top}\n${middle}\n${bottom}`;
  };

  static emptyTile = () => {
    return new Tile({
      north: Connection.None,
      east: Connection.None,
      south: Connection.None,
      west: Connection.None,
    });
  };
}
