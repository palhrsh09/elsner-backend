const { S3Client, DeleteObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const multer = require("multer");
const path = require("path");

async function streamToString(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    stream.on("error", reject);
  });
}

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const bucketName = process.env.AWS_BUCKET_NAME;

const multerS3 = (options) => ({
  async _handleFile(req, file, cb) {
    try {
      const maxFileSize = 5 * 1024 * 1024;
      if (file.size > maxFileSize) {
        return cb(new Error(`File size exceeds the limit of ${maxFileSize / (1024 * 1024)} MB`));
      }

      const key = await options.key(req, file);
      const metadata = await options.metadata(req, file);

      const params = {
        Bucket: options.bucket,
        Key: key,
        Metadata: metadata,
        Body: file.stream,
      };

      const upload = new Upload({
        client: s3,
        params,
      });

      const data = await upload.done();
      cb(null, { location: data.Location, key: data.Key });
    } catch (err) {
      cb(err);
    }
  },
});

async function deleteImageFromS3(key) {
  const params = {
    Bucket: bucketName,
    Key: key,
  };
  try {
    await s3.send(new DeleteObjectCommand(params));
    console.warn("Image deleted successfully from S3 - " + key);
    return true;
  } catch (error) {
    console.warn("Image deleted successfully from S3 - " + key);
    return false;
  }
}

const uploadImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName,
    metadata: (req, file) => ({
      fieldName: file.fieldname,
    }),
    key: async function (req, file) {
      const businessId = req?.user?.businessId || "agahs-ahshsj-ahajs";
      if (!businessId) {
        throw new Error("Business ID is missing");
      }

      const folderPath = `${businessId}/userImage/`;

      const extension = path.extname(file.originalname).slice(1);
      const date = new Date().getTime();
      const fileName = `${date}-${businessId}.${extension}`;

      const filePath = folderPath + fileName;

      console.log("🚀 ~ filePath:", filePath);
      return filePath;
    },
  }),
});

module.exports = {
  deleteImageFromS3,
  uploadImage,
};
