declare module "process" {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        TYPE?: NodeJS.ProcessEnv[string];
      }
    }
  }
}
