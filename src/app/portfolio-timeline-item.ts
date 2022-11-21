import { ITimelineGroup, ITimelineItem } from "../timeline/models";
import { IPortfolio, IPortfolioProject } from "./portfolio.interface";

export type IPortfolioTimeLineGroup = ITimelineGroup<IPortfolio | IPortfolioProject, IPortfolio | IPortfolioProject>;

export interface IPortfolioTimeLineItem extends ITimelineItem<IPortfolio | IPortfolioProject> {
    convertToGroup(): IPortfolioTimeLineGroup;
}

export class TimeLinePortfolioItem implements IPortfolioTimeLineItem {
    id: number | string;
    name: string;
    canResizeLeft: boolean;
    canResizeRight: boolean;
    canDrag: boolean;
    startDate: string;
    endDate: string;
    meta: IPortfolio | IPortfolioProject;

    constructor(data: IPortfolio | IPortfolioProject) {
        this.id = data.id;
        this.name = data.name;
        this.canResizeLeft = false;
        this.canResizeRight = false;
        this.canDrag = false;
        this.startDate = (isProjectPortfolio(data) ? data.startDate : data.periodStartDate);
        this.endDate = (isProjectPortfolio(data) ? data.endDate : data.periodEndDate);
        this.meta = { ...data };
    }

    convertToGroup(): IPortfolioTimeLineGroup {
        return {
            id: this.meta.id,
            name: this.name,
            expanded: true,
            items: [this],
            meta: { ...this.meta },
        };
    }
}

export function isProjectPortfolio(data: IPortfolio | IPortfolioProject): data is IPortfolioProject {
  return (data as IPortfolioProject).isProjectUsedInPortfolio != null;
}
