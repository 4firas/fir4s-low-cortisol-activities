// import React from 'react';
import type { InferGetStaticPropsType, NextPage } from 'next';
import { SceneName } from '../../src/SceneController';
import { fetchAllProjects } from '../../src/sanity/sanityClient';

export async function getStaticProps() {
  const projects = await fetchAllProjects();
  const scene:SceneName = 'projects';

  return {
    props: {
      projects,
      scene,
    },
  };
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Home: NextPage<Props> = () => (null);

export default Home;
