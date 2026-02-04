const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const PROTO_PATH = path.join(__dirname, "auth.proto");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
dotenv.config();
const {
  registerHandler,
  loginHandler,
  getUserHandler,
} = require("./handler/auth.handler");

const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObject = grpc.loadPackageDefinition(packageDef);
const authPackage = grpcObject.auth;
const server = new grpc.Server();
console.log("Loaded package:", Object.keys(grpcObject));

server.addService(authPackage.AuthService.service, {
  Register: registerHandler,
  Login: loginHandler,
  GetUser: getUserHandler,
});

const startGrpcServer = async () => {
  await connectDB();
  console.log(PROTO_PATH);
  const GRPC_PORT = process.env.GRPC_PORT || "localhost:50052";
  console.log("Binding gRPC to:", GRPC_PORT);

  server.bindAsync(
    GRPC_PORT,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error("gRPC start error:", err);
        return;
      }

      console.log(`gRPC server running on ${GRPC_PORT}`);
      // server.start(
    },
  );
};

module.exports = startGrpcServer;
