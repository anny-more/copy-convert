import {WriteStream} from 'fs';
// eslint-disable-next-line node/no-extraneous-import
import sharp from 'sharp';

const converterToWebp = async (target: WriteStream, arg: string) => {
  //const imageProcessing = sharp();

  await sharp(arg).webp().pipe(target);
};

export default converterToWebp;
