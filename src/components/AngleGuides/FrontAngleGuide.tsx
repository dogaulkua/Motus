import React from 'react';
import { useTranslation } from 'react-i18next';
import AngleGuideBase, { Descriptor } from './AngleGuideBase';

interface Props {
  score: number;
  descriptor: Descriptor;
}

const FrontAngleGuide: React.FC<Props> = ({ score, descriptor }) => {
  const { t } = useTranslation();
  return (
    <AngleGuideBase
      title={t('angles.front.title')}
      description={t('angles.front.description')}
      tip={t('angles.front.tip')}
      silhouette="front"
      score={score}
      descriptor={descriptor}
    />
  );
};

export default FrontAngleGuide;
