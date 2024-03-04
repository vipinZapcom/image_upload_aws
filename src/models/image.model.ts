import mongoose from 'mongoose';

const {Schema} = mongoose;

/* The code is defining a schema for a collection of images in a MongoDB database
using Mongoose. The schema specifies the structure and data types of the fields
in each image document. */
const imagesSchema = new Schema({
  imagename: {type: String, required: true},
  originalName: {type: String, required: true},
});
export const Images = mongoose.model('Images', imagesSchema);
