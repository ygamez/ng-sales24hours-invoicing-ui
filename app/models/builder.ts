import { Model } from "./model";

export class Builder {
  id: string;
  creator: string;
  modelTypeName: string;
  modelTypeVersion: string;
  model: Model;
}
