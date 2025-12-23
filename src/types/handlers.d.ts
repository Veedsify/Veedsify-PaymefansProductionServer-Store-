export interface ExtendedWithUser extends NextResponse {
  user: {
    userId: number | null;
  };
}
