import { Plan } from "./plan";

export class Discount {

	public id: number;

	public createdById: number;

	public name: string;

	public planId: number;

  public plan: Plan;

	public code: string;

	public value: string;

	public quantity: string;

}
