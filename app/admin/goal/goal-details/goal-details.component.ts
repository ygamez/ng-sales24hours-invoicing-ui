import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Goal } from 'src/app/models/goal';
import { GoalService } from 'src/app/service/goal.service';

@Component({
	selector: 'goal-details',
	templateUrl: './goal-details.component.html',
	styleUrls: ['./goal-details.component.scss']
})
export class GoalDetailsComponent implements OnInit {
	public goal: Goal;

	constructor(private route: ActivatedRoute, private router: Router, private dataService : GoalService) {}

	public ngOnInit(): void {
	}
}
