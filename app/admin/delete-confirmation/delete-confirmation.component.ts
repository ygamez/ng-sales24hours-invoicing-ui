import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss']
})
export class DeleteConfirmationComponent implements OnInit {

  constructor(private dialogRef: NbDialogRef<DeleteConfirmationComponent>) { }

  ngOnInit() {
  }

  confirm(){
    this.dialogRef.close(true);
  }

  close() {
    this.dialogRef.close(false);
  }

}
