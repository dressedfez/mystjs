import { CitationRenderer } from 'citation-js-utils';
import { Frontmatter, WebConfig } from '../config/types';
import { ISession } from '../session/types';

export interface IDocumentCache {
  session: ISession;

  options: Options;

  config: SiteConfig | null;

  readConfig(): Promise<void>;

  writeConfig(): Promise<void>;
}

export type FolderConfig = Frontmatter;

export interface FolderContext {
  folder: string;
  config: FolderConfig;
  citeRenderer: CitationRenderer;
}

export interface Page {
  title: string;
  slug?: string;
  level: number;
}

export type SiteFolder = {
  title: string;
  index: string;
  pages: Page[];
};

export interface SiteConfig {
  site: WebConfig;
  folders: Record<string, SiteFolder>;
}

export type Options = {
  buildPath?: string;
  clean?: boolean;
  force?: boolean;
  branch?: string;
  yes?: boolean;
};
