// import fetch from 'node-fetch';
import { createClient as createExperimentalTypesafeClient } from 'sanity-codegen';
import createClient from '@sanity/client';
// eslint-disable-next-line import/no-relative-packages
import { Documents, Project } from '../../generatedSanitySchemaTypes';
import { FALLBACK_PROJECTS } from '../fallbackProjects';

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;

const hasSanityConfig = Boolean(projectId && dataset);

const clientConfig = {
  projectId: projectId ?? 'placeholder',
  dataset: dataset ?? 'production',
  previewMode: false,
  useCdn: false,
  apiVersion: '2022-07-31',
};

const authorizedClientConfig = {
  ...clientConfig,
  token: process.env.SANITY_TOKEN ?? '',
};

export const authorizedSanityClient = hasSanityConfig ? createClient(authorizedClientConfig) : null;
export const safeSanityClient = hasSanityConfig ? createClient(clientConfig) : null;

// @ts-ignore
// eslint-disable-next-line max-len
export const authorizedSanityExperimentalTypesafeClient = hasSanityConfig ? createExperimentalTypesafeClient<Documents>({
  ...authorizedClientConfig,
  // @ts-ignore
  fetch,
}) : null;

const projectsQuery = `*[_type == "project"] | order(_createdAt asc)`;

export async function fetchAllProjects(): Promise<Project[]> {
  try {
    const projects = safeSanityClient
      ? await safeSanityClient.fetch(projectsQuery)
      : null;
    if (Array.isArray(projects) && projects.length > 0) return projects;
  } catch (e) {
    console.warn('Sanity fetch failed, using fallback:', e instanceof Error ? e.message : e);
  }
  return FALLBACK_PROJECTS as unknown as Project[];
}
