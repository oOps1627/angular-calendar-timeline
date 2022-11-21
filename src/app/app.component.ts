import { Component, ViewChild } from '@angular/core';
import {
  IPortfolioTimeLineGroup,
  IPortfolioTimeLineItem,
  isProjectPortfolio,
  TimeLinePortfolioItem
} from "./portfolio-timeline-item";
import { ITimelineItem, ITimelineState } from "../timeline/models";
import { BehaviorSubject } from "rxjs";
import { TimelineComponent } from "../timeline/timeline.component";
import { DecimalPipe } from "@angular/common";
import { IPortfolio, IPortfolioProject } from "./portfolio.interface";

const FakeData = [
  {
    "id": 373,
    "name": "bbb",
    "description": "",
    "creatorId": 958,
    "owner": {
      "id": 958,
      "name": "gfh Krash",
      "email": null
    },
    "currentProgress": 0,
    "totalProgress": 0,
    "parentId": null,
    "periodStartDate": null,
    "periodEndDate": null,
    "currencyId": null,
    "currencyCode": null,
    "allocatedBudgetPortfolio": 1082,
    "allocatedBudgetProject": 345,
    "plannedAmountProject": 0,
    "actualAmountProject": 0,
    "budgetProgress": 0,
    "actualBudget": null,
    "allocatedBudget": null,
    "projects": [],
    "managers": [],
    "attachments": null
  },
  {
    "id": 432,
    "name": "vvv",
    "description": "",
    "creatorId": 958,
    "owner": {
      "id": 958,
      "name": "gfh Krash",
      "email": null
    },
    "currentProgress": 0,
    "totalProgress": 0,
    "parentId": 373,
    "periodStartDate": "2021-07-08T00:00:00",
    "periodEndDate": "2021-09-15T00:00:00",
    "currencyId": null,
    "currencyCode": null,
    "allocatedBudgetPortfolio": 45,
    "allocatedBudgetProject": 0,
    "plannedAmountProject": 0,
    "actualAmountProject": 0,
    "budgetProgress": 0,
    "actualBudget": null,
    "allocatedBudget": null,
    "projects": [
      {
        "portfolioId": 432,
        "id": 1539,
        "name": "mmnn",
        "allocatedBudgetProject": 0,
        "plannedAmountProject": 0,
        "actualAmountProject": 0,
        "budgetProgress": 0,
        "startDate": "2021-07-08T00:00:00",
        "endDate": "2021-07-14T00:00:00",
        "isProjectUsedInPortfolio": true,
        "owner": null,
        "error": null
      }
    ],
    "managers": [],
    "attachments": null
  },
]

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(TimelineComponent) timeline: TimelineComponent;
  title: string;
  timelineItems: IPortfolioTimeLineItem[] = [];
  private _items: IPortfolio[] = FakeData as any;
  private _state$ = new BehaviorSubject<ITimelineState>(null);
  private readonly decimalPipe = new DecimalPipe('en');

  readonly isPortfolioTimelineItem: (item) => boolean = item => !item.meta.isProjectUsedInPortfolio;
  readonly portfolioTimelineItem: (item) => ITimelineItem<IPortfolio> = item => <ITimelineItem<IPortfolio>>item;
  readonly projectTimelineItem: (item) => ITimelineItem<IPortfolioProject> = item => <ITimelineItem<IPortfolioProject>>item;

  set items(items: IPortfolio[]) {
    this._items = items;
    this._setTimelineItems();
  }

  get items(): IPortfolio[] {
    return this._items;
  }

  get currencyCode() {
    return '$';
  }

  get state(): ITimelineState {
    return this._state$ && this._state$.value;
  }

  ngOnInit() {
    this._setTimelineItems();
  }

  ngAfterViewInit() {

  }

  private _setTimelineItems(): void {
    const items: TimeLinePortfolioItem[] = [];

    this._items.forEach(i => {
      items.push(new TimeLinePortfolioItem(i));
      if (i.projects) {
        i.projects.forEach(project => items.push(new TimeLinePortfolioItem(project)));
      }
    });

    this.timelineItems = items;
  }

  convertTimeLineItemsToGroups(items: IPortfolioTimeLineItem[]): IPortfolioTimeLineGroup[] {
    const groups = items.map(i => i.convertToGroup());
    let parentFound = true;

    while (parentFound) {
      parentFound = false;
      for (let i = 0; i < groups.length; i++) {
        const childGroup = groups[i];
        const parentGroup = findParentGroup(groups, childGroup);
        if (parentGroup) {
          parentGroup.groups = sortGroups([...(parentGroup.groups || []), childGroup]);
          groups.splice(i, 1);
          parentFound = true;
          break;
        }
      }
    }

    stretchGroupsDatesRelativeToChildren(groups);

    return groups;
  }

  getTimelineItemTooltipTemplate(params: { from: number, to: number, currency: string }): string {
    return `
            <div><span class='f-w-600'>${this.decimalPipe.transform(params.from, '1.0-2')}</span>
                from
            </div>
            <div><span class='f-w-600'>${this.decimalPipe.transform(params.to, '1.0-2')}</span> ${params.currency}</div>
        `;
  }

  getPortfolioProgress(item: IPortfolio): number {
    if (item.allocatedBudgetProject === 0)
      return 100;

    const percents = item.actualAmountProject * 100 / item.allocatedBudgetPortfolio;

    return percents <= 100 ? percents : 100;
  }

  getProjectProgress(item: IPortfolioProject): number {
    if (item.plannedAmountProject === 0) {
      return item.actualAmountProject === 0 ? 100 : item.actualAmountProject * 100;
    }

    return item.actualAmountProject * 100 / item.plannedAmountProject;
  }
}

function stretchGroupsDatesRelativeToChildren(groups: IPortfolioTimeLineGroup[]): void {
  groups.forEach(i => deepGroupStretch(i));

  function deepGroupStretch(group: IPortfolioTimeLineGroup): { start: string, end: string } {
    if (group.groups && group.groups.length) {
      group.groups.forEach(i => {
        const dates = deepGroupStretch(i);
        const item = group.items[0];
        const startDate: string | null = item.startDate;
        const endDate: string | null = item.endDate;
        item.startDate = (startDate && new Date(startDate).getTime() < new Date(dates.start).getTime()) ? startDate : dates.start;
        item.endDate = (endDate && new Date(endDate).getTime() > new Date(dates.end).getTime()) ? endDate : dates.end;
      });
    }
    return {
      start: group.items[0].startDate,
      end: group.items[0].endDate,
    };
  }
}

function sortGroups(groups: IPortfolioTimeLineGroup[]): IPortfolioTimeLineGroup[] {
  groups.sort((a, b) => sortPortfolioItems(a.meta, b.meta));
  return groups;
}

function findParentGroup(groups: IPortfolioTimeLineGroup[], childGroup: IPortfolioTimeLineGroup): IPortfolioTimeLineGroup {
  let parentGroup;

  // @ts-ignore
  function deepSearchGroup(group: IPortfolioTimeLineGroup): IPortfolioTimeLineGroup | null {
    if (!group || parentGroup)
      return null;

    const groupId = group.meta.id;
    if (groupId === (childGroup.meta as IPortfolio).parentId || groupId === (childGroup.meta as IPortfolioProject).portfolioId) {
      parentGroup = group;
    } else {
      (group.groups || []).forEach(i => deepSearchGroup(i));
    }
  }

  (groups || []).forEach(i => deepSearchGroup(i));

  return parentGroup;
}


function sortPortfolioItems(first: IPortfolio | IPortfolioProject, second: IPortfolio | IPortfolioProject): number {
  const isFirstProject = isProjectPortfolio(first);
  const isSecondProject = isProjectPortfolio(second);

  const getStartTime = (item: IPortfolio | IPortfolioProject, isProject: boolean): number =>
    new Date(isProject ? (item as IPortfolioProject).startDate : (item as IPortfolio).periodStartDate).getTime();

  if (isFirstProject === isSecondProject) {
    return getStartTime(first, isFirstProject) > getStartTime(second, isSecondProject) ? 1 : -1;
  } else {
    return isFirstProject ? -1 : 1;
  }
}
