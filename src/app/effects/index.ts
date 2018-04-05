import { AuthEffects } from 'app/effects/auth';
import { UserEditEffects } from 'app/effects/user-edit';
import { AppNotifyEffects } from 'app/effects/app-notify';

export const effects = [AuthEffects, UserEditEffects, AppNotifyEffects];
