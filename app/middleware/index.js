const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const querystring = require("querystring");

function generateToken(user, expiry) {
  const { JWT_SECRET: secretKey } = process.env;
  return jwt.sign(user, secretKey, { expiresIn: expiry });
}
async function verifyToken(req, res, next) {
  try {
    const { JWT_SECRET: secretKey } = process.env;
    const { JWT_ALLOWED_ROUTES } = require("../config/app.config");
    const { isAdmin } = require("../utils");
    const { ADMIN_TOKEN } = require("../utils");
    const { hashText, decryptData } = require("../utils");
    const { getAccessToken } = require("../services/TCP_connect.service.js");
    const { getTokenFromRedis } = require("../services/redis.service.js");

    const idPattern = /^[a-fA-F0-9]{24}$|^\d+$|^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    const requestPath = req.path.replace(/\/$/, ""); 
    const parts = requestPath.split("/").filter(Boolean);

    const updatedPath = parts.map((part) => (idPattern.test(part) ? ":id" : part)).join("/");    

    const isAllowed=  JWT_ALLOWED_ROUTES.some((route) => route.path === (`/${updatedPath}`) && (!route.method || route.method === req.method))
     if (isAllowed) {
      return next();
    }
    const authToken = req.header("Authorization");
    if (!authToken) throw new Error("No token provided");
    const token = authToken.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token type not bearer token." });
    const signature = await hashText(token.split(".")[2]);
    const decoded = jwt.verify(token, secretKey);
    const decryptedUserDetails = decryptData(decoded.data);
    const userDetails = JSON.parse(decryptedUserDetails);
    const redistoken = await getTokenFromRedis(decoded.id);
        const XgridSign = req.header("X-Grid-Sign");
        if (XgridSign === ADMIN_TOKEN || signature === redistoken) {
          req.headers["X-Grid-Sign"] = undefined;
          req.user = userDetails;
          if (isAdmin(req.user)) {
            req.user.businessId = req.query.businessId;
            req.user.userId = req.query.userId;
          }
          return next();
        }
    if (userDetails.id) {
      const accessToken = await getAccessToken(userDetails.id);
      console.log("🚀 ~ verifyToken ~ accessToken:", accessToken)
      if (accessToken.length == 0) {
       throw new Error("User not logged in");
      }
      if (Date.parse(accessToken[0].expiredAt) < Date.now()) throw new Error("Token expired");
      if (accessToken[0].token === signature) {
        req.user = userDetails;
        if (isAdmin(req.user)) {
          req.user.businessId = req.query.businessId;
          req.user.userId = req.query.userId;
        }
        next();
      } else {
        res.status(401).json({ message: "Signature did not match the records" });
      }
    } else {
      throw new Error("Invalid Token");
    }
  } catch (error) {
    console.log("verifyToken ~ error:", error);
    console.error(error.message);
    res.status(401).json({ error: "Invalid token : " + error.message });
  }
}
async function rbacValidation(req, res, next) {
  const { RBAC_ALLOWED_ROUTES } = require("../config/app.config");
  const { getRolePermission } = require("../services/redis.service.js");
  const { getModulePermission } = require("../services/TCP_connect.service.js");

  if (req?.user?.role === "ADMIN" || req?.user?.role === "SUPER_ADMIN") {
    return next();
  }
  const token = req.header("Authorization");
  const idPattern = /^[a-fA-F0-9]{24}$|^\d+$|^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  const requestPath = req.path.replace(/\/$/, "");
  const parts = requestPath.split("/").filter(Boolean);
  const version = parts[0] || null;

  if (req?.user?.role === "BUSINESS" ) {
    const businessData = {
      version: `/${version}`,
      module: req.baseUrl,
      businessId: req.user.businessId,
    };
    const allowed = await getModulePermission(token, businessData);
    if (allowed?.data?.hasPermission) {
      return next();
    } else {
      res.status(401).json({ message: "Signature did not match the records" });
    }
  }

  const endpointParts = parts.slice(1).map((part) => (idPattern.test(part) ? ":id" : part));
  const endPointPath = `/${endpointParts.join("/")}`;

  if (RBAC_ALLOWED_ROUTES.split(",").includes(`/${version}${endPointPath}`)) {
    return next();
  }
  try {
    const data = {
      module: req.baseUrl,
      version: `/${version}`,
      endPointPath: endPointPath,
      requestMethod: req.method.toUpperCase(),
    };
    const rolePermission = await getRolePermission(req.user.roleId, data, token);
    if (rolePermission) {
      return next();
    }
    throw new Error(`RBAC Validation Failed. No active permissions of endpoint ${requestPath} for role - ${req.user.role}`);
  } catch (error) {
    console.error("error: ", error);
    res.status(403).json({ message: "RBAC Validation failed: " + error.message });
  }
}
async function decryptRequest(req, res, next) {
  const { decryptData } = require("../utils");

  const key = process.env.SECRET_KEY;
  if (req.query && req.query.encryptedParams) {
    const encryptedParams = req.query.encryptedParams;
    const decryptedString = await _decryptCryptoJS(encryptedParams, key);
    req.query = querystring.parse(decryptedString);
  } else if (req.body && req.body.encryptedParams) {
    const encryptedParams = req.body.encryptedParams;
    req.body = JSON.parse(decryptData(encryptedParams, key));
  }
  next();
}
async function encryptResponse(req, res, next) {
  const { ADMIN_TOKEN } = require("../utils");
  const { encryptData } = require("../utils");

  if (req.header("X-Grid-Sign") === ADMIN_TOKEN) {
    return next();
  }
  const key = process.env.SECRET_KEY;
  const oldJson = res.json;
  res.json = async (body) => {
    let encryptedObject = "";
    if (body.data) {
      encryptedObject = encryptData(body.data, key);
    }
    return oldJson.call(res, { ...body, data: encryptedObject, dataEncrypted: "true" });
  };
  next();
}

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}-${timestamp}${ext}`);
  },
});
const upload = multer({
  storage: storage,
});

module.exports = {
  generateToken,
  verifyToken,
  rbacValidation,
  decryptRequest,
  encryptResponse,
  upload,
};
