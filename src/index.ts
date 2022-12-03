import fs from 'fs';
import { Sagrada } from './games/sagrada';

const { imageBuffer, altText } = Sagrada.play();

fs.writeFileSync('/Users/olivia/Desktop/test.png', imageBuffer);
