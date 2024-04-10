import { Connection } from './types';

export const connectionToString = (connection: Connection) => {
  switch (connection) {
    case Connection.Road:
      return 'R';

    case Connection.Rail:
      return 'T';

    case Connection.None:
      return 'N';
  }
};
