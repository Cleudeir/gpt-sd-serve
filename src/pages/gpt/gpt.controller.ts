import Controller from "../../class/Controller";
import { gptService } from "./gpt.service";

export async function gptController(routeName: string, auth: boolean = true) {
  const { create } = await gptService();

  Controller.get("/" + routeName + "/create", create, auth);
}
