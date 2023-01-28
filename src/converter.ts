import {WriteStream} from 'fs';
// eslint-disable-next-line node/no-extraneous-import
import sharp from 'sharp';

const converterToWebp = (target: WriteStream, arg: string) => {
  sharp(arg).webp().pipe(target);
};

export default converterToWebp;
