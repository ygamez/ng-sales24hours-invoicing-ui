import { OwnedAttribute } from "./owned-attribute";

export class PackageElement {
  id: string;
  name: string;
  elementType: string;
  modelId:string;
  visibility: string;
  createdAt:string;
  createdById: number;
  ownedAttributes: OwnedAttribute[];
}
