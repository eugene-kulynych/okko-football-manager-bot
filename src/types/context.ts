import {
    SceneContextScene,
    SceneSession,
    WizardContextWizard,
    WizardSessionData,
} from 'telegraf/scenes';
import { Context } from 'telegraf';

export interface CustomWizardSessionData {
    tgChannelId?: number;
    channelName?: string;
    pairPattern?: string;
    directionPattern?: string;
    entryZonePattern?: string;
    takeProfitPattern?: string;
    stopLossPattern?: string;
    teamCount?: number;
    playersCount?: number;
}

export type DatePickData = Report;

export interface SessionData extends WizardSessionData {
    awaitingModeratorData: boolean;
    awaitingChannelData: boolean;
    joinedByLink: boolean;
    wizardSessionData: CustomWizardSessionData;
    datePicker: DatePickData;
    pagination: {
        currentPage: number;
        totalPages: number;
        startIndex: number;
        endIndex: number;
        itemsPerPage: number;
    }
}

export interface MyContext extends Context {
    session: SceneSession<SessionData>;
    scene: SceneContextScene<MyContext, WizardSessionData>;
    wizard: WizardContextWizard<MyContext>;
    args?: string[];
    pollId?: string;
}
