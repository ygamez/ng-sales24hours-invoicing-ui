import { PackageElement } from "./package-element";

export class Model {
  id: string;
  name: string;
  elementType: string;
  packageElements: PackageElement[];
}
