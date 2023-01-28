import path from 'path';
import {readdir, mkdir, writeFile} from 'fs/promises';
import {createReadStream, createWriteStream} from 'fs';
import converterToWebp from './converter.js';
import {calculateHash} from './hash.js';

type FileInfo = {
  root: string;
  dir: string;
  base: string;
  ext: string;
  name: string;
};

const program = require('commander');
program.option('--sourse <string>', 'Folder sourse for copy');
program.parse(process.argv);
const getSourse = program.opts();

let pathSourse = getSourse.sourse || null;

const TARGET_FOLDER = 'newFolder';

const copyFiles = async (name: FileInfo, target: string) => {
  try {
    await mkdir(target, {recursive: true});
    const picture = ['.jpg', '.JPEG', '.PNG', '.jpeg', 'JPG', 'png'];
    name.name = calculateHash(name.name);
    name.ext = picture.includes(name.ext) ? '.webp' : name.ext;

    await writeFile(path.join(target, name.name + name.ext), '', {flag: 'ax'})
      .then(() => {
        const readable = createReadStream(path.join(name.dir, name.base));
        const writable = createWriteStream(
          path.join(target, name.name + name.ext)
        );
        /*
        readable.on('error', () => {
          console.log('Copy failed, can`t read file', name.base);
        });
        writable.on('error', () => {
          console.log('Copy failed. can`t write file', name.base);
        });*/
        if (name.ext === 'webp') {
          converterToWebp(writable, path.join(name.dir, name.base));
        } else {
          readable.pipe(writable);
        }
        console.log(`${name.base}`);
      })
      .catch(() => {
        return;
      });
  } catch (err) {
    console.log(err);
  }
};

const readFolder = async (sourse: string): Promise<void> => {
  try {
    const array = await readdir(sourse, {withFileTypes: true});
    array.forEach(item => {
      if (item.isDirectory()) {
        readFolder(path.join(sourse, item.name));
      } else {
        const fileInfo = path.parse(path.join(sourse, item.name));
        copyFiles(fileInfo, TARGET_FOLDER).then(() => {
          console.log(`File ${fileInfo.base} copied to ${TARGET_FOLDER}`);
        });
      }
    });
  } catch (err) {
    console.log('Pick exist folder', err);
  }
};

if (pathSourse === null) {
  console.log('Use --sourse to pick folder');
} else {
  pathSourse = path.resolve(pathSourse);
  readFolder(pathSourse);
}
