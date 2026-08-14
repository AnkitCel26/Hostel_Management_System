import type { Request, Response } from 'express';

export interface UserPayload {
  id: string;
  role: string;
  email: string;
  isActive:boolean;
}

export interface GraphQLContext {
  req: Request;
  res: Response;
  user?: UserPayload | null; 
}