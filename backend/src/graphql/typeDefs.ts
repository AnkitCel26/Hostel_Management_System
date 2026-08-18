export const typeDefs = `#graphql
  
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    phone: String!
    isActive:Boolean!
    createdAt:String!
    updatedAt:String!
  }

  input RegisterUserInput {
    name: String!
    email: String!
    password: String!
    role: String!
    phone: String!
  }

  input LoginUserInput {
    email: String!
    password: String!
  }

  type RegisterUserResponse {
    message: String!
    user: User!
  }

  type LoginUserResponse {
    message: String!
    user: User!
  }

  type LogoutUserResponse {
    message: String!
  }

  input UpdateProfileInput {
    name: String
    phone: String
  }

  type UpdateProfileResponse {
    message: String!
    user: User!
  }

  type Pg {
  id: ID!
  name: String!
  address: String!
  city: String!
  state: String!
  pincode: String!
  contactNo:String!
  description:String
  isActive:Boolean!
  createdAt:String!
  updatedAt:String!
}

input CreatePgInput {
  name: String!
  address: String!
  city: String!
  state: String!
  pincode: String!
  contactNo:String!
  description:String!
}

type CreatePgResponse {
  message: String!
  pg: Pg!
}

input UpdatePgInput {
    address: String
    contactNo: String
    description: String
    city: String
    state: String
    pincode: String
    isActive:Boolean
}

type UpdatePgResponse{
  message: String!
  pg: Pg!
}


type Room {
  id: ID!
  pgId:ID!
  roomNo: Int!
  floor: Int!
  capacity: Int!
  occupiedNo: Int!
  monthlyRent: Float!
  status:String!
  createdAt:String!
  updatedAt:String!
}

input CreateRoomInput {
  pgId:ID!
  roomNo: Int!
  floor: Int!
  capacity: Int!
  occupiedNo: Int!
  monthlyRent: Float!
}

type CreateRoomResponse {
  message: String!
  room: Room!
}

input UpdateRoomInput {
  occupiedNo: Int
  monthlyRent: Float
  status:String
}

type UpdateRoomResponse{
  message: String!
  room: Room!
}

type Tenant {
  id: ID!
  userId: ID!
  pgId: ID!
  roomId: ID
  joiningDate: String!
  status: String!
  createdAt:String!
  updatedAt:String!
}

input CreateTenantInput {
  userId: ID!
  pgId: ID!
  roomId: ID
  joiningDate: String!
}

type CreateTenantResponse {
  message: String!
  tenant: Tenant!
}

input UpdateTenantInput {
  tenantId: ID!
  joiningDate: String
  status: String
  roomId: ID
}

type UpdateTenantResponse {
  message: String!
  tenant: Tenant!
}

enum Document {
  aadhaar
  pan
}

type TenantDocument {
  id: ID!
  tenantId: ID!
  documentType: Document!
  fileUrl: String!
  createdAt:String!
  updatedAt:String!
}

input uploadTenantDocsInput {
  tenantId: ID!
  documentType: Document!
  fileUrl: String!
}

type uploadTenantDocsResponse {
  message: String!
  document: TenantDocument!
}

input UpdateTenantDocInput {
  documentType: Document
  fileUrl: String
}

type UpdateTenantDocResponse {
  message: String!
  document: TenantDocument!
}

enum PaymentMode {
    cash
    upi
    card
  }

  enum PaymentStatus {
    partial
    paid
  }

  type RentPayment {
    id: ID!
    tenantId: ID!
    month: String!
    year: Int!
    amount: Float!
    paidAmount: Float!
    dueDate: String!
    paymentDate: String
    paymentMode: PaymentMode
    receiptUrl: String
    status: PaymentStatus!
    createdAt:String!
    updatedAt:String!
  }

  input CreateRentPaymentInput {
    tenantId: ID!
    month: String!
    year: Int!
    amount: Float!
    paidAmount: Float!
    dueDate: String!
    paymentDate: String!
    paymentMode: PaymentMode!
  }

  type RentPaymentResponse {
    message: String!
    payment: RentPayment!
  }

  input UpdateRentPaymentInput {
    paidAmount: Float!
    paymentDate: String!
    paymentMode: PaymentMode!
  }
  
  type UpdateRentPaymentResponse{
    message:String!
    payment: RentPayment!
  }


enum ComplaintStatus {
  open
  in_progress
  resolved
  closed
}

type Complaint {
  id: ID!
  tenantId: ID!
  pgId: ID!
  title: String!
  description: String!
  status: ComplaintStatus!
  documentUrl: String
  createdAt:String!
  updatedAt:String!
  resolvedAt: String

}

input CreateComplaintInput {
  title: String!
  description: String!
  documentUrl: String
}

type ComplaintResponse {
  message: String!
  complaint: Complaint!
}

input UpdateComplaintInput {
  status: ComplaintStatus!
}

type UpdateComplaintResponse {
  message: String!
  complaint: Complaint!
}

type Announcement {
  id: ID!
  pgId: ID!
  createdBy: ID!
  title: String!
  content: String!
  isActive: Boolean!
  createdAt:String!
  updatedAt:String!
  pg:Pg!
}

input CreateAnnouncementInput {
  pgId: ID!
  title: String!
  content: String!
}

type CreateAnnouncementResponse {
  message: String!
  announcement: Announcement!
}

input UpdateAnnouncementInput {
  isActive:Boolean!
}

type UpdateAnnouncementResponse {
  message: String!
  announcement: Announcement!
}

 type AllPgs {
  id: ID!
  name: String!
  address: String!
  city: String!
  state: String!
  pincode: String!
  contactNo:String!
  description:String
  isActive:Boolean!
  createdAt:String!
  updatedAt:String!
  rooms:[Room!]!
}

type TenantPgRoomResponse {
  message: String!
  tenant: Tenant!
  pg: Pg!
  room: Room!
}

type TenantRentPaymentResponse {
  message: String!
  monthlyRent: Float!
  paymentHistory: [RentPayment!]!
}
  type AllTenant {
  id: ID!
  userId: ID!
  pgId: ID!
  roomId: ID
  joiningDate: String!
  status: String!
  createdAt: String!
  updatedAt: String!

  user: User!
  pg: Pg!
  room: Room
}


type AdminTenant {
  id: ID!
  user: User!
  pg: Pg!
  room: Room
}


type AdminRentPayment {
  id: ID!
  tenantId: ID!
  month: String!
  year: Int!
  amount: Float!
  paidAmount: Float!
  dueDate: String!
  paymentDate: String
  paymentMode: PaymentMode
  receiptUrl: String
  status: PaymentStatus!
  createdAt: String!
  updatedAt: String!

  tenant: AdminTenant!
}

type AdminRentSummary {
  pgId: ID!
  pgName: String!
  totalRooms: Int!
  occupiedRooms: Int!
  totalRent: Float!
  paidRent: Float!
  dueRent: Float!
}

type AdminComplaintTenant {
  id: ID!
  user: User!
  pg: Pg!
  room: Room
}

type AdminComplaint {
  id: ID!
  tenantId: ID!
  pgId: ID!
  title: String!
  description: String!
  status: ComplaintStatus!
  documentUrl: String
  createdAt: String!
  updatedAt: String!
  resolvedAt: String
  tenant: AdminComplaintTenant!
}

type RefreshTokenResponse {
  message: String!
}

   type Query {
    me: User!
    allUsers:[User!]!
    getAllPgsRooms:[AllPgs!]!
    getTenantPgRoom(userId:ID!):TenantPgRoomResponse!
    getAllRentPayments: [AdminRentPayment!]!
     getAdminRentSummary( month: String! year: Int!): [AdminRentSummary!]!
    getRentPaymentHistory(userId:ID!):TenantRentPaymentResponse!
    getTenantComplaints:[Complaint!]!
    getAllComplaints: [AdminComplaint!]!
    getAllAnnouncements: [Announcement!]!
    getTenantPgAnnouncements:[Announcement!]!
    getAllTenants:[AllTenant!]!
  }

  type Mutation {

    loginUser(input: LoginUserInput!): LoginUserResponse!

    logoutUser: LogoutUserResponse!

    refreshToken: RefreshTokenResponse!

    registerUser(input: RegisterUserInput!): RegisterUserResponse

    updateProfile(input: UpdateProfileInput!): UpdateProfileResponse!

    createPg(input: CreatePgInput!): CreatePgResponse!

    updatePg( pgId: String!,input: UpdatePgInput!): UpdatePgResponse!

    createRoom(input: CreateRoomInput!): CreateRoomResponse!

    updateRoom(roomId:String!,input:UpdateRoomInput!):UpdateRoomResponse!

    createTenant(input: CreateTenantInput!): CreateTenantResponse!

    updateTenant(input: UpdateTenantInput!): UpdateTenantResponse!

    uploadTenantDocs(input:uploadTenantDocsInput!): uploadTenantDocsResponse!

    updateTenantDocs(documentId: ID!,input: UpdateTenantDocInput!):UpdateTenantDocResponse!

    createRentPayment(input: CreateRentPaymentInput!): RentPaymentResponse!

    updateRentPayment(paymentId: ID!,input: UpdateRentPaymentInput!): UpdateRentPaymentResponse!

    createComplaint(input: CreateComplaintInput!): ComplaintResponse!

    updateComplaint(complaintId: ID!,input:UpdateComplaintInput!):UpdateComplaintResponse!

    createAnnouncement(input: CreateAnnouncementInput!): CreateAnnouncementResponse!

    updateAnnouncement(announcementId:ID!,input:UpdateAnnouncementInput!):UpdateAnnouncementResponse!

  }
`;
