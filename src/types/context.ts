import {
  SceneContextScene,
  SceneSession,
  WizardContextWizard,
  WizardSessionData,
} from "telegraf/scenes";
import { Context } from "telegraf";

export interface MyContext extends Context {
  session: SceneSession<WizardSessionData>;
  scene: SceneContextScene<MyContext, WizardSessionData>;
  wizard: WizardContextWizard<MyContext>;
}
