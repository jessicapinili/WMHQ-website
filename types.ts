
export interface SectionContent {
  id: string;
  title: string;
  subtitle?: string;
  body: string;
  cta?: string;
  imageUrl?: string;
}

export interface AppState {
  hero: SectionContent;
  mission: SectionContent;
  programs: SectionContent[];
  testimonial: SectionContent;
  footer: {
    tagline: string;
    contact: string;
  };
}
