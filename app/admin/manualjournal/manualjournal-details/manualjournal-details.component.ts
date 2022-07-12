import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { ManualJournal } from 'src/app/models/manualjournal';
import { Status } from 'src/app/models/status';
import { ManualJournalService } from 'src/app/service/manualjournal.service';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { Transaction } from 'src/app/models/transaction';
import { CategoryEnum } from 'src/app/models/category-enum';
import { TransactionService } from 'src/app/service/transaction.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'manualjournal-details',
	templateUrl: './manualjournal-details.component.html',
	styleUrls: ['./manualjournal-details.component.scss']
})
export class ManualJournalDetailsComponent implements OnInit {
	public manualjournal: ManualJournal;
  id: string = this.route.snapshot.params["id"];
  manualJournal: ManualJournal;
  labelOne = "Approve";
  labelTwo = "Publish";
  labelThree = "Not paid";
  approved: boolean = false;
  published: boolean = false;
  stepperIndex: number = 0;
  approvedJournalManual: string;
  publishedJournalManual: string;
  errorMessage: string;

	constructor(private route: ActivatedRoute,
    private transactionService: TransactionService,
    private router: Router,
    private translate: TranslateService,
    private manualJournalService : ManualJournalService,
    private toastrService: NbToastrService, ) {}

	public ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.approvedJournalManual').subscribe(res => this.approvedJournalManual = res);
    this.translate.get('general.publishedJournalManual').subscribe(res => this.publishedJournalManual = res);
    this.getManualJournal();
	}

  getManualJournal(){
    return this.manualJournalService.getSingle(+this.id).subscribe(
      result => {
        this.manualJournal = result;
        this.manualJournal.badgeStatus = "badge-dark";
        switch(this.manualJournal.status){
          case Status.Approved:
              this.stepperIndex = 1;
              this.approved = true;
              this.manualJournal.badgeStatus = "badge-warning";
              break;
          case Status.Publish:
            this.stepperIndex = 2;
            this.approved = true;
            this.published = true;
            this.manualJournal.badgeStatus = "badge-success";
            break;
        }
      }, error => {  console.log(error); }
    );
  }


  approve(manualJournal: ManualJournal){
    manualJournal.status = Status.Approved;
    return this.manualJournalService.update(manualJournal).subscribe(
      () => {
        if (this.stepperIndex > -1 && this.stepperIndex < 2){
          this.showToast("success", this.approvedJournalManual);
          this.getManualJournal();
        }
      },error =>{
        this.showToast("danger", this.errorMessage)
        console.log(error);
      }
    );
  }

  publish(manualJournal: ManualJournal){
    manualJournal.status = Status.Publish;
    return this.manualJournalService.update(manualJournal).subscribe(
      () => {
        if (this.stepperIndex > -1 && this.stepperIndex < 2){
          manualJournal.transaction.published = true;
          this.transactionService.update(manualJournal.transaction).subscribe(
            () =>{},
            error => {
              console.log('error');
            }
          )
          this.showToast("success", this.publishedJournalManual);
          this.getManualJournal();
        }
      },error =>{
        this.showToast("danger", this.errorMessage)
        console.log(error);
      }
    );
  }

  captureScreen(reference: string) {
    var data = document.getElementById('pdfContent');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save(reference+'.pdf'); // Generated PDF
    });
  }

  showToast(status: NbComponentStatus, message: string) {
	  this.toastrService.show(status, message, { status, duration:4000 });
	}
}
