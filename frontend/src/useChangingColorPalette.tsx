import { useState } from 'react';
import { useInterval } from 'usehooks-ts';
import colors from './colors';

const {
  darkGoldenrod, blueSlate, pitchBlack, rawUmber,
} = colors;
const colorPairs = [
  [darkGoldenrod, pitchBlack],
  [blueSlate, rawUmber],
  [rawUmber, darkGoldenrod],
  [pitchBlack, darkGoldenrod],
];

export const useChangingColorPalette = (speed: number) => {
  const [colorIndex, setColorIndex] = useState(0);
  useInterval(() => {
    setColorIndex((index) => (index + 1) % colorPairs.length);
  }, speed);

  return {
    bgColor: colorPairs[colorIndex][0],
    textColor: colorPairs[colorIndex][1],
  };
};
