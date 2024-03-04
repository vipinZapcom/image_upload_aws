import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import crypto from 'crypto';
import multer from 'multer';
import {promisify} from 'util';
import {FileDetails} from '../dtos/file.dto';
const getImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

export async function storeNewImage(file: FileDetails): Promise<string> {
  // put the object in S3

  const aws_access_key: any = process.env.AWS_ACCESS_KEY;
  const aws_secret_key: any = process.env.AWS_SECRET_KEY;
  const aws_region: any = process.env.AWS_REGION;
  const bucket_name: any = process.env.BUCKET_NAME;

  const S3 = new S3Client({
    credentials: {
      accessKeyId: aws_access_key,
      secretAccessKey: aws_secret_key,
    },
    region: aws_region,
  });
  const imageName = getImageName();
  /* const buffer = sharp(file.buffer)
    .resize({height: 1920, width: 1080, fit: 'contain'})
    .toBuffer(); */
  const params = {
    Body: file.buffer,
    Key: imageName,
    Bucket: bucket_name,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(params);
  const data = await S3.send(command);
  console.log(`data`);
  console.log(data);
  const s3Url = `https://s3.amazonaws.com/${bucket_name}/${file.originalname}`;

  console.log('S3 URL:', s3Url);
  // make entry in DB

  /* return new Promise((resolve, reject) => {
    resolve;
  }) as any; */
  return 'success';
}
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
export const uploadFileAsync = promisify(upload.single('file'));
