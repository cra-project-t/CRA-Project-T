export const config_uri = {
  dev: {
    server: "http://localhost:5001/cra-timerec-1229/asia-northeast3/app",
    client: "http://localhost:3030",
  },
  prod: {
    server: " https://asia-northeast3-cra-project-t.cloudfunctions.net/app",
    client: "",
  },
};

export const config =
  process.env.NODE_ENV === "production" ? config_uri.prod : config_uri.dev;
