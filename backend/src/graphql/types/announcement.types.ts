export interface CreateAnnouncementInput {
  pgId: string;
  title: string;
  content: string;
}

export interface CreateAnnouncementArgs {
  input: CreateAnnouncementInput;
}

export interface UpdateAnnouncementArgs {
  announcementId: string;
  input: {
    isActive: boolean;
  };
}