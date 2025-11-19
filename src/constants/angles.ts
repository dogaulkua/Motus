import { AngleConfig } from '../types';

export const ANGLES: AngleConfig[] = [
  {
    id: 'front',
    titleKey: 'angles.front.title',
    descriptionKey: 'angles.front.description',
    tipKey: 'angles.front.tip',
    targetPitch: 0,
    targetRoll: 0,
    targetYaw: 0,
    silhouette: 'front'
  },
  {
    id: 'right45',
    titleKey: 'angles.right45.title',
    descriptionKey: 'angles.right45.description',
    tipKey: 'angles.right45.tip',
    targetPitch: 0,
    targetRoll: 0,
    targetYaw: 45,
    silhouette: 'profile-right'
  },
  {
    id: 'left45',
    titleKey: 'angles.left45.title',
    descriptionKey: 'angles.left45.description',
    tipKey: 'angles.left45.tip',
    targetPitch: 0,
    targetRoll: 0,
    targetYaw: -45,
    silhouette: 'profile-left'
  },
  {
    id: 'top',
    titleKey: 'angles.top.title',
    descriptionKey: 'angles.top.description',
    tipKey: 'angles.top.tip',
    targetPitch: -90,
    targetRoll: 0,
    targetYaw: 0,
    silhouette: 'top',
    extraAssist: true
  },
  {
    id: 'donor',
    titleKey: 'angles.donor.title',
    descriptionKey: 'angles.donor.description',
    tipKey: 'angles.donor.tip',
    targetPitch: 0,
    targetRoll: 180,
    targetYaw: 0,
    silhouette: 'donor',
    extraAssist: true
  }
];
