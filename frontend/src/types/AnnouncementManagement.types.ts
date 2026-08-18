export type Announcement = {
  id: string;
  pgId: string;
  createdBy: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  pg: {
    name: string;
  };
};

export type AllPgs = {
  id: string;
  name: string;
};

export type GetAllAnnouncementsQuery = {
  getAllAnnouncements: Announcement[];
};

export type GetAllPgsRoomsQuery = {
  getAllPgsRooms: AllPgs[];
};

export type CreateAnnouncementInput = {
  pgId: string;
  title: string;
  content: string;
};

export type CreateAnnouncementMutation = {
  createAnnouncement: {
    message: string;
    announcement: Announcement;
  };
};

export type CreateAnnouncementMutationVariables = {
  input: CreateAnnouncementInput;
};

export type UpdateAnnouncementInput = {
  isActive: boolean;
};

export type UpdateAnnouncementMutation = {
  updateAnnouncement: {
    message: string;
    announcement: Announcement;
  };
};

export type UpdateAnnouncementMutationVariables = {
  announcementId: string;
  input: UpdateAnnouncementInput;
};
