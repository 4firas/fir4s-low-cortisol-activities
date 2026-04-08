import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { safeSanityClient } from './sanityClient';

// Only build image URLs when a real Sanity client is available
const builder = safeSanityClient ? imageUrlBuilder(safeSanityClient) : null;

export function getSanityImageUrlFor(source: SanityImageSource) {
  return builder?.image(source) ?? null;
}
