import { IIdObject } from "../timeline/models";


export interface IPortfolioProject extends IIdObject {
    portfolioId: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    allocatedBudget: number;
    budgetProgress: number;
    isProjectUsedInPortfolio: boolean;
    plannedAmountProject: number;
    allocatedBudgetProject: number;
    actualAmountProject: number;
    owner: {
        email: string;
        id: number;
        name: string;
        thumbnailUrl: string;
    };
}

export interface IPortfolioSelectionProject extends IIdObject {
    name: string;
    isProjectUsedInPortfolio?: boolean;
}

export interface IPortfolioCategory extends IIdObject {
   name: string;
   parentId?: number;
}

export interface IPortfolio extends IIdObject {
    name: string;
    description: string;
    projects: IPortfolioProject[];
    owner: IPortfolioManager;
    managers: IPortfolioManager[];
    periodStartDate: string;
    periodEndDate: string;
    actualAmountProject: number;
    allocatedBudgetPortfolio: number;
    allocatedBudgetProject: number;
    budgetProgress: number;
    currencyCode: string;
    currencyId: number;
    currentProgress: number;
    totalProgress: number;
    attachments: IPortfolioAttachment[];
    creatorId: number;
    parentId?: number;
}

export interface IPortfolioDetails {
    portfolio?: IPortfolio;
    categories?: IPortfolioCategory[];
}

export interface IPortfolioAttachment extends IIdObject {
    expenseId: number;
    fileName: string;
    name: string;
    thumbnailUrl: string;
    attachmentType: any;
    uploadedAt?: string;
    contentType?: string;
    url?: string;
}

export interface IPortfolioManager extends IIdObject {
    name: string;
    email: string;
}

export interface IPortfolioProjects extends IIdObject {
    name: string;
}
