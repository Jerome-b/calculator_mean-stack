import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TokenStorageService } from 'src/app/backend/services/token-storage.service';
import { ResultService } from '../../backend/services/result.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  errorMessage = '';
  resultForm: FormGroup;
  isLoggedIn = false;
  userUsername: string;
  newCalc = false;
  allResults: any = [];

  result = '';
  input = '';

  constructor(
    private resultService: ResultService,
    private tokenStorageService: TokenStorageService,
    public fb: FormBuilder,
  ) {
    this.mainForm();
   }

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    this.input = '0';
    this.newCalc = true;

    this.readResults();
  }

  mainForm() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.userUsername = user.username;
    }
    this.resultForm = this.fb.group({
      username: [this.userUsername, [Validators.nullValidator]],
      formula: [''],
      result: [''],
    });
  }

  press(item: string) {
    // Do not allow . more than once
    if (item === '.') {
      if (this.input !== '' ) {
        const lastNum = this.getLastOperand();
        console.log(lastNum.lastIndexOf('.'));
        if (lastNum.lastIndexOf('.') >= 0) {
          return;
        }
      }
    }
    // reset when it is a new calculation
    if (this.newCalc === true) {
      this.input = '';
      this.newCalc = false;
    }
    if (item === '0') {
      if (this.input === '' ) {
        return;
      }
    }
    this.input = this.input + item;
  }

  delInput() {
    this.input = this.input.slice(0, this.input.length - 1);
  }

  getLastOperand() {
    let pos: number;
    console.log(this.input);
    pos = this.input.toString().lastIndexOf('+');
    if (this.input.toString().lastIndexOf('-') > pos) {
      pos = this.input.lastIndexOf('-');
    }
    if (this.input.toString().lastIndexOf('*') > pos) {
      pos = this.input.lastIndexOf('*');
    }
    if (this.input.toString().lastIndexOf('/') > pos) { pos = this.input.lastIndexOf('/');
    }
    console.log('Last ' + this.input.substr(pos + 1));
    return this.input.substr(pos + 1);
  }

  pressOperator(op: string) {
    // Do not allow operators more than once
    const lastKey = this.input[this.input.length - 1];
    if (lastKey === '/' || lastKey === '*' || lastKey === '-' || lastKey === '+')  {
      return;
    }

    this.input = this.input + op;
    this.calcAnswer();
  }

  // clear input, C button
  allClear() {
    this.result = '';
    this.input = '0';
    this.newCalc = true;
  }

  calcAnswer() {
    let formula = this.input;

    let lastKey = formula[formula.length - 1];

    if (lastKey === '.')  {
      formula = formula.substr(0, formula.length - 1);
    }

    lastKey = formula[formula.length - 1];

    if (lastKey === '/' || lastKey === '*' || lastKey === '-' || lastKey === '+' || lastKey === '.')  {
      formula = formula.substr(0, formula.length - 1);
    }

    console.log('Formula ' + formula);
    // tslint:disable-next-line: no-eval
    this.result = eval(formula);
  }

  getAnswer() {
    this.newCalc = true;
    this.calcAnswer();
    // if logged in, username field is filled with current user username otherwise it is filled with 'Guest'
    if (this.isLoggedIn) {
      this.resultForm.patchValue({
        username: this.userUsername,
        formula: this.input + '=',
        result: this.result
      });
    } else {
      this.resultForm.patchValue({
        username: 'Guest',
        formula: this.input + '=',
        result: this.result
      });
    }
    if (this.input !== '') {
      this.resultService.postResult(this.resultForm.value).subscribe(
        () => {
          console.log('Results successfully posted');
        }, (error) => {
          console.log(error);
        });
    }
    this.input = this.result;
    this.readResults();
  }

  signOut() {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

  // fetch formula and results data
  readResults() {
    this.resultService.getResults().subscribe((data) => {
      this.allResults = data;
    });
  }

}
