import { LowerValue } from "./lower-value";
import { UpperValue } from "./upper-value";

export class OwnedAttribute {
  id: string;
  name: string;
  type: string;
  visibility: string;
  elementType: string;
  aggregation: string;
  order: number;
  lowerValueId: number;
  lowerValue: LowerValue;
  upperValueId: number;
  upperValue: UpperValue;
  relationShip: string;
  relationShipModel: string;
  relationShipType: string;
}
