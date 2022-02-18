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

  getColor(type: string){
    if ( type=='core') return 'chip core'//this.core
    else return 'chip elective' //this.elective
  }
  
  constructor(public dialogRef: MatDialogRef<PromptDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: overlapData ) { }

  ngOnInit(): void {
    console.log( this.data)
  }

  onSave(){
    this.dialogRef.close(true)
  }

  onCancel(){
    this.dialogRef.close(false)
  }

}
