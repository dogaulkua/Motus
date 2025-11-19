import React from 'react';
import { useTranslation } from 'react-i18next';
import AngleGuideBase, { Descriptor } from './AngleGuideBase';

interface Props {
  score: number;
  descriptor: Descriptor;
}

const LeftAngleGuide: React.FC<Props> = ({ score, descriptor }) => {
  const { t } = useTranslation();
  return (
    <AngleGuideBase
      title={t('angles.left45.title')}
      description={t('angles.left45.description')}
      tip={t('angles.left45.tip')}
      silhouette="profile-left"
      score={score}
      descriptor={descriptor}
    />
  );
};

export default LeftAngleGuide;
