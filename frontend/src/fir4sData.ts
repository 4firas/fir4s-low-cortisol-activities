// SITE METADATA
export const siteData = {
  name: "fir4s",
  brand: "fir4s: stills. motion. design. sound.",
  title: "(¬‿¬) fir4s",
  description: "My one and only website~",
  url: "https://fir4s.com",
  twitterHandle: "@fir4s",
};

// ABOUT / BIO
export const bio = `Hey! I'm Fir4s (also known as Tsk).

I'm a 17-year-old ILCA 4 sailor and I also like photography and cinematography. ^-^

The reason why I choose Fir4s comes down to 4 things I do and love:

Stills. Motion. Design. Sound.

Camera: Canon EOS M6

I love making my videos look like "memories".`;

// WHAT I DO / SKILLS
export interface SkillCategory {
  category: string;
  items: string[];
}

export const skills: SkillCategory[] = [
  { category: "Photography", items: ["Urban architecture", "Street photography", "Nature", "Cultural scenes"] },
  { category: "Videography & Editing", items: ["Coloring", "VFX", "After Effects", "DaVinci Resolve"] },
  { category: "Web Development", items: ["Next.js", "React/TypeScript", "AI-assisted development"] },
  { category: "Sailing", items: ["ILCA 4 class"] },
  { category: "Programming", items: ["JS/TS", "Python", "C#", "Go", "Ruby", "Java", "Arduino"] },
];

// SOCIAL LINKS
export const socialLinks = {
  github: "https://github.com/4firas",
  instagram: "https://instagram.com/firas.stills",
  bluesky: "https://bsky.app/profile/4firas.bsky.social",
  gunslol: "https://guns.lol/4firas",
  youtube: "https://youtube.com/@4firas",
};

// CONTACT
export const contactEmail = "hello@fir4s.com";
export const contactSubject = "Yo Fir4s";
export const contactBody = "Hey, I checked your site and wanted to reach out.";
export const contactHref = `mailto:${contactEmail}?subject=${encodeURIComponent(contactSubject)}&body=${encodeURIComponent(contactBody)}`;

// PHOTOGRAPHY - 13 photos (Vercel blob hosted)
export interface Photo {
  title: string;
  url: string;
  description?: string;
  type?: string;
}

export const photos: Photo[] = [
  { title: "Urban Colors", url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/k0YlTbnbKGVEUpevZlbGX71glZSp7a.jpg", description: "Colorful apartment building against blue sky" },
  { title: "Yellow & Teal", url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IKzJ6vLHR1GbcXaNPRTTzX1yVoIbyA.jpg" },
  { title: "Modernist Architecture", url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bc5x6yrs67LNMilcCLo1D9hEW5tCnh.jpg" },
  { title: "Mirror in the Garden", url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/88QNFfhUGgGxDIyu1C3szdwN3EFFIo.jpg" },
  { title: "Palm Trees", url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/m68tVCwlHQ3vcFaoTX0Mjrci0eMFdT.jpg" },
  { title: "Parking Lot Exit", url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sLZ2564WL4SQls45f389TegUqvMKmq.jpg" },
  { title: "Walrus Board", url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mx4te9CQt4Lu25NKbz0RVpzaCJAibN.jpg" },
  { title: "Palm Pathway", url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/JqjWer4frRidrwQoDKVQTrkNNYmznF.jpg" },
  { title: "Mountain Vista", url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6ol5nJM0p0fMsSjmFOmM6trwdWEtd.jpg" },
  { title: "Traditional Crafts", url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/OEgh3jYNcOTVm02wvZlVbXXZhr9KGI.jpg" },
  { title: "Red Room", url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/QoGTClRCRkdallxDMVebeZCFVVeV4q8.jpg", type: "artwork" },
  { title: "Striped Poles", url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lJjgHPaalZ4OA5dkPcHwvXUWdAdgGc.jpg" },
  { title: "Aquarium", url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7orp9E8qHEG0oYf7T9XmLKO516nQkD.jpg" },
];

// DIGITAL ARTWORK - 4 pieces (served from /public)
export interface Artwork {
  title: string;
  path: string;
  description?: string;
}

export const artwork: Artwork[] = [
  { title: "Firael", path: "/firael.png", description: "OC character design" },
  { title: "Fern", path: "/fern.png" },
  { title: "Just As You Are (Kiyo fanart)", path: "/just-as-you-are.jpg" },
  { title: "In Time", path: "/IN-time.png" },
];

// PROJECTS
export interface Project {
  title: string;
  slug: string;
  shortTitle: string;
  subTitle: string;
  description: string;
  color1?: { rgb: { r: number; g: number; b: number } };
  body?: unknown;
  client?: string;
  designers?: Array<{ name?: string; url?: string }>;
  links?: Array<{ text?: string; url?: string }>;
  gifUrl?: string;
}

export const projects: Project[] = [
  { title: "fir4s.com", slug: "fir4s-com", shortTitle: "Portfolio", subTitle: "My portfolio site", description: "A retro Windows-inspired portfolio built with Next.js and React", color1: { rgb: { r: 187, g: 139, b: 65 } } },
  { title: "Stylizer", slug: "stylizer", shortTitle: "Stylizer", subTitle: "BetterDiscord Plugin", description: "AI-powered Discord response plugin with 17 personality styles", color1: { rgb: { r: 187, g: 139, b: 65 } } },
  { title: "VFX Work", slug: "vfx", shortTitle: "VFX", subTitle: "Motion & Effects", description: "Coloring, compositing, and visual effects for video", color1: { rgb: { r: 52, g: 83, b: 99 } }, links: [{ text: "Watch on YouTube", url: "https://www.youtube.com/watch?v=L8YpgOelN4k" }], gifUrl: "/videos/DisorderDisbeliefDiscombobulation.gif" },
  { title: "Photography", slug: "photography", shortTitle: "Photos", subTitle: "Still & Motion", description: "Urban architecture, street photography, nature", color1: { rgb: { r: 86, g: 115, b: 130 } }, gifUrl: "/videos/Felt.gif" },
  { title: ".sisyphus", slug: "sisyphus", shortTitle: "Sisyphus", subTitle: "File Organization", description: "Automated file organization system, 34,514 files sorted", color1: { rgb: { r: 187, g: 139, b: 65 } } },
];
