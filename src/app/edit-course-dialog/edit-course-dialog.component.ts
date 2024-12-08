import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {Course} from "../models/course.model";
import {EditCourseDialogData} from "./edit-course-dialog.data.model";
import {CoursesService} from "../services/courses.service";
import {LoadingIndicatorComponent} from "../loading/loading.component";
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {CourseCategoryComboboxComponent} from "../course-category-combobox/course-category-combobox.component";
import {CourseCategory} from "../models/course-category.model";
import { firstValueFrom } from 'rxjs';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'edit-course-dialog',
  standalone: true,
  imports: [
    LoadingIndicatorComponent,
    ReactiveFormsModule,
    CourseCategoryComboboxComponent
  ],
  templateUrl: './edit-course-dialog.component.html',
  styleUrl: './edit-course-dialog.component.scss'
})
export class EditCourseDialogComponent implements OnInit{

  private dialogRef = inject(DialogRef);
  data: EditCourseDialogData = inject(MAT_DIALOG_DATA);
  private formBuilder = inject(FormBuilder);
  private courseService = inject(CoursesService);

  form = this.formBuilder.group({
    title: [''],
    longDescription: [''],
    category: [''],
    iconUrl: [''],
  });

  ngOnInit(): void {
    this.form.patchValue({
      title: this.data?.course?.title,
      longDescription: this.data?.course?.longDescription,
      category: this.data?.course?.category,
      iconUrl: this.data?.course?.iconUrl,
    });
  }

  onClose() {
    this.dialogRef.close()
  }

  async onSave() {
    const courseProp = this.form.value as Partial<Course>;
    if (this.data?.mode === 'update') {
     await this.saveCourse(this.data?.course!.id, courseProp);
    }
  }

  async saveCourse(courseId: string, course: Partial<Course>) {
    try {
      const updateCourse = await this.courseService.saveCourse(courseId, course);
      this.dialogRef.close(updateCourse);
    } catch (error) {
      console.error(error);
      alert(`Failed to save the course`);
      
    }
    
  }
}

export async function opendEditCoursedialog(dialog: MatDialog, data: EditCourseDialogData) {

  const config = new MatDialogConfig();

  config.disableClose = true;
  config.autoFocus = true;
  config.width = '400px';
  config.data = data;

  const close$ = dialog.open(EditCourseDialogComponent, config).afterClosed();
  return firstValueFrom(close$);
}
