import { Component, computed, effect, inject, Injector, OnInit, signal } from '@angular/core';
import { CoursesService } from "../services/courses.service";
import { Course, sortCoursesBySeqNo } from "../models/course.model";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { CoursesCardListComponent } from "../courses-card-list/courses-card-list.component";
import { MatDialog } from "@angular/material/dialog";
import { MessagesService } from "../messages/messages.service";
import { catchError, from, throwError } from "rxjs";
import { toObservable, toSignal, outputToObservable, outputFromObservable } from "@angular/core/rxjs-interop";
import { CoursesServiceWithFetch } from '../services/courses-fetch.service';

@Component({
    selector: 'home',
    imports: [
        MatTabGroup,
        MatTab,
        CoursesCardListComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    #courses = signal<Course[]>([]);

    private courseService = inject(CoursesService);
    private courseServiceFetch = inject(CoursesServiceWithFetch);

    coursesBeginner = computed(() => {
        const courses = this.#courses();

        const coursesBeginner = courses.filter(course => course.category === 'BEGINNER');

        return coursesBeginner
    });

    coursesAdvance = computed(() => {
        const courses = this.#courses();

        const coursesAdvanced = courses.filter(course => course.category === 'ADVANCED');

        return coursesAdvanced
    });

    constructor() {
        effect(() => {
            console.log(this.coursesAdvance());
            console.log(this.coursesBeginner());
        })
    }

    ngOnInit(): void {
        this.getCourses().then();
    }

    async getCourses() {
        try {
            const course = await this.courseService.loadAllCourses();
            this.#courses.set(course.sort(sortCoursesBySeqNo));
        } catch (err) {
            console.error(err);
        }

    }

}
