import { inject, Injectable, Signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { firstValueFrom } from "rxjs";
import { Course } from "../models/course.model";
import { GetCoursesResponse } from "../models/get-courses.response";
import { environment } from "../../environments/environment.development";


@Injectable({
  providedIn: "root"
})
export class CoursesService {
  env = environment;

  private http = inject(HttpClient);

  async loadAllCourses(): Promise<Course[]> {
    const courses$ = this.http.get<GetCoursesResponse>(`${this.env.apiRoot}/courses`);
    const response = await firstValueFrom(courses$);

    return response.courses;
  }

  async createCourse(course: Partial<Course>): Promise<Course> {
    const courses$ = this.http.post<Course>(`${this.env.apiRoot}/courses`, course);
    const response = firstValueFrom(courses$);

    return response;
  }

  async saveCourse(courseId: string, course: Partial<Course>): Promise<Course> {
    const courses$ = this.http.put<Course>(`${this.env.apiRoot}/courses/${courseId}`, course);
    const response =  firstValueFrom(courses$);
    
    return response;
  }

  async deleteCourse(courseId: string){
    const courseDelete$ = this.http.delete(`${this.env.apiRoot}/courses/${courseId}`);
    return firstValueFrom(courseDelete$);
  }

}
