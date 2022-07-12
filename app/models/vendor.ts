import { Address } from "./address"

export class Vendor {


	public id: number;

	public createdById: number;

  public createdAt: string;

	public email: string;

	public name: string;

	public civility: string;

	public phone: string;

	public password: string;

	public billingAddressId: number;

	public billingAddress?: Address;

	public shippingAddressId: number;

	public shippingAddress: Address;
}
