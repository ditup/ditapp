import { AuthEffects } from './auth';
import { RouterEffects } from './router';
import { UserEditEffects } from './user-edit';
import { AppNotifyEffects } from './app-notify';
import { effects as entityEffects } from './entities';

export const effects = [AuthEffects, RouterEffects, UserEditEffects, AppNotifyEffects, ...entityEffects];
