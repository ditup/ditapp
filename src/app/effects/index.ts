import { AuthEffects } from './auth';
import { UserEditEffects } from './user-edit';
import { AppNotifyEffects } from './app-notify';
import { effects as entityEffects } from './entities';

export const effects = [AuthEffects, UserEditEffects, AppNotifyEffects, ...entityEffects];
