import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-prompt-dialog',
  templateUrl: './prompt-dialog.component.html',
  styleUrls: ['./prompt-dialog.component.scss']
})
export class PromptDialogComponent implements OnInit {

  
  constructor(public dialogRef: MatDialogRef<PromptDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: string ) { }

  ngOnInit(): void {
    
  }

  onSave(){
    this.dialogRef.close(true)
  }

  onCancel(){
    this.dialogRef.close(false)
  }

}
