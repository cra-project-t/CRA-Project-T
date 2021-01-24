export const uri = {
  dev: {
    app: "http://localhost:5001/cra-project-t/asia-northeast3/app",
  },
  prod: {
    app: "https://asia-northeast3-cra-project-t.cloudfunctions.net/app",
  },
};

export const uriList =
  process.env.NODE_ENV === "production" ? uri.prod : uri.dev;

export default uriList;
