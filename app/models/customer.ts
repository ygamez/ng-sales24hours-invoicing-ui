import { Address } from "./address"

export class  Customer {


	public id: number;

	public createdById: number;

	public createdAt: Date;

	public updateAt: Date;

	public email: string;

	public name: string;

	public ruc: string;

	public phone: string;

	public password: string;

	public billingAddressId: number;

	public billingAddress?: Address;

	public shippingAddressId: number;

	public shippingAddress: Address;
}
