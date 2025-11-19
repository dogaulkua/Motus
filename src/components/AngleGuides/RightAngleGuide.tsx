import React from 'react';
import { useTranslation } from 'react-i18next';
import AngleGuideBase, { Descriptor } from './AngleGuideBase';

interface Props {
  score: number;
  descriptor: Descriptor;
}

const RightAngleGuide: React.FC<Props> = ({ score, descriptor }) => {
  const { t } = useTranslation();
  return (
    <AngleGuideBase
      title={t('angles.right45.title')}
      description={t('angles.right45.description')}
      tip={t('angles.right45.tip')}
      silhouette="profile-right"
      score={score}
      descriptor={descriptor}
    />
  );
};

export default RightAngleGuide;
