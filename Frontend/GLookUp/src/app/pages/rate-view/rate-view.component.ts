import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentData } from 'src/app/models/Student/student.model';
import { StudentService } from 'src/app/services/student/student.service';

@Component({
  selector: 'app-rate-view',
  templateUrl: './rate-view.component.html',
  styleUrls: ['./rate-view.component.scss']
})
export class RateViewComponent {

  studentBeingRated?: StudentData
  rateStudent: number = 0
  loggedIn: string = ''
  userRating: number = 0;
  collaborateAgain: string = '';

  constructor(private route: ActivatedRoute, private studentService: StudentService,  private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.rateStudent = params['rate'];
      this.loggedIn = params['loggedIn'];
    });

    this.studentService.getStudentById(this.rateStudent).subscribe(
      response => {
        this.studentBeingRated = response
      }
    );
  }

  submitRating(): void {
    let collaborate = false;
    if (this.collaborateAgain == 'Yes'){
      collaborate = true
    }
    this.studentService.rateStudent(this.rateStudent, this.userRating, collaborate).subscribe(
      response => {
        this.router.navigate(['/feedback'], {
          queryParams: { loggedIn: this.loggedIn, response: "Rating submitted" }
        }).catch(error => {
          console.error('Navigation error:', error);
        });
      }
    );
  }

  onCollaborateAgain(collaborateAgain: string) {
    this.collaborateAgain = collaborateAgain;
  }
}
