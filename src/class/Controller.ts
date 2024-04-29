import { PathParams } from "express-serve-static-core";
import Server from "./Server";
import jsonwebtoken from "jsonwebtoken";
import Environment from "./Environment";

class Controller {
  private verifyToken(req: any, res: any) {
    const bearerToken = req?.headers?.authorization;

    if (!bearerToken || !bearerToken?.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized" });
      return null;
    }
    const token = bearerToken.slice(7);
    try {
      const user = jsonwebtoken.verify(token, Environment.get("KEY_JWT"));
      delete user.expiredAt;
      delete user.iat;
      delete user.exp;
      console.log("user: ", user);
      return user;
    } catch (error) {
      res.status(401).json({ error: error?.message + " " + error?.expiredAt });
      return null;
    }
  }
  private showUrlPath(_path, httpType) {
    console.log(
      `CREATE => ${httpType} http://localhost:${
        Environment.get("PORT") || 4000
      }${_path}`
    );
  }

  async get(path: String, _function: Function, isAuth: boolean = true) {
    const _path = path as PathParams;
    this.showUrlPath(_path, "GET");
    Server.get(_path, async (req, res) => {
      let user;
      if (isAuth) {
        user = this.verifyToken(req, res);
        if (!user) return;
      }
      const query = req.query;
      Object.keys(query).length && console.log("query : ", query);
      console.log("query, user: ", query, user);
      const result = await _function(query, user);
      res.send(result);
    });
  }
  async post(path: String, _function: Function, isAuth: boolean = true) {
    const _path = path as PathParams;
    this.showUrlPath(_path, "POST");
    Server.post(_path, async (req, res) => {
      let user;
      if (isAuth) {
        user = this.verifyToken(req, res);
        if (!user) return;
      }
      const body = req.body;
      body && console.log("body : ", body);
      const result = await _function(body, user);
      res.send(result);
    });
  }
  async put(path: String, _function: Function, isAuth: boolean = true) {
    const _path = path as PathParams;
    this.showUrlPath(_path, "PUT");
    Server.put(_path, async (req, res) => {
      let user;
      if (isAuth) {
        user = this.verifyToken(req, res);
        if (!user) return;
      }
      const query = req.query;
      const body = req.body;
      Object.keys(query).length && console.log("query : ", query);
      body && console.log("body : ", body);
      const result = await _function(query, body, user);
      res.send(result);
    });
  }
  async remove(path: String, _function: Function, isAuth: boolean = true) {
    const _path = path as PathParams;
    this.showUrlPath(_path, "DELETE");
    Server.delete(_path, async (req, res) => {
      let user;
      if (isAuth) {
        user = this.verifyToken(req, res);
        if (!user) return;
      }
      const query = req.query;
      Object.keys(query).length && console.log("query : ", query);
      const result = await _function(query, user);
      res.send(result);
    });
  }
}
export default new Controller();
