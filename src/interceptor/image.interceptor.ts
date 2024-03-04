import {InvocationContext, Next} from '@loopback/core';
import multer from 'multer';

export const getFile = async (context: InvocationContext | any, next: Next) => {
  const storage = multer.memoryStorage();
  const upload = multer({storage: storage});

  upload.single('file')(
    context.parent.req,
    context.parent.res,
    async (err: any) => {
      if (err) {
        throw new Error('Error uploading file');
      }
      if (!context.parent.req.file) {
        throw new Error('No file uploaded');
      }
    },
  );

  return await next();
};
