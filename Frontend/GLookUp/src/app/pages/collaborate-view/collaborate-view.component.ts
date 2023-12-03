import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/models/Project/project.model';
import { StudentData } from 'src/app/models/Student/student.model';
import { EmailService } from 'src/app/services/email/email.service';
import { ProjectService } from 'src/app/services/project/project.service';
import { StudentService } from 'src/app/services/student/student.service';

@Component({
  selector: 'app-collaborate-view',
  templateUrl: './collaborate-view.component.html',
  styleUrls: ['./collaborate-view.component.scss']
})
export class CollaborateViewComponent {

  loggedIn: number = 0
  collaborateWith: number = 0
  receiver?: StudentData
  sender: StudentData = {
    id: 0,
    name: '',
    email: '',
    github: '',
    password: '',
    rating: 0,
    total_ratings: 0,
    total_collaborators: 0,
    yes_collaborators: 0,
    approved: false
  };
  pendingProjects: Project[] = []
  completedProjects: Project[] = []

  projectName: string = ''
  projectDescription: string = ''
  projectMessage: string = ''

  constructor(private route: ActivatedRoute, private emailService: EmailService, private studentService: StudentService, private router: Router, private projectService: ProjectService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.collaborateWith = params['collaborate'];
      this.loggedIn = params['loggedIn'];

      this.projectService.getProjects(this.loggedIn).subscribe({
        next: (response) => {
          this.pendingProjects = response.filter(project => project.status === 'pending');
          this.completedProjects = response.filter(project => project.status === 'done');
        }
      });
      
      this.studentService.getStudentById(this.loggedIn).subscribe({
        next: (senderResponse) => {
          this.sender = senderResponse;
        }
      });
    });
  }

  onSubmit() {
    this.studentService.getStudentById(this.collaborateWith).subscribe({
      next: (receiverResponse) => {
        let receiver = receiverResponse;
        console.log(receiver)

        this.emailService.sendEmail(receiver.name, receiver.email, this.sender.name, this.sender.email, this.projectName, this.projectDescription, this.projectMessage).subscribe();
      }
    });

    this.projectService.newProject(this.loggedIn, this.collaborateWith, this.projectName, 'pending').subscribe();
    location.reload();
  }

  viewProfile(collaboratorId: number) {
    this.router.navigate(['/profile'], {
      queryParams: { search: collaboratorId, loggedIn: this.loggedIn }
    });
  }

  goHome() {
    this.router.navigate(['/studentView'], {
      queryParams: { loggedIn: this.loggedIn }
    }).catch(error => {
      console.error('Navigation error:', error);
    });
  }
}
