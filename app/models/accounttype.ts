import { AccountTypeCategory } from "./accounttypecategory"

export class AccountType {


	public id: number;

	public createdById: number;

	public name: string;

	public accountTypeCategoryId: number;

	public accountTypeCategory: AccountTypeCategory;
}
