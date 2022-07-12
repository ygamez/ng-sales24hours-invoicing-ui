import { Category } from "./category"
import { Taxe } from "./taxe"

export class Service {


	public id: number;

	public createdById: number;

  public createdAt: Date;

  public updatedAt: Date;

	public name: string;

	public sku: string;

	public salePrice: number;

	public purchasePrice: number;

	public categoryId: number;

	public category: Category;

	public categoryName: string;

	public taxId: number;

	public tax: Taxe;

  public taxName: string;

	public description: string;
}
