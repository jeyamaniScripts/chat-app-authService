const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const PROTO_PATH = path.join(__dirname, "auth.proto");

const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObject = grpc.loadPackageDefinition(packageDef);
const authPackage = grpcObject.auth;

const client = new authPackage.AuthService(
  "localhost:50052", // your gRPC port
  grpc.credentials.createInsecure()
);

// 🔥 TEST REGISTER
client.Register(
  { name: "Mani", email: "mani@grpc.com", password: "123456" },
  (err, res) => {
    console.log("REGISTER:", err || res);
  }
);

// 🔥 TEST LOGIN
client.Login(
  { email: "mani@grpc.com", password: "123456" },
  (err, res) => {
    console.log("LOGIN:", err || res);
  }
);
