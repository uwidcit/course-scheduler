import { Component, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-starter',
  templateUrl: './starter.component.html',
  styles: [`
          #main{
            background: #fff;
            height: 100%;
          }
  `]
})
export class StarterComponent implements AfterViewInit {
  ngAfterViewInit() {}
}
