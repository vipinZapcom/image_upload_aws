import {Document, Types} from 'mongoose';
import {ImageToDb} from '../dtos/file.dto';
import {Images} from '../models/image.model';

/**
 * Saves a new post object to the database.
 */
export async function saveImageToDb(postObject: ImageToDb): Promise<
  Document<unknown, {}, ImageToDb> &
    ImageToDb & {
      _id: Types.ObjectId;
    }
> {
  try {
    return await new Images(postObject).save();
  } catch (error) {
    throw error;
  }
}
