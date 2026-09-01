import type { ExperienceMode,Settings } from '../types/models'

export const changeExperienceMode=(settings:Settings,experienceMode:ExperienceMode):Settings=>({...settings,experienceMode})
