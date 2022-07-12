import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-invoice-dowload-dialog',
  templateUrl: './invoice-dowload-dialog.component.html',
  styleUrls: ['./invoice-dowload-dialog.component.scss']
})
export class InvoiceDowloadDialogComponent implements OnInit {

  constructor(private dialogRef: NbDialogRef<InvoiceDowloadDialogComponent>) { }

  ngOnInit() {
  }

  close(){
    this.dialogRef.close();
  }
}
