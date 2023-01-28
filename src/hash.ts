import {createHash} from 'crypto';

export const calculateHash = (content: string): string => {
  const hash = createHash('sha256');
  return hash.update(content).digest('hex');
};
