import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface overlapData{
  title: string; 
  type: string
}


@Component({
  selector: 'app-prompt-dialog',
  templateUrl: './prompt-dialog.component.html',
  styles: [`
      .chip{ 
        margin-left: 10px;
        border-radius: 50px;
        padding: 5px 8px;
      }

      .core{
        background-color: red !important;
      }
      .elective{
        background-color: orange !important;
      
      }

      .events{
        overflow-y: auto;
      }
  `]
})
export class PromptDialogComponent implements OnInit {

  core = "red  !important"
  elective ="orange  !important"

  checked: boolean = false

  getColor(type: string){
    if ( type=='core') return 'chip core'//this.core
    else return 'chip elective' //this.elective
  }
  
  constructor(public dialogRef: MatDialogRef<PromptDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any ) { }

  toDate(startDate: string, endDate: string){
    return new Date(startDate).toDateString() + new Date(endDate).toDateString()
  }

  ngOnInit(): void {
    console.log( this.data)
  }

  onSave(){
    let results
    if(this.checked)
      results = {save: true, start: this.data.freeSlots.start, end: this.data.freeSlots.end}
    else
      results = {save: true}

    this.dialogRef.close(results)
  }

  onCancel(){
    this.dialogRef.close({save: false})
  }

}
