import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from 'src/app/services/student/student.service';
import { AdminService } from 'src/app/services/admin/admin.service';


@Component({
  selector: 'app-signup-view',
  templateUrl: './signup-view.component.html',
  styleUrls: ['./signup-view.component.scss']
})
export class SignupViewComponent {
  selectedRole: string = 'student';

  name: string = ''
  email: string = ''
  github: string = ''
  password: string = ''
  error: string = ''

  constructor(private adminService: AdminService, private studentService: StudentService, private router: Router) {}

  

  onRoleChange(role: string) {
    this.selectedRole = role;
    this.name = ''
    this.email = ''
    this.password = ''
    this.github = ''
  }

  onSubmitAdmin() {
    if (this.name != '' && this.email != '' && this.password != ''){
      this.adminService.addAdmin(this.name, this.email, this.password).subscribe(
        response => {
          this.router.navigate(['/feedback'], {
            queryParams: { loggedIn: '', response: "Awaiting account approval" }
          }).catch(error => {
            console.error('Navigation error:', error);
          });
        }
      );
    }
    else {
      this.error = 'All information is Required!'
    }
  }

  onSubmitStudent() {
    if (this.name != '' && this.github != '' && this.password != ''){
      this.studentService.addStudent(this.name, this.email, this.password, this.github).subscribe(
        response => {
          this.router.navigate(['/feedback'], {
            queryParams: { loggedIn: '', response: "Awaiting account approval" }
          }).catch(error => {
            console.error('Navigation error:', error);
          });
        }
      );

      this.studentService.newAccountEmail(this.name, this.email).subscribe();
    }
    else {
      this.error = 'All information is Required!'
    }
  }

}
