import { FormControl } from "@angular/forms";



export const emailPattern : string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
export const 	 rucPattern : string = "0-9";

export const controlIsTouched = ( controlFormName : FormControl, controlName: string) =>{
  return controlFormName.hasError('required', [controlName]) 
      && controlFormName.hasError('touched', [controlName]) ;
}