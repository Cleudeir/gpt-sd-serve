import dotenv from "dotenv";
dotenv.config();

class Environment {
  public get(EnvName: string): string {
    return process.env[EnvName] || "";
  }
}
export default new Environment();
