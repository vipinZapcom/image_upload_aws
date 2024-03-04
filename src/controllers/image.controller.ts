import {inject} from '@loopback/core';
import {
  Request,
  Response,
  ResponseObject,
  RestBindings,
  get,
  post,
  response,
} from '@loopback/rest';
import 'dotenv/config';
import {IMAGE_END_POINTS} from '../constants';
import {FileDetails} from '../dtos/file.dto';
import {storeNewImage, uploadFileAsync} from '../services/image.service';
import {ResponseDTO} from '../utils/common.dtos';

/**
 * OpenAPI response for image()
 */
const IMAGE_RESPONSE: ResponseObject = {
  description: 'Image Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'ImageResponse',
        properties: {
          greeting: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
          headers: {
            type: 'object',
            properties: {
              'Content-Type': {type: 'string'},
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

/**
 * A simple controller to bounce back http requests
 */

export class ImageController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(RestBindings.Http.RESPONSE) private res: Response,
  ) {}

  // Map to `GET /image`
  @get('/image')
  @response(200, IMAGE_RESPONSE)
  image(): object {
    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'Hello from LoopBack',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }

  @post(IMAGE_END_POINTS.STORE_IMAGE)
  @response(200, {
    description: 'Success',
    headers: {
      'Content-Type': 'application/json',
    },
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            error: {type: 'string', example: ''},
            isError: {type: 'boolean', example: false},
            data: {
              type: 'object',
              properties: {
                _id: {type: 'string', example: '65cb405719115d990ad1bee5'},
                id: {type: 'integer', example: 102},
                name: {type: 'string', example: 'image.jpg'},
                url: {type: 'string', example: ''},
                description: {type: 'string', example: 'new title'},
                __v: {type: 'integer', example: 0},
              },
            },
            statusCode: {type: 'integer', example: 200},
          },
        },
      },
    },
  })
  @response(404, {
    description: 'Not Found',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: "image having id 103 doesn't exists",
            },
            isError: {type: 'boolean', example: false},
            data: {type: 'array', example: []},
            statusCode: {type: 'integer', example: 404},
          },
        },
      },
    },
  })
  @response(500, {
    description: 'Internal Server Error',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            error: {type: 'string', example: 'Internal Server Error'},
            isError: {type: 'boolean', example: true},
            data: {type: 'null', example: null},
            statusCode: {type: 'integer', example: 500},
          },
        },
      },
    },
  })
  // @intercept(getFile)
  // This is the corresponding function that will handle the GET image by id request
  async storeImage(): Promise<ResponseDTO> {
    try {
      await uploadFileAsync(this.req, this.res);
      if (!this.req.file) {
        throw new Error('No file uploaded');
      }

      const {originalname, encoding, mimetype, buffer} = this.req.file;
      const fileDetails: FileDetails = {
        originalname,
        encoding,
        mimetype,
        buffer,
      };

      return await storeNewImage(fileDetails);
      // return await createResponseObject('', 200, false, '', null);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Error uploading file');
    }
  }
}
