import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {AuditReportService} from "src/app/services/audits/audit-report.service";
import {ManageMembersService} from "src/app/services/users/manage-members.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit, AfterViewChecked {

  id: any;
  comment_value = '';
  comments: any[];

  constructor(
    private auditReportService: AuditReportService,
    private userService: ManageMembersService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.comments = [];
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((routeParams) => {
      this.id = routeParams.ID;
    });
    this.setCommentData();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  comment(): void {
    const comment = {
      org_id: String(localStorage.getItem('organization_id')),
      ref_audit: this.id,
      content: String(this.comment_value),
      author: String(localStorage.getItem('username'))
    };

    this.auditReportService.postComment(comment).subscribe(
      (data) => {
        this.comment_value = '';
        this.setCommentData();
      },
      (err) => {
        console.log('Comment posting failed');
      }
    );

  }

  setCommentData(): void {
    this.comments = [];
    this.auditReportService.getComments(this.userService.getOrgId(), this.id).subscribe(
      (data: any) => {
        for (const item of data) {
          const newComment = {
            author: item.author,
            content: item.content,
            timestamp: new Date(Date.parse(item.created_timestamp))
          };
          this.comments.push(newComment);
        }
      }
    );
  }

  scrollToBottom = () => {
    try {
      const ch = document.getElementById('comment-history');
      if (ch != null){
        ch.scrollTop = ch.scrollHeight;
      }
    } catch (err) {}
  }

}
