export interface Release {
  id: string;
  title: string;
  masterId: string;
  releaseDate?: Date;
  artistIds: string[];
  trackIds: string[];
}
