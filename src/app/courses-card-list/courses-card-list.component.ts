import {Component, inject, input, output} from '@angular/core';
import {RouterLink} from "@angular/router";
import {Course} from "../models/course.model";
import {MatDialog} from "@angular/material/dialog";
import { opendEditCoursedialog } from '../edit-course-dialog/edit-course-dialog.component';

@Component({
    selector: 'courses-card-list',
    imports: [
        RouterLink
    ],
    templateUrl: './courses-card-list.component.html',
    styleUrl: './courses-card-list.component.scss'
})
export class CoursesCardListComponent {

    courses = input.required<Course[]>();

    dialog = inject(MatDialog);

    async onEditCourse(course: Course) {
        const newCourse = await opendEditCoursedialog(
            this.dialog,
            {
                mode: 'update',
                title: 'Update existing Course',
                course
            }
        )
    }

}
