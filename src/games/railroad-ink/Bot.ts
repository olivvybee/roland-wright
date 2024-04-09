import { TileDice as TileDice } from "./TileDice";
import { Board } from "./Board";
import { Tile } from "./Tile";
import { Connection } from "./types";

export class Bot {
    board: Board;
    dice = [
        [
            new Tile({north: Connection.None, east: Connection.Road, south: Connection.None, west: Connection.Road}),
            new Tile({north: Connection.None, east: Connection.Road, south: Connection.Road, west: Connection.None}),
            new Tile({north: Connection.None, east: Connection.Rail, south: Connection.Rail, west: Connection.None}),
            new Tile({north: Connection.None, east: Connection.Rail, south: Connection.None, west: Connection.Rail}),
            new Tile({north: Connection.None, east: Connection.Road, south: Connection.Road, west: Connection.Road}),
            new Tile({north: Connection.None, east: Connection.Rail, south: Connection.Rail, west: Connection.Rail}),
        ],
        [
            new Tile({north: Connection.None, east: Connection.Road, south: Connection.None, west: Connection.Road}),
            new Tile({north: Connection.None, east: Connection.Road, south: Connection.Road, west: Connection.None}),
            new Tile({north: Connection.None, east: Connection.Rail, south: Connection.None, west: Connection.Rail}),
            new Tile({north: Connection.None, east: Connection.Rail, south: Connection.Rail, west: Connection.None}),
            new Tile({north: Connection.None, east: Connection.Road, south: Connection.Road, west: Connection.Road}),
            new Tile({north: Connection.None, east: Connection.Rail, south: Connection.Rail, west: Connection.Rail}),
        ],
        [
            new Tile({north: Connection.None, east: Connection.Road, south: Connection.None, west: Connection.Road}),
            new Tile({north: Connection.None, east: Connection.Road, south: Connection.Road, west: Connection.None}),
            new Tile({north: Connection.None, east: Connection.Rail, south: Connection.None, west: Connection.Rail}),
            new Tile({north: Connection.None, east: Connection.Rail, south: Connection.Rail, west: Connection.None}),
            new Tile({north: Connection.None, east: Connection.Road, south: Connection.Road, west: Connection.Road}),
            new Tile({north: Connection.None, east: Connection.Rail, south: Connection.Rail, west: Connection.Rail}),
        ],
        [
            new Tile({north: Connection.Rail, east: Connection.Road, south: Connection.Rail, west: Connection.Road}),
            new Tile({north: Connection.None, east: Connection.Road, south: Connection.None, west: Connection.Rail}),
            new Tile({north: Connection.Rail, east: Connection.Road, south: Connection.Rail, west: Connection.Road}),
            new Tile({north: Connection.None, east: Connection.Road, south: Connection.None, west: Connection.Rail}),
            new Tile({north: Connection.None, east: Connection.Road, south: Connection.Rail, west: Connection.None}),
            new Tile({north: Connection.Rail, east: Connection.None, south: Connection.None, west: Connection.Road}),
        ]
    ];
  
    constructor(board: Board) {
      this.board = board;
    }
  
    play = () => {
        for (const die of this.dice) {
            const tileDice = new TileDice(die);
            const tiles = tileDice.draw(1);
            //console.log(tiles);
        }
        //const tiles = this.tileDice.draw(4);
        //console.log(tiles);
      /* for (let round = 0; round < 10; round++) {
        const dicePool = this.roll();
  
        for (let diceCount = 0; diceCount < 2; diceCount++) {
          const move = this.chooseNextMove(dicePool);
          if (!move) {
            break;
          }
  
          const { dice, row, column } = move;
  
          _remove(dicePool, (d) => d === dice);
          this.board.placeDice(dice, row, column);
        }
      } */
  
      return this.board;
    };
}