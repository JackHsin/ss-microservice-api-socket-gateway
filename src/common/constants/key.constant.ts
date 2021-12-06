import * as fs from 'fs';
import '../../setup-env';

export const adminPublicKey = fs.readFileSync(
  process.env.AOM_JWT_ADMIN_PUBLIC_KEY_PATH,
  {
    encoding: 'utf8',
    flag: 'r',
  },
);
