import { Service } from "./service"
import { Taxe } from "./taxe"
import { Product } from "./product"

export class BillLineItem {
	public id: number;

	public name: string;

	public description: string;

	public category: string;

	public quantity: string;

	public serviceId: number;

	public service?: Service;

	public totalPrice: number;

	public taxId: number;

	public tax?: Taxe;

	public discount: number;

	public productId: number;

	public product?: Product;

	public update: boolean;
}
