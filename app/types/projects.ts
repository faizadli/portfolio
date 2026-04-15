interface ProjectUrl {
  text: string;
  url: string;
}

export type ProjectKind = "project" | "certificate";

export interface Project {
  kind: ProjectKind;
  title: string;
  date: string;
  subtext: string;
  image?: string;
  issuer?: string;
  stack?: string;
  tags?: string[];
  url?: string;
  urls?: ProjectUrl[];
}