import type { InferGetStaticPropsType, NextPage } from 'next';
import { SceneName } from '../src/SceneController';
import { FALLBACK_PROJECTS } from '../src/fallbackProjects';

export async function getStaticProps() {
  const scene: SceneName = 'intro';
  return {
    props: {
      projects: FALLBACK_PROJECTS,
      scene,
    },
  };
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

const ScenePage: NextPage<Props> = () => null;

export default ScenePage;
